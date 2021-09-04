import * as Common from "shock-common";
import { createAction } from "@reduxjs/toolkit";

import * as Schema from "../schema";
import * as Utils from "../utils";
import Http from "../utils/Http";
import { rifle, unsubscribeRifleByQuery } from "../utils/WebSocket";

import { subscribeUserProfile } from "./UserProfilesActions";

export const ACTIONS = {
  RESET_FEED: "feed/reset",
  ADD_FOLLOW: "feed/follows/add",
  REMOVE_FOLLOW: "feed/follows/remove",
  UPDATE_FOLLOW: "feed/follows/update",
  LOAD_POSTS: "feed/posts/load",
  ADD_USER_POST: "feed/posts/add",
  DELETE_USER_POST: "feed/posts/delete",
  LOAD_SHARED_POST: "feed/sharedPosts/load",
  POST_TIPPED: "feed/posts/tipped",
  RELOAD_FEED: "feed/reload",
  RESET_DEFAULT_FOLLOWS: "follows/reload"
};

export const removeFollow = key => dispatch =>
  dispatch({
    type: ACTIONS.REMOVE_FOLLOW,
    data: key
  });

export const addFollow = follow => dispatch =>
  dispatch({
    type: ACTIONS.ADD_FOLLOW,
    data: follow
  });

export const loadSharedPost = (
  originalPostId,
  originalPublicKey,
  sharerPublicKey
) => async dispatch => {
  const { data: post } = await Http.get(
    `/api/gun/otheruser/${originalPublicKey}/load/posts>${originalPostId}`
  );
  dispatch(subscribeUserProfile(originalPublicKey));
  const tipSet = post.data.tipsSet ? Object.values(post.data.tipsSet) : [];
  const lenSet = tipSet.length;
  const tot =
    lenSet > 0 ? tipSet.reduce((acc, val) => Number(val) + Number(acc)) : 0;
  dispatch({
    type: ACTIONS.LOAD_SHARED_POST,
    data: {
      ...post.data,
      authorId: originalPublicKey,
      sharerId: sharerPublicKey,
      id: originalPostId,
      tipCounter: lenSet,
      tipValue: tot
    }
  });
};

export const postDeleted = createAction<{
  author: string;
  id: string;
}>("feed/postDeleted");

export const postReceived = createAction<{
  author: string;
  id: string;
  post: Schema.PostRaw;
}>("feed/postReceived");

export const subSinglePost = (author: string, postID: string) => (
  dispatch: (action: any) => void
): (() => void) => {
  try {
    const subscription = rifle({
      query: `${author}::posts>${postID}::on`,
      onData(post: string) {
        if (Schema.isPostRaw(post)) {
          dispatch(
            postReceived({
              author,
              id: postID,
              post
            })
          );
        } else if (post === null) {
          dispatch(
            postDeleted({
              author,
              id: postID
            })
          );
        }
      },
      onError(e) {
        Utils.logger.error(
          `Error inside single post sub ${postID} from ...${author.slice(
            -8
          )} -> `,
          e
        );
        alert(
          `Error inside single post sub ${postID} from ...${author.slice(
            -8
          )}: ${e.message}`
        );
      }
    });

    return () => {
      subscription.then(sub => {
        sub.off();
      });
    };
  } catch (e) {
    Utils.logger.error(
      `Could not sub to single post ${postID} from ...${author.slice(-8)} -> `,
      e
    );
    alert(
      `Could not sub to single post ${postID} from ...${author.slice(-8)}: ${
        e.message
      }`
    );

    return () => {};
  }
};

export const subscribeUserPosts = (publicKey: string) => (
  dispatch: (action: any) => void
): (() => void) => {
  try {
    const subscription = rifle({
      query: `${publicKey}::posts::map.on`,
      onError(e) {
        Utils.logger.error(
          `Error inside posts subscription for ...${publicKey.slice(-8)} -> `,
          e
        );
        alert(
          `Error inside posts subscription for ...${publicKey.slice(-8)}: ${
            e.message
          }`
        );
      },
      onData: (post: unknown, postID: string) => {
        if (Schema.isPostRaw(post)) {
          dispatch(
            postReceived({
              author: publicKey,
              id: postID,
              post
            })
          );
        } else if (post === null) {
          dispatch(
            postDeleted({
              author: publicKey,
              id: postID
            })
          );
        } else {
          Utils.logger.error(
            `In posts subscription for user ...${publicKey.slice(
              -8
            )}, invalid data -> `,
            post
          );
        }
      }
    });

    return () => {
      subscription.then(sub => {
        sub.off();
      });
    };
  } catch (e) {
    Utils.logger.error(
      `Could not sub to posts for ...${publicKey.slice(-8)} -> `,
      e
    );
    alert(`Could not sub to posts for ...${publicKey.slice(-8)}: ${e.message}`);

    return () => {};
  }
};

export const contentItemReceived = createAction<{
  author: string;
  contentItem: Common.ContentItem;
  id: string;
  postID: string;
}>("feed/contentItemReceived");

export const subPostContent = (author: string, postID: string) => (
  dispatch: (action: any) => void
): (() => void) => {
  try {
    const subscription = rifle({
      query: `${author}::posts>${postID}>contentItems::map.on`,
      onData(contentItem: unknown, id: string) {
        // CAST: unfortunate isContentItem typings
        if (Common.isContentItem(contentItem)) {
          dispatch(
            contentItemReceived({
              author,
              contentItem,
              id,
              postID
            })
          );
        } else {
          Utils.logger.error(
            `Invalid content item (${id}) in post content subscription from ..${author.slice(
              -8
            )} for post ${postID} -> `,
            contentItem
          );
        }
      },
      onError(e) {
        Utils.logger.error(
          `Error inside post content subscription from ...${author.slice(
            -8
          )} for post ${postID} -> `,
          e
        );
        alert(
          `Error inside post content subscription from ...${author.slice(
            -8
          )} for post ${postID}: ${e.message}`
        );
      }
    });
    return () => {
      subscription.then(sub => {
        sub.off();
      });
    };
  } catch (e) {
    Utils.logger.error(
      `Could not sub to post content from ...${author.slice(
        -8
      )} for post ${postID} -> `,
      e
    );
    alert(
      `Could not sub to posts from ...${author.slice(-8)} for post ${postID}: ${
        e.message
      }`
    );

    return () => {};
  }
};

