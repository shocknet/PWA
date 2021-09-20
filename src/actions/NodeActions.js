// @ts-check
import jwtDecode from "jwt-decode";
import Http from "axios";
import { ACTIONS as AUTH_ACTIONS, setAuthenticated } from "./AuthActions";
import { parseError } from "../utils/Error";
import { exchangeKeyPair } from "./EncryptionActions";
import { connectSocket } from "../utils/WebSocket";
import { safeParseJSON } from "../utils/JSON";

export const ACTIONS = {
  RESET_NODE_INFO: "node/reset",
  SET_HOST_IP: "node/hostIP",
  SET_HOST_ID: "node/hostId",
  SET_AUTHENTICATED_USER: "node/authenticatedUser",
  SET_CONNECTION_STATUS: "node/connectionStatus",
  SET_NODE_HEALTH: "node/health",
  SET_WEBCLIENT_PREFIX: "node/setWebClientPrefix",
  SET_RELAY_ID: "auth/relay/set",
  SET_ACCESS_SECRET: "auth/accessSecret/set"
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

export const fetchNodeHealth = (hostIP, relayId) => async dispatch => {
  try {
    const headers = {};
    if (relayId) {
      headers["x-shock-hybrid-relay-id-x"] = relayId;
    }
    const { data } = await Http.get(`${hostIP}/healthz`, {
      headers
    });
    if (!data) {
      throw new Error(
        `NodeActions->fetchNodeHealth()->No data obtained from healthz endpoint`
      );
    }

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
  relayId = null,
  accessSecret = null
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
    if (relayId) {
      dispatch(setRelayId(relayId));
    }
    if (accessSecret) {
      dispatch(setAccessSecret(accessSecret));
    }
    dispatch({
      type: ACTIONS.SET_HOST_IP,
      data: host
    });

    await Promise.all([
      dispatch(fetchNodeUnlockStatus()),
      dispatch(exchangeKeyPair())
    ]);

    connectSocket(host, true);
  };

  let nodeHealthHttps;
  const sanitizedHostIP = hostIP.replace(/^http(s)?:\/\//, "");
  try {
    nodeHealthHttps = await fetchNodeHealth(
      `https://${sanitizedHostIP}`,
      relayId
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
    relayId
  )(dispatch);
  nodeHealth.withProtocolHostIP = `http://${sanitizedHostIP}`;
  await done(`http://${sanitizedHostIP}`, nodeHealth);
  return nodeHealthHttps || nodeHealth;
};

export const unlockWallet = ({
  alias,
  password,
  accessSecret
}) => async dispatch => {
  try {
    const { data } = await Http.post("/api/lnd/auth", {
      alias,
      password,
      accessSecret
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

export const createAlias = ({
  alias,
  password,
  accessSecret
}) => async dispatch => {
  try {
    const { data } = await Http.post("/api/lnd/wallet/existing", {
      alias,
      password,
      accessSecret
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
    await Http.post("/api/initUserInformation", {});
    return data;
  } catch (err) {
    dispatch(setAuthenticated(false));
    throw parseError(err);
  }
};

export const createWallet = ({ alias, password }) => async dispatch => {
  try {
    const { data } = await Http.post("/api/lnd/wallet", {
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
    await Http.post("/api/initUserInformation", {});
    return data;
  } catch (err) {
    dispatch(setAuthenticated(false));
    throw parseError(err);
  }
};

export const setWebclientPrefix = prefix => dispatch => {
  dispatch({
    type: ACTIONS.SET_WEBCLIENT_PREFIX,
    data: prefix
  });
};

export const setRelayId = relayId => ({
  type: ACTIONS.SET_RELAY_ID,
  data: relayId
});

export const setAccessSecret = accessSecret => ({
  type: ACTIONS.SET_ACCESS_SECRET,
  data: accessSecret
});
