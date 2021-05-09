import Http from "axios";
import { ACTIONS } from "../actions/NodeActions";
import { ACTIONS as AUTH_ACTIONS } from "../actions/AuthActions";

const INITIAL_STATE = {
  hostId: null,
  hostIP: null,
  alias: null,
  authToken: null,
  publicKey: null,
  authTokenExpirationDate: null,
  authMethod: null,
  hostingAttemptsDone: false,
  webClientPrefix:"https://shock.pub"
};

const node = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.RESET_NODE_INFO: {
      return INITIAL_STATE;
    }
    case ACTIONS.SET_HOST_IP: {
      const hostIP = action.data;
      return {
        ...state,
        hostIP
      };
    }
    case ACTIONS.SET_HOST_ID: {
      const hostId = action.data;
      return {
        ...state,
        hostId
      };
    }
    case ACTIONS.SET_AUTHENTICATED_USER: {
      const {
        authToken,
        alias,
        publicKey,
        authTokenExpirationDate,
        authMethod
      } = action.data;

      Http.defaults.headers.common.Authorization = `Bearer ${authToken}`;

      return {
        ...state,
        authToken,
        authTokenExpirationDate,
        alias,
        publicKey,
        authMethod
      };
    }
    case ACTIONS.SET_ATTEMPTS_DONE: {
      return { ...state, hostingAttemptsDone: true };
    }

    case AUTH_ACTIONS.LOGOUT: {
      return {
        ...state,
        authToken: null,
        publicKey: null,
        authTokenExpirationDate: null,
        authMethod: null,
        hostingAttemptsDone: false
      };
    }
    case ACTIONS.SET_WEBCLIENT_PREFIX:{
      return {...state, webClientPrefix:action.data}
    }
    default:
      return state;
  }
};

export default node;
