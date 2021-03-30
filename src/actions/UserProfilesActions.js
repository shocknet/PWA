import { disconnectRifleSocket, rifle } from "../utils/WebSocket";

export const ACTIONS = {
  RESET_USER_PROFILES: "userProfiles/profiles/reset",
  LOAD_USER_PROFILE: "userProfiles/profiles/load",
  REMOVE_USER_PROFILE: "userProfiles/profiles/remove",
  UPDATE_USER_PROFILE: "userProfiles/profiles/update"
};

export const subscribeUserProfile = publicKey => async (dispatch, getState) => {
  const { hostIP } = getState().node;
  const subscription = await rifle({
    host: hostIP,
    query: `${publicKey}::Profile::on`,
    reconnect: true
  });

  subscription.on("$shock", profile => {
    const { [publicKey]: existingUser } = getState().userProfiles;

    if (existingUser) {
      dispatch({
        type: ACTIONS.UPDATE_USER_PROFILE,
        data: { publicKey, profile }
      });
      return profile;
    }

    dispatch({
      type: ACTIONS.LOAD_USER_PROFILE,
      data: { publicKey, profile }
    });
  });

  return subscription;
};

export const unsubscribeUserProfile = publicKey => async () => {
  disconnectRifleSocket(`${publicKey}::Profile::on`);
};
