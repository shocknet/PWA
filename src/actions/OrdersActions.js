import Http from "../utils/Http";
import {
  rifle,
  rifleSocketExists,
  unsubscribeRifleById
} from "../utils/WebSocket";
export const ACTIONS = {
  ADD_MY_SERVICE: "service/add",
  REMOVE_MY_SERVICE: "service/remove",
  ADD_BOUGHT_SERVICE: "service/add/bought"
};

export const createService = (
  clear,
  encrypted,
) => async dispatch => {
  const { data } = await Http.post("/api/gun/set", {
    path: "$user>offeredServices",
    value: clear
  });
  const { ok, id: newID } = data;
  if (!ok) {
    return "";
  }
  const id = newID;

  const all = Object.entries(encrypted).map(([name, value]) => {
    if (!value) {
      return;
    }
    console.log(`setting: ${name} to ${value}`);
    return Http.post("/api/gun/put", {
      path: `$user>offeredServices>${id}>${name}`,
      value: {
        $$__ENCRYPT__FOR: "me",
        value
      }
    });
  });
  await Promise.all(all);
  const { serviceType } = clear;
  //update the offered service
  if (serviceType === "torrentSeed" || serviceType === "streamSeed") {
    console.log("updating profile with service");
    await Http.post("/api/gun/put", {
      path: `$user>Profile>offerSeedService`,
      value: id
    });
  }
  /* - The update will come from APi, this should not be needed 
  dispatch({
    type: ACTIONS.ADD_MY_SERVICE,
    data: {id,serviceInfo}
  });*/
  return id;
};

export const deleteService = id => async dispatch => {
  return await Http.post("/api/gun/put", {
    path: `$user>offeredServices>${id}`,
    value: null
  });
};
export const subscribeMyServices = (providedServiceId) => dispatch => {
  const query = `$user::offeredServices>${providedServiceId}::on`;
  console.log(query)
  const subscription = rifle({
    query,
    publicKey: "me",
    reconnect: false,

    onData: async (serviceNode, id) => {
      console.log(serviceNode)
      if (serviceNode === null) {
        dispatch({
          type: ACTIONS.REMOVE_MY_SERVICE,
          data: id
        });
        return;
      }
      dispatch({
        type: ACTIONS.ADD_MY_SERVICE,
        data: { id, serviceInfo: serviceNode }
      });
      console.log("got service data")
    }
  });

  return subscription;
};

export const buyService = (
  owner,
  serviceID,
  servicePrice
) => async dispatch => {
  const { data } = await Http.post("/api/lnd/unifiedTrx", {
    type: "service",
    amt: Number(servicePrice),
    to: owner,
    memo: "",
    feeLimit: 500,
    ackInfo: serviceID
  });
  console.log(data);
  const orderAck = JSON.parse(data.orderAck.response);
  dispatch({
    type: ACTIONS.ADD_BOUGHT_SERVICE,
    data: { orderAck, owner, serviceID }
  });
  return orderAck;
};
