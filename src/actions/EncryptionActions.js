import { v4 as uuidv4 } from "uuid";
import Http from "axios";
import { setHostId } from "./NodeActions";
import { generateKeyPair } from "../utils/Encryption";

export const ACTIONS = {
  ADD_USER_KEY_PAIR: "encryption/userKeyPair",
  ADD_HOST_KEY: "encryption/hostKey",
  SET_DEVICE_ID: "encryption/deviceId"
};

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

let isExchanging = false;

/** @returns {Promise<void>} */
const waitForCurrExchangeIfAny = async () => {
  if (!isExchanging) {
    return;
  }
  await new Promise(res => setTimeout(res, 750));

  return waitForCurrExchangeIfAny();
};

let lastPair = null;

export const exchangeKeyPair = () => async dispatch => {
  try {
    console.log("before check");
    await waitForCurrExchangeIfAny();
    if (lastPair) {
      return lastPair;
    }
    isExchanging = true;
    console.log("after check");

    const deviceId = dispatch(getDeviceId());

    const keyPair = generateKeyPair();
    const { data } = await Http.post(`/api/encryption/exchange`, {
      publicKey: keyPair.publicKeyBase64,
      deviceId
    });

    lastPair = {
      deviceId,
      user: keyPair,
      host: data
    };

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

    return lastPair;
  } catch (err) {
    console.error("[ENCRYPTION] Key Exchange Error:", err);
    throw err;
  } finally {
    console.log("finally");
    isExchanging = false;
  }
};
