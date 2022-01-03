import { v4 as uuidv4 } from "uuid";
import Http from "axios";
import { setHostId } from "./NodeActions";
import { generateKeyPair } from "../utils/Encryption";

export const ACTIONS = {
  ADD_USER_KEY_PAIR: "encryption/userKeyPair",
  ADD_HOST_KEY: "encryption/hostKey",
  SET_DEVICE_ID: "encryption/deviceId"
};

let exchangeSource = Http.CancelToken.source();

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
  const { deviceId } = getState().encryption;

  if (!deviceId) {
    const newDeviceId = dispatch(generateDeviceId());
    return newDeviceId;
  }

  return deviceId;
};

export const exchangeKeyPair = () => async dispatch => {
  try {
    if (exchangeSource) {
      exchangeSource.cancel(
        "Key Pair exchange operation is preceded by another one"
      );
      exchangeSource = null;
    }

    exchangeSource = Http.CancelToken.source();
    const deviceId = dispatch(getDeviceId());

    const keyPair = generateKeyPair();
    const { data } = await Http.post(
      `/api/encryption/exchange`,
      {
        publicKey: keyPair.publicKeyBase64,
        deviceId
      },
      {
        cancelToken: exchangeSource.token
      }
    );

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
      deviceId,
      user: keyPair,
      host: data
    };
  } catch (err) {
    console.error("[ENCRYPTION] Key Exchange Error:", err);
    throw err;
  }
};