const FOLLOWS_QUERY = "$user::follows::map.on";

export const subscribeFollows = () => async dispatch => {
  const subscription = await rifle({
    query: FOLLOWS_QUERY,
    reconnect: true,
    onData: async (follow, key) => {
      console.info(`processing follow`);
      console.info(follow);
      if (typeof key !== "string") {
        console.warn(`Invalid follow key received: ${key}`);
        return;
      }

      if (!follow) {
        dispatch(removeFollow(key));
        return;
      }

      if (typeof follow.user !== "string") {
        console.warn(`Invalid follow user received (${follow.user})`);
        return;
      }

      dispatch(addFollow(follow));
    }
  });

  console.debug("subbing follows");

  return subscription;
};

export const unsubscribeFollows = () => () => {
  console.debug("unsubbing follows");
  unsubscribeRifleByQuery(FOLLOWS_QUERY);
};

export const sendTipPost = ({
  publicKey,
  postId,
  amount
}) => async dispatch => {
  const { data } = await Http.post("/api/lnd/unifiedTrx", {
    type: "tip",
    amt: amount,
    to: publicKey,
    memo: "Post Tipped!",
    feeLimit: amount * 0.006 + 10, // TODO: Hardcoded fees for now
    ackInfo: postId
  });
  console.log(data);
  dispatch({
    type: ACTIONS.POST_TIPPED,
    data: {
      publicKey,
      postId,
      amount
    }
  });
};

export const deleteUserPost = ({ id, authorId }) => ({
  type: ACTIONS.DELETE_USER_POST,
  data: {
    id,
    authorId
  }
});

export const reloadFeed = () => ({
  type: ACTIONS.RELOAD_FEED
});

export const reloadFollows = (follows: Common.Follow[]) => ({
  type: ACTIONS.RESET_DEFAULT_FOLLOWS,
  data: follows
});

// #region sharedPosts

export const sharedPostDeleted = createAction<{
  postID: string;
  sharerPublicKey: string;
}>("feed/sharedPostDeleted");

export const sharedPostReceived = createAction<{
  originalAuthor: string;
  postID: string;
  shareDate: number;
  sharerPublicKey: string;
}>("feed/sharedPostReceived");

export const subSharedPosts = (sharerPublicKey: string) => (
  dispatch: (action: any) => void
): (() => void) => {
  try {
    const subscription = rifle({
      query: `${sharerPublicKey}::sharedPosts::map.on`,
      onError(e) {
        Utils.logger.error(
          `Error inside shared posts subscription for ...${sharerPublicKey.slice(
            -8
          )} -> `,
          e
        );
        alert(
          `Error inside shared posts subscription for ...${sharerPublicKey.slice(
            -8
          )}: ${e.message}`
        );
      },
      onData: (sharedPost: unknown, postID: string) => {
        if (Common.isSharedPostRaw(sharedPost)) {
          dispatch(
            sharedPostReceived({
              originalAuthor: sharedPost.originalAuthor,
              postID,
              shareDate: sharedPost.shareDate,
              sharerPublicKey
            })
          );
        } else if (sharedPost === null) {
          dispatch(
            sharedPostDeleted({
              postID,
              sharerPublicKey
            })
          );
        } else {
          Utils.logger.error(
            `In shared posts subscription for user ...${sharerPublicKey.slice(
              -8
            )}, invalid data -> `,
            sharedPost
          );
        }
      }
    });

    return () => {
      subscription.then(sub => {
        sub.off();
      });
    };
  } catch (e) {
    Utils.logger.error(
      `Could not sub to shared posts for ...${sharerPublicKey.slice(-8)} -> `,
      e
    );
    alert(
      `Could not sub to shared posts for ...${sharerPublicKey.slice(-8)}: ${
        e.message
      }`
    );

    return () => {};
  }
};

// #endregion sharedPosts

export const postTipReceived = createAction<{
  author: string;
  postID: string;
  tipAmt: number;
  tipID: string;
}>("feed/postTipReceived");

export const subPostTips = (author: string, postID: string) => (
  dispatch: (action: any) => void
): (() => void) => {
  try {
    const subscription = rifle({
      query: `${author}::posts>${postID}>tipsSet::map.on`,
      onData(tipAmt: unknown, tipID: string) {
        const nTipAmount = Number(tipAmt);
        if (nTipAmount !== NaN) {
          dispatch(
            postTipReceived({
              author,
              postID,
              tipAmt: nTipAmount,
              tipID
            })
          );
        } else {
          Utils.logger.error(
            `Post ${postID} tips sub, tipID ${tipID} got non number value -> `,
            tipAmt
          );
        }
      }
    });

    return () => {
      subscription.then(sub => {
        sub.off();
      });
    };
  } catch (e) {
    Utils.logger.error(
      `Could not subscribe to post tips from author ...${author.slice(
        -8
      )} with ID ${postID} -> `,
      e
    );
    alert(
      `Could not subscribe to post tips from author ...${author.slice(
        -8
      )} with ID ${postID}: ${e.message}`
    );
    return () => {};
  }
};
