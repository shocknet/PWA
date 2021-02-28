import { GUN_PROPS } from "../utils/Gun";
import Http from "../utils/Http";
import { disconnectRifleSocket, rifle } from "../utils/WebSocket";

export const ACTIONS = {
  RESET_FEED: "feed/reset",
  ADD_FOLLOW: "feed/follows/add",
  REMOVE_FOLLOW: "feed/follows/remove",
  UPDATE_FOLLOW: "feed/follows/update",
  LOAD_POSTS: "feed/posts/load",
  ADD_USER_POST: "feed/posts/add",
  DELETE_USER_POST: "feed/posts/delete",
  LOAD_SHARED_POST: "feed/sharedPosts/load"
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

const subscribeUserProfile = key => async (dispatch, getState) => {
  const { hostIP } = getState().node;
  const subscription = rifle({
    host: hostIP,
    query: `${key}::Profile::on`,
    reconnect: true
  });
  subscription.on("$shock", profile => {
    dispatch({
      type: ACTIONS.UPDATE_FOLLOW,
      data: { key, ...profile }
    });
  });
  return subscription;
};

export const loadSharedPost = (postId, publicKey) => async dispatch => {
  const { data: post } = await Http.get(
    `/api/gun/otheruser/${publicKey}/load/posts>${postId}`
  );

  dispatch({
    type: ACTIONS.LOAD_SHARED_POST,
    data: { ...post, author: publicKey, id: postId }
  });
};

export const subscribeUserPosts = publicKey => async (dispatch, getState) => {
  const { hostIP } = getState().node;
  const subscription = rifle({
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
          author: publicKey
        }
      });
    });

    deletedPosts.map(id =>
      dispatch({
        type: ACTIONS.DELETE_USER_POST,
        data: {
          id,
          author: publicKey,
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
  const subscription = rifle({
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
          author: publicKey,
          type: "shared"
        }
      });

      await loadSharedPost(id, publicKey);
    });

    deletedPosts.map(id =>
      dispatch({
        type: ACTIONS.DELETE_USER_POST,
        data: {
          id,
          author: publicKey
        }
      })
    );
  });
  return subscription;
};

export const subscribeFollows = () => (dispatch, getState) => {
  const { hostIP } = getState().node;
  const subscription = rifle({
    host: hostIP,
    query: "$user::follows::map.on",
    reconnect: true
  });

  subscription.on("$shock", async (follow, key) => {
    console.log("New Follow:", follow, key);
    if (typeof key !== "string") {
      console.warn(`Invalid follow key received: ${key}`);
      return;
    }

    if (!follow) {
      disconnectRifleSocket(`${key}::Profile::on`);
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
  });

  return subscription;
};
