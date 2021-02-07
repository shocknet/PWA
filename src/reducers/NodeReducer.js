import Http from "axios";
import { ACTIONS } from "../actions/NodeActions";

const INITIAL_STATE = {
  hostIP: null,
  alias: null,
  authToken: null,
  publicKey: null,
  authTokenExpirationDate: null
};

const node = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.RESET_NODE_INFO: {
      return INITIAL_STATE;
    }
    case ACTIONS.SET_HOST_IP:
      const hostIP = action.data;
      return {
        ...state,
        hostIP
      };
    case ACTIONS.SET_AUTHENTICATED_USER: {
      const {
        authToken,
        alias,
        publicKey,
        authTokenExpirationDate
      } = action.data;
      Http.defaults.headers.common.Authorization = `Bearer ${authToken}`;
      console.log(Http.defaults.headers.common.Authorization);
      return {
        ...state,
        authToken,
        authTokenExpirationDate,
        alias,
        publicKey
      };
    }
    default:
      return state;
  }
};

export default node;
