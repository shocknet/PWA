import {
  encryptAESKey,
  generateAESKey,
  generateRSAKey
} from "../utils/Encryption";

export const ACTIONS = {
  ADD_USER_KEY: "encryption/userKey",
  SET_SESSION_KEY: "encryption/sessionKey"
};

export const initializeUserKey = id => async dispatch => {
  const userKey = await generateRSAKey();

  dispatch({
    type: ACTIONS.ADD_USER_KEY,
    data: {
      id,
      userKey
    }
  });
};

export const generateSessionKey = id => async dispatch => {
  const sessionKey = await generateAESKey();

  dispatch({
    type: ACTIONS.SET_SESSION_KEY,
    data: {
      id,
      sessionKey
    }
  });
};
