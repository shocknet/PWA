export const ACTIONS = {
  RESET_AUTH_INFO: "auth/reset",
  SET_AUTH_STEP: "auth/step",
  SET_AUTHENTICATED: "auth/authenticated"
};

export const setAuthenticated = status => dispatch => {
  dispatch({
    type: ACTIONS.SET_AUTHENTICATED,
    data: status
  });
};

export const setAuthStep = step => dispatch => {
  dispatch({
    type: ACTIONS.SET_AUTH_STEP,
    data: step
  });
};
