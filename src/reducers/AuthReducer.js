import { ACTIONS } from "../actions/AuthActions";

const INITIAL_STATE = {
  authenticated: false,
  authStep: "host",
  authMethod: null,
  userSessionKey: null,
  APISessionKey: null
};

const defaultSteps = {
  manual: "host",
  shockWizard: "scan",
  shockCloud: "inviteCode"
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
    case ACTIONS.SET_AUTH_METHOD: {
      const method = action.data;
      return {
        ...state,
        authMethod: method,
        authStep: defaultSteps[method]
      };
    }
    default:
      return state;
  }
};

export default auth;
