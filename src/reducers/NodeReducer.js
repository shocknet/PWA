import Http from "axios";
import { ACTIONS } from "../actions/NodeActions";

const INITIAL_STATE = {
  hostId: null,
  hostIP: null,
  alias: null,
  authToken: null,
  publicKey: null,
  authTokenExpirationDate: null,
  authMethod: null,
  hostingAttemptsDone:false
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
    case ACTIONS.SET_ATTEMPTS_DONE :{
      return {...state, hostingAttemptsDone:true}
    }
    default:
      return state;
  }
};

export default node;
