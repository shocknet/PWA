import { ACTIONS } from "../actions/AuthActions";

const INITIAL_STATE = {
  authenticated: false,
  authStep: "host",
  authMethod: null,
  relayId:null
};

const defaultSteps = {
  manual: "host",
  shockWizard: "scan",
  shockCloud: "inviteCode",
  hostingTiers: "chooseTier"
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
    case ACTIONS.LOGOUT: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

export default auth;
