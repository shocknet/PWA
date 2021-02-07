import { ACTIONS } from "../actions/EncryptionActions";

const INITIAL_STATE = {
  userKeys: {},
  sessionKey: null,
  APIPublicKey: null
};

const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_AUTH_STEP: {
      return action.data;
    }
    default:
      return state;
  }
};

export default auth;
