import { GUN_PROPS } from "../utils/Gun";
import Http from "../utils/Http";
import { rifle } from "../utils/WebSocket";
import {
  subscribeUserProfile,
  unsubscribeUserProfile
} from "./UserProfilesActions";

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
  postId,
  publicKey,
  sharerPublicKey
) => async dispatch => {
  const { data: post } = await Http.get(
    `/api/gun/otheruser/${publicKey}/load/posts>${postId}`
  );
  dispatch(subscribeUserProfile(publicKey));

  dispatch({
    type: ACTIONS.LOAD_SHARED_POST,
    data: {
      ...post.data,
      authorId: publicKey,
      sharerId: sharerPublicKey,
      id: postId
    }
  });
};

export const subscribeUserPosts = publicKey => async (dispatch, getState) => {
  const { hostIP } = getState().node;
  const subscription = await rifle({
    host: hostIP,
    query: `${publicKey}::posts::on`
  });
  subscription.on("$shock", posts => {
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
  });
  return subscription;
};

export const subscribeSharedUserPosts = publicKey => async (
  dispatch,
  getState
) => {
  const { hostIP } = getState().node;
  const subscription = await rifle({
    host: hostIP,
    query: `${publicKey}::sharedPosts::on`
  });
  subscription.on("$shock", posts => {
    const postEntries = Object.entries(posts);
    const newPosts = postEntries
      .filter(([key, value]) => value !== null && !GUN_PROPS.includes(key))
      .map(([key]) => key);
    const deletedPosts = postEntries
      .filter(([key, value]) => value === null && !GUN_PROPS.includes(key))
      .map(([key]) => key);

    newPosts.map(async id => {
      const { data: post } = await Http.get(
        `/api/gun/otheruser/${publicKey}/load/sharedPosts>${id}`
      );

      dispatch({
        type: ACTIONS.ADD_USER_POST,
        data: {
          ...post.data,
          id,
          authorId: publicKey,
          type: "shared"
        }
      });

      await loadSharedPost(id, post.data.originalAuthor, publicKey)(dispatch);
    });

    deletedPosts.map(id =>
      dispatch({
        type: ACTIONS.DELETE_USER_POST,
        data: {
          id,
          authorId: publicKey
        }
      })
    );
  });
  return subscription;
};

export const subscribeFollows = () => async (dispatch, getState) => {
  const { hostIP, publicKey } = getState().node;
  const subscription = await rifle({
    host: hostIP,
    query: "$user::follows::map.on",
    reconnect: true
  });
  console.log("subbing follows");
  //-- Subscribe to self, posts and shared posts are merged
  //dispatch(subscribeUserProfile(publicKey))
  dispatch(subscribeUserPosts(publicKey));
  dispatch(subscribeSharedUserPosts(publicKey));

  subscription.on("$shock", async (follow, key) => {
    if (typeof key !== "string") {
      console.warn(`Invalid follow key received: ${key}`);
      return;
    }

    if (!follow) {
      unsubscribeUserProfile(key);
      dispatch(removeFollow(key));
      return;
    }

    if (typeof follow.user !== "string") {
      console.warn(`Invalid follow user received (${follow.user})`);
      return;
    }

    dispatch(addFollow(follow));
    dispatch(subscribeUserProfile(follow.user));
    dispatch(subscribeUserPosts(follow.user));
    dispatch(subscribeSharedUserPosts(follow.user));
  });

  return subscription;
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
