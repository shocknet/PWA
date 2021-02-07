import { ACTIONS } from "../actions/AuthActions";

const INITIAL_STATE = {
  authenticated: false,
  authStep: "host",
  userSessionKey: null,
  APISessionKey: null
};

const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_AUTHENTICATED: {
      return { ...state, authenticated: action.data };
    }
    case ACTIONS.SET_AUTH_STEP: {
      return {
        ...state,
        authStep: action.data
      };
    }
    default:
      return state;
  }
};

export default auth;
