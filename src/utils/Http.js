import Http from "axios";
import * as Encryption from "./Encryption";

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

  if (process.env.SHOCK_ENCRYPTION === "false") {
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
    return response;
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
    const localRequest = config.url.indexOf("/") === 0;

    if (localRequest) {
      config.headers.common.Authorization = `Bearer ${authToken}`;
      config.headers.common["encryption-device-id"] = deviceId;
    }

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
      const response = await decryptResponse(error.response);
      error.response = response;
      return Promise.reject(error);
    } catch (err) {
      console.error(err);
      throw error;
    }
  }
);

export default Http;
