// @ts-check
export const ACTIONS = {
  RESET_AUTH_INFO: "auth/reset",
  SET_AUTH_STEP: "auth/step/set",
  SET_AUTHENTICATED: "auth/authenticated/set",
  SET_AUTH_METHOD: "auth/method/set",
  LOGOUT: "auth/logout"
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
