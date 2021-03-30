import { v4 as uuidv4 } from "uuid";
import Http from "axios";
import { setHostId } from "./NodeActions";
import { generateKeyPair } from "../utils/Encryption";

export const ACTIONS = {
  ADD_USER_KEY_PAIR: "encryption/userKeyPair",
  ADD_HOST_KEY: "encryption/hostKey",
  SET_DEVICE_ID: "encryption/deviceId"
};

let exchangingKeypair = null;

export const generateDeviceId = () => dispatch => {
  const deviceId = uuidv4();
  dispatch({
    type: ACTIONS.SET_DEVICE_ID,
    data: deviceId
  });
  return deviceId;
};

export const addUserKeyPair = ({ hostId, keyPair }) => dispatch => {
  dispatch({
    type: ACTIONS.ADD_USER_KEY_PAIR,
    data: { hostId, keyPair }
  });
};

export const addHostKey = ({ hostId, publicKey }) => dispatch => {
  dispatch({
    type: ACTIONS.ADD_HOST_KEY,
    data: {
      hostId,
      publicKey
    }
  });
};

const getDeviceId = () => (dispatch, getState) => {
  const { deviceId } = getState().node;

  if (!deviceId) {
    const newDeviceId = dispatch(generateDeviceId());
    return newDeviceId;
  }

  return deviceId;
};

export const exchangeKeyPair = () => async dispatch => {
  try {
    const deviceId = dispatch(getDeviceId());

    const keyPair = generateKeyPair();
    const { data } = await Http.post(`/api/encryption/exchange`, {
      publicKey: keyPair.publicKeyBase64,
      deviceId
    });

    dispatch(
      addUserKeyPair({
        hostId: data.hostId,
        keyPair
      })
    );

    dispatch(
      addHostKey({
        hostId: data.hostId,
        publicKey: data.APIPublicKey
      })
    );

    dispatch(setHostId(data.hostId));

    return {
      user: keyPair,
      host: data
    };
  } catch (err) {
    console.error("[ENCRYPTION] Key Exchange Error:", err);
    throw err;
  }
};

export const throttledExchangeKeyPair = () => async dispatch => {
  try {
    if (!exchangingKeypair) {
      exchangingKeypair = dispatch(exchangeKeyPair());
    }

    const result = await exchangingKeypair;

    // eslint-disable-next-line require-atomic-updates
    exchangingKeypair = null;

    return result;
  } catch (err) {
    console.error(err);
    exchangingKeypair = null;
    throw err;
  }
};
