// @ts-check
export const ACTIONS = {
  RESET_AUTH_INFO: "auth/reset",
  SET_AUTH_STEP: "auth/step/set",
  SET_AUTHENTICATED: "auth/authenticated/set",
  SET_AUTH_METHOD: "auth/method/set",
  LOGOUT: "auth/logout",
  SAVE_INVITE: "auth/save/invite",
  SET_RELAY_ID: "auth/relay/set"

};

export const setAuthenticated = status => ({
  type: ACTIONS.SET_AUTHENTICATED,
  data: status
});

export const setAuthStep = step => ({
  type: ACTIONS.SET_AUTH_STEP,
  data: step
});

export const setAuthMethod = method => ({
  type: ACTIONS.SET_AUTH_METHOD,
  data: method
});

export const logout = () => ({
  type: ACTIONS.LOGOUT
});

export const saveInvite = (invite) => ({
  type: ACTIONS.SAVE_INVITE,
  data:invite
});
export const setRelayId = relayId => ({
  type: ACTIONS.SET_RELAY_ID,
  data: relayId
});
