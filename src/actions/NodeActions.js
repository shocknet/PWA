import jwtDecode from "jwt-decode";
import Http from "axios";
import { ACTIONS as AUTH_ACTIONS, setAuthenticated } from "./AuthActions";

export const ACTIONS = {
  RESET_NODE_INFO: "node/reset",
  SET_HOST_IP: "node/hostIP",
  SET_AUTHENTICATED_USER: "node/authenticatedUser",
  SET_CONNECTION_STATUS: "node/connectionStatus",
  SET_NODE_HEALTH: "node/health"
};

export const resetNodeInfo = () => dispatch => {
  dispatch({
    type: ACTIONS.RESET_NODE_INFO
  });
};

export const fetchNodeHealth = hostIP => async dispatch => {
  try {
    const { data } = await Http.get(`${hostIP}/healthz`);

    if (data.APIStatus?.message) {
      dispatch({
        type: ACTIONS.SET_CONNECTION_STATUS,
        data: true
      });
    }

    return data;
  } catch (err) {
    dispatch({
      type: ACTIONS.SET_CONNECTION_STATUS,
      data: false
    });
  }
};

export const connectHost = (hostIP, resetData = true) => async dispatch => {
  if (resetData) {
    dispatch({
      type: ACTIONS.RESET_NODE_INFO
    });
    dispatch({
      type: AUTH_ACTIONS.RESET_AUTH_INFO
    });
  }

  const done = (host, health) => {
    const { walletStatus } = health.LNDStatus;

    Http.defaults.baseURL = `${host}`;

    dispatch({
      type: ACTIONS.SET_HOST_IP,
      data: host
    });
    dispatch({
      type: AUTH_ACTIONS.SET_AUTH_STEP,
      data: walletStatus === "locked" ? "unlockWallet" : "gunAuth"
    });
  };

  let nodeHealthHttps;
  const sanitizedHostIP = hostIP.replace(/^http(s)?:\/\//, "");
  try {
    nodeHealthHttps = await fetchNodeHealth(`https://${sanitizedHostIP}`)(
      dispatch
    );
    if (nodeHealthHttps) {
      nodeHealthHttps.withProtocolHostIP = `https://${sanitizedHostIP}`;
      done(`https://${sanitizedHostIP}`, nodeHealthHttps);
      return nodeHealthHttps;
    }
  } catch (e) {
    console.log(e);
  }

  console.error("cannot establish https connection, will try http");
  const nodeHealth = await fetchNodeHealth(`http://${sanitizedHostIP}`)(
    dispatch
  );
  nodeHealth.withProtocolHostIP = `http://${sanitizedHostIP}`;
  done(`http://${sanitizedHostIP}`, nodeHealth);
  return nodeHealthHttps || nodeHealth;
};

export const unlockWallet = ({ alias, password }) => async dispatch => {
  try {
    const { data } = await Http.post("/api/lnd/auth", {
      alias,
      password
    });
    console.log(data);

    dispatch(setAuthenticated(true));
    const decodedToken = jwtDecode(data.authorization);
    dispatch({
      type: ACTIONS.SET_AUTHENTICATED_USER,
      data: {
        alias: data.user.alias,
        authToken: data.authorization,
        publicKey: data.user.publicKey,
        authTokenExpirationDate: decodedToken.exp
      }
    });
    return data;
  } catch (err) {
    dispatch(setAuthenticated(false));
    throw err;
  }
};
