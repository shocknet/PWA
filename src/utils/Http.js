import Http from "axios";
import { setAuthenticated } from "../actions/AuthActions";
import { exchangeKeyPair } from "../actions/EncryptionActions";
import * as Encryption from "./Encryption";
import { safeParseJSON } from "./JSON";

const unprotectedRoutes = {
  GET: [
    "/healthz",
    "/ping",
    // Errors out when viewing an API page from the browser
    "/favicon.ico",
    "/api/lnd/wallet/status"
  ],
  POST: ["/api/security/exchangeKeys", "/api/encryption/exchange"],
  PUT: [],
  DELETE: []
};

const encryptRequest = async config => {
  const { store } = await import("../store");
  const { hostKeys } = store.getState().encryption;
  const { hostId } = store.getState().node;

  const { data } = config;

  const remotePublicKey = hostKeys[hostId];

  if (process.env.REACT_APP_SHOCK_ENCRYPTION_ECC === "false") {
    return config;
  }

  if (!remotePublicKey) {
    console.warn(
      "[ENCRYPTION] Unable to retrieve key for specified Host ID:",
      hostId,
      hostKeys
    );
    return config;
  }

  const encryptedMessage = await Encryption.encryptMessage({
    publicKey: remotePublicKey,
    message: JSON.stringify(data)
  });

  return {
    ...config,
    data: encryptedMessage
  };
};

const decryptResponse = async response => {
  if (!response) {
    return response;
  }

  const { store } = await import("../store");
  const { userKeys } = store.getState().encryption;
  const { hostId } = store.getState().node;

  const { data } = response;

  if (!Encryption.isEncryptedMessage(data)) {
    return { ...response, data: safeParseJSON(response.data) };
  }

  const localPrivateKey = userKeys[hostId]?.privateKey;

  if (!localPrivateKey) {
    console.warn(
      "[ENCRYPTION] Unable to retrieve key for specified Host ID:",
      hostId,
      userKeys
    );
    return response;
  }

  const decryptedMessage = await Encryption.decryptMessage({
    privateKey: localPrivateKey,
    encryptedMessage: data
  });

  return { ...response, data: decryptedMessage };
};

Http.interceptors.request.use(async config => {
  try {
    const { store } = await import("../store");
    const { authToken } = store.getState().node;
    const { deviceId } = store.getState().encryption;
    const { relayId } = store.getState().node;
    const localRequest = config.url.indexOf("/") === 0;

    if (localRequest) {
      config.headers.common.Authorization = `Bearer ${authToken}`;
      config.headers.common["encryption-device-id"] = deviceId;
      if (relayId) {
        /////
        config.headers.common["x-shock-hybrid-relay-id-x"] = relayId;
        /////
      }
    }

    // @ts-ignore
    config.originalData = config.originalData || config.data;

    if (
      localRequest &&
      !unprotectedRoutes[config.method.toUpperCase()].includes(config.url)
    ) {
      return await encryptRequest(config);
    }

    return config;
  } catch (error) {
    console.error(error);
  }
});

Http.interceptors.response.use(
  async response => {
    return decryptResponse(response);
  },
  async error => {
    try {
      const { store } = await import("../store");
      const response = await decryptResponse(error.response);
      error.response = response;
      console.error("Error status:", error.response);
      if (!response) {
        store.dispatch(setAuthenticated(false));
      }
      if (
        response?.data.field === "deviceId" &&
        (error.config.retries ?? 0) < 2
      ) {
        store.dispatch(setAuthenticated(false));
        const keyPair = await exchangeKeyPair()(store.dispatch);
        error.config.retries = (error.config.retries ?? 0) + 1;
        return Http({
          ...error.config,
          data: error.config.originalData,
          headers: {
            ...error.config.headers,
            "encryption-device-id": keyPair.deviceId
          }
        });
      }
      return Promise.reject(error);
    } catch (err) {
      console.error(err);
      throw error;
    }
  }
);

export default Http;
