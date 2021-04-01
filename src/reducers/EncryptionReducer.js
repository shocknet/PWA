import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "../actions/EncryptionActions";

const INITIAL_STATE = {
  deviceId: uuidv4(),
  userKeys: {},
  hostKeys: {}
};

const encryption = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_DEVICE_ID: {
      const deviceId = action.data;
      return {
        ...state,
        deviceId
      };
    }
    case ACTIONS.ADD_USER_KEY_PAIR: {
      const { hostId, keyPair } = action.data;
      return { ...state, userKeys: { ...state.userKeys, [hostId]: keyPair } };
    }
    case ACTIONS.ADD_HOST_KEY: {
      const { hostId, publicKey } = action.data;
      return { ...state, hostKeys: { ...state.hostKeys, [hostId]: publicKey } };
    }
    default:
      return state;
  }
};

export default encryption;
