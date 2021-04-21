// @ts-check
import jwtDecode from "jwt-decode";
import Http from "axios";
import { ACTIONS as AUTH_ACTIONS, setAuthenticated } from "./AuthActions";
import { parseError } from "../utils/Error";
import { throttledExchangeKeyPair } from "./EncryptionActions";
import { connectSocket } from "../utils/WebSocket";

export const ACTIONS = {
  RESET_NODE_INFO: "node/reset",
  SET_HOST_IP: "node/hostIP",
  SET_HOST_ID: "node/hostId",
  SET_AUTHENTICATED_USER: "node/authenticatedUser",
  SET_CONNECTION_STATUS: "node/connectionStatus",
  SET_NODE_HEALTH: "node/health",
  SET_ATTEMPTS_DONE: "node/attemptsDone"
};

export const resetNodeInfo = () => dispatch => {
  dispatch({
    type: ACTIONS.RESET_NODE_INFO
  });
};

export const setHostId = hostId => dispatch => {
  dispatch({
    type: ACTIONS.SET_HOST_ID,
    data: hostId
  });
};

const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, delay, retries) =>
  new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch(reason => {
        if (retries > 0) {
          return wait(delay)
            .then(
              retryOperation.bind(null, operation, delay * retries, retries - 1)
            )
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });

export const fetchNodeHealth = (hostIP, retries) => async dispatch => {
  try {
    const { data } = await retryOperation(
      async () => {
        const { data } = await Http.get(`${hostIP}/healthz`);
        if (!data) {
          throw new Error(
            `NodeActions->fetchNodeHealth()->No data obtained from healthz endpoint`
          );
        }
        return { data };
      },
      1000,
      retries
    );

    if (data.APIStatus?.message) {
      dispatch({
        type: ACTIONS.SET_CONNECTION_STATUS,
        data: true
      });
    }

    return data;
  } catch (err) {
    console.log(`NodeActions->fetchNodeHealth()->Error encountered:`);
    console.log(err);
    dispatch({
      type: ACTIONS.SET_CONNECTION_STATUS,
      data: false
    });
  }
};

export const fetchNodeUnlockStatus = () => async dispatch => {
  const { data } = await Http.get("/api/lnd/wallet/status");
  const { walletExists, walletStatus } = data;

  if (walletExists) {
    dispatch({
      type: AUTH_ACTIONS.SET_AUTH_STEP,
      data: walletStatus === "locked" ? "unlockWallet" : "gunAuth"
    });
    return walletStatus;
  }

  dispatch({
    type: AUTH_ACTIONS.SET_AUTH_STEP,
    data: "createWallet"
  });

  return "createWallet";
};

export const connectHost = (
  hostIP,
  resetData = true,
  retries = 0
) => async dispatch => {
  if (resetData) {
    dispatch({
      type: ACTIONS.RESET_NODE_INFO
    });
    dispatch({
      type: AUTH_ACTIONS.RESET_AUTH_INFO
    });
  }
  const done = async (host, health) => {
    Http.defaults.baseURL = `${host}`;

    dispatch({
      type: ACTIONS.SET_HOST_IP,
      data: host
    });

    await Promise.all([
      dispatch(fetchNodeUnlockStatus()),
      dispatch(throttledExchangeKeyPair())
    ]);

    connectSocket(host, true);
  };

  let nodeHealthHttps;
  const sanitizedHostIP = hostIP.replace(/^http(s)?:\/\//, "");
  try {
    nodeHealthHttps = await fetchNodeHealth(
      `https://${sanitizedHostIP}`,
      retries
    )(dispatch);
    if (nodeHealthHttps) {
      nodeHealthHttps.withProtocolHostIP = `https://${sanitizedHostIP}`;
      await done(`https://${sanitizedHostIP}`, nodeHealthHttps);
      return nodeHealthHttps;
    }
  } catch (e) {
    console.log(e);
  }

  console.error("cannot establish https connection, will try http");
  const nodeHealth = await fetchNodeHealth(
    `http://${sanitizedHostIP}`,
    retries
  )(dispatch);
  nodeHealth.withProtocolHostIP = `http://${sanitizedHostIP}`;
  await done(`http://${sanitizedHostIP}`, nodeHealth);
  return nodeHealthHttps || nodeHealth;
};

export const unlockWallet = ({ alias, password }) => async dispatch => {
  try {
    const { data } = await Http.post(
      "/api/lnd/auth",
      {
        alias,
        password
      },
      {
        // Unlocking can take significantly longer than other endpoints
        timeout: 30000
      }
    );

    dispatch(setAuthenticated(true));
    const decodedToken = jwtDecode(data.authorization);
    dispatch({
      type: ACTIONS.SET_AUTHENTICATED_USER,
      data: {
        alias: data.user.alias,
        authToken: data.authorization,
        publicKey: data.user.publicKey,
        // @ts-expect-error
        authTokenExpirationDate: decodedToken.exp
      }
    });
    return data;
  } catch (err) {
    dispatch(setAuthenticated(false));
    throw parseError(err);
  }
};

export const createAlias = ({ alias, password }) => async dispatch => {
  try {
    const { data } = await Http.post("/api/lnd/wallet/existing", {
      alias,
      password
    });

    dispatch(setAuthenticated(true));
    const decodedToken = jwtDecode(data.authorization);
    dispatch({
      type: ACTIONS.SET_AUTHENTICATED_USER,
      data: {
        alias: data.user.alias,
        authToken: data.authorization,
        publicKey: data.user.publicKey,
        // @ts-expect-error
        authTokenExpirationDate: decodedToken.exp
      }
    });
    return data;
  } catch (err) {
    dispatch(setAuthenticated(false));
    throw parseError(err);
  }
};

export const createWallet = ({ alias, password }) => async dispatch => {
  try {
    const { data } = await Http.post(
      "/api/lnd/wallet",
      {
        alias,
        password
      },
      {
        // Creating a wallet can take longer than any other endpoints.
        timeout: 30000
      }
    );

    dispatch(setAuthenticated(true));
    const decodedToken = jwtDecode(data.authorization);
    dispatch({
      type: ACTIONS.SET_AUTHENTICATED_USER,
      data: {
        alias: data.user.alias,
        authToken: data.authorization,
        publicKey: data.user.publicKey,
        // @ts-expect-error
        authTokenExpirationDate: decodedToken.exp
      }
    });
    return data;
  } catch (err) {
    dispatch(setAuthenticated(false));
    throw parseError(err);
  }
};

export const SetAttemptsDone = () => dispatch => {
  dispatch({
    type: ACTIONS.SET_ATTEMPTS_DONE
  });
};
