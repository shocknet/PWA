import * as Common from "shock-common";
import { createAction } from "@reduxjs/toolkit";

import * as Schema from "../schema";
import * as Utils from "../utils";
import Http from "../utils/Http";
import { GUN_PROPS } from "../utils/Gun";
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
  RELOAD_FEED: "feed/reload"
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
        Utils.logger.debug(
          `Single post with id ${postID} from ...${author.slice(-8)} `,
          post
        );

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
    Utils.logger.debug(`Subbing to posts from ...${publicKey.slice(-8)}`);

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
        Utils.logger.debug(
          `Post with id ${postID} from ...${publicKey.slice(-8)} `,
          post
        );

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
    Utils.logger.debug(
      `Subbing to post content from ...${author.slice(-8)} for post ${postID}`
    );

    const subscription = rifle({
      query: `${author}::posts>${postID}>contentItems::map.on`,
      onData(contentItem: unknown, id: string) {
        Utils.logger.debug(
          `Post content subscription from ..${author.slice(
            -8
          )} for post ${postID} -> `,
          contentItem
        );

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
            `Invalid content item in post content subscription from ..${author.slice(
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

const USER_SHARED_POSTS_QUERY_SUFFIX = `::sharedPosts::on`;

export const subscribeSharedUserPosts = publicKey => async dispatch => {
  const subscription = await rifle({
    query: publicKey + USER_SHARED_POSTS_QUERY_SUFFIX,
    onData: posts => {
      console.debug(`shared posts from ${publicKey}: `, posts);
      const postEntries = Object.entries(posts);
      const newPosts = postEntries
        .filter(([key, value]) => value !== null && !GUN_PROPS.includes(key))
        .map(([key]) => key);
      const deletedPosts = postEntries
        .filter(([key, value]) => value === null && !GUN_PROPS.includes(key))
        .map(([key]) => key);

      newPosts.forEach(async function fetchAndDispatchSharedPost(id) {
        try {
          const res = await Http.get(
            `/api/gun/otheruser/${publicKey}/load/sharedPosts>${id}`
          );
          const { data: shared } = res;
          if (!shared.data || !shared.data.originalAuthor) {
            throw new Error(
              `invalid shared post provided for user ${publicKey}`
            );
          }
          const post = res.data.data as Common.SharedPostRaw;

          const processedPost = {
            authorId: publicKey,
            id,
            originalAuthor: post.originalAuthor,
            shareDate: post.shareDate,
            sharerId: publicKey,
            originalPost: undefined,
            type: "shared"
          } as Schema.SharedPost;
          dispatch({
            type: ACTIONS.ADD_USER_POST,
            data: processedPost
          });

          console.debug("dispatching shared post load");
          dispatch(loadSharedPost(id, post.originalAuthor, publicKey));
        } catch (e) {
          console.error(`User: ${publicKey}\npostID: ${id}\n error:`, e);
        }
      });

      deletedPosts.forEach(id =>
        dispatch({
          type: ACTIONS.DELETE_USER_POST,
          data: {
            id,
            authorId: publicKey
          }
        })
      );
    }
  });
  return subscription;
};

export const unsubUserSharedPosts = publicKey => () => {
  unsubscribeRifleByQuery(publicKey + USER_SHARED_POSTS_QUERY_SUFFIX);
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
