// @ts-check
import { GUN_PROPS } from "../utils/Gun";
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
  POST_TIPPED: "feed/posts/tipped"
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

  dispatch({
    type: ACTIONS.LOAD_SHARED_POST,
    data: {
      ...post.data,
      authorId: originalPublicKey,
      sharerId: sharerPublicKey,
      id: originalPostId
    }
  });
};

const USER_POSTS_QUERY_SUFFIX = `::posts::on`;

export const subscribeUserPosts = publicKey => async dispatch => {
  const subscription = await rifle({
    query: publicKey + USER_POSTS_QUERY_SUFFIX,
    onData: posts => {
      console.debug(`posts from: ${publicKey}: `, posts);
      const postEntries = Object.entries(posts);
      const newPosts = postEntries
        .filter(([key, value]) => value !== null && !GUN_PROPS.includes(key))
        .map(([key]) => key);
      const deletedPosts = postEntries
        .filter(([key, value]) => value === null && !GUN_PROPS.includes(key))
        .map(([key]) => key);

      newPosts.map(async id => {
        const { data: post } = await Http.get(
          `/api/gun/otheruser/${publicKey}/load/posts>${id}`
        );

        dispatch({
          type: ACTIONS.ADD_USER_POST,
          data: {
            ...post.data,
            id,
            authorId: publicKey,
            type: "post"
          }
        });
      });

      deletedPosts.map(id =>
        dispatch({
          type: ACTIONS.DELETE_USER_POST,
          data: {
            id,
            authorId: publicKey,
            type: "post"
          }
        })
      );
    }
  });
  return subscription;
};

export const unsubUserPosts = publicKey => async () => {
  unsubscribeRifleByQuery(publicKey + USER_POSTS_QUERY_SUFFIX);
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

          /** @type {import('shock-common').SharedPostRaw} */
          const post = res.data.data;

          /** @type {import('../schema').SharedPost} */
          const processedPost = {
            authorId: publicKey,
            id,
            originalAuthor: post.originalAuthor,
            shareDate: post.shareDate,
            sharerId: publicKey,
            originalPost: undefined,
            type: "shared"
          };
          dispatch({
            type: ACTIONS.ADD_USER_POST,
            data: processedPost
          });

          console.debug("dispatching shared post load");
          dispatch(loadSharedPost(id, post.originalAuthor, publicKey));
        } catch (e) {
          console.error(
            `When subscribed to shared posts from public key --| ${publicKey} |-- and trying to download the shared post with id: --| ${id} |-- an error ocurred:`,
            e
          );
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
