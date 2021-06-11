import SocketIO from "socket.io-client";
import binaryParser from "socket.io-msgpack-parser";
import * as Common from "shock-common";
import * as Encryption from "./Encryption";
import { initialMessagePrefix } from "../utils/String";
import { setAuthenticated } from "../actions/AuthActions";
import { connectHost } from "../actions/NodeActions";
/**
 * @typedef {import('../schema').Contact} Contact
 * @typedef {import('../schema').Subscription} Subscription
 */

const options = {
  reconnection: true,
  rejectUnauthorized: false,
  parser: binaryParser,
  withCredentials: true,
  transports: ["websocket"]
};

const rifleSubscriptions = new Map();

export let GunSocket = null;

export let LNDSocket = null;

export const connectSocket = async (host = "", reconnect = false) => {
  if (GunSocket && LNDSocket && !reconnect) {
    return { GunSocket, LNDSocket };
  }

  if (GunSocket && LNDSocket && reconnect) {
    disconnectSocket(GunSocket);
    disconnectSocket(LNDSocket);
  }

  const { store } = await import("../store");
  const socketOptions = {
    ...options,
    auth: {
      encryptionId: store.getState().encryption.deviceId
    }
  };
  GunSocket = SocketIO.connect(`${host}/gun`, socketOptions);
  LNDSocket = SocketIO.connect(`${host}/lndstreaming`, socketOptions);

  const GunOn = encryptedOn(GunSocket);

  // Subscribe to Rifle query events as soon as the socket is connected
  GunOn("query:data", event => {
    const subscription = rifleSubscriptions.get(event.subscriptionId);

    if (subscription) {
      subscription.onData?.(event.response.data, event.response.key);
    }
  });

  GunOn("query:error", event => {
    const subscription = rifleSubscriptions.get(event.subscriptionId);

    if (subscription) {
      subscription.onError?.(event.response.data, event.response.key);
    }
  });

  GunSocket.on(Common.NOT_AUTH, () => {
    store.dispatch(setAuthenticated(false));
  });

  GunSocket.on("encryption:error", async err => {
    if (err.field === "deviceId") {
      const cachedNodeIP = store.getState().node.hostIP;
      await store.dispatch(connectHost(cachedNodeIP, false));
      store.dispatch(setAuthenticated(false));
    }
  });

  return { GunSocket, LNDSocket };
};

export const disconnectSocket = socket => {
  socket.off("*");
  socket.close();
};

const decryptEventCallback = async ({ err, data, callback, privateKey }) => {
  if (
    (err && !Encryption.isEncryptedMessage(err)) ||
    (data && !Encryption.isEncryptedMessage(data))
  ) {
    callback(err, data);
    return;
  }

  if (err) {
    const decryptedMessage = await Encryption.decryptMessage({
      privateKey,
      encryptedMessage: err
    });

    callback(decryptedMessage, data);
    return;
  }

  if (data) {
    const decryptedMessage = await Encryption.decryptMessage({
      privateKey,
      encryptedMessage: data
    });

    callback(err, decryptedMessage);
    return;
  }
};

const encryptedEmit = socket => async (eventName, message, callback) => {
  // TODO: remove circular dep
  const { store } = await import("../store");
  const { hostKeys, userKeys } = store.getState().encryption;
  const { hostId } = store.getState().node;

  if (Encryption.isNonEncrypted(eventName)) {
    socket.emit(eventName, message, callback);
    return;
  }

  const remotePublicKey = hostKeys[hostId];
  const localPrivateKey = userKeys[hostId]?.privateKey;

  if (!remotePublicKey || !localPrivateKey) {
    console.error("[WS] Unable to retrieve key for specified Host ID:", hostId);

    return;
  }

  const encryptedData = await (message
    ? Encryption.encryptMessage({
        publicKey: remotePublicKey,
        message: JSON.stringify(message)
      })
    : null);

  socket.emit(eventName, encryptedData, (err, data) => {
    decryptEventCallback({
      err,
      data,
      callback,
      privateKey: localPrivateKey
    });
  });
};

const encryptedOn = socket => async (eventName, callback) => {
  // TODO: remove circular dep
  const { store } = await import("../store");
  const { userKeys } = store.getState().encryption;
  const { hostId } = store.getState().node;

  if (Encryption.isNonEncrypted(eventName)) {
    socket.on(eventName, callback);
    return;
  }

  const localPrivateKey = userKeys[hostId]?.privateKey;

  if (!localPrivateKey) {
    console.error("[WS] Unable to retrieve key for specified Host ID:", hostId);

    return;
  }

  socket.on(eventName, async (...responses) => {
    const decryptedResponses = await Promise.all(
      responses.map(async response => {
        if (!response) {
          return response;
        }

        if (response && !Encryption.isEncryptedMessage(response)) {
          console.warn("Non-encrypted socket message", response);
          return response;
        }

        return Encryption.decryptMessage({
          privateKey: localPrivateKey,
          encryptedMessage: response
        });
      })
    );

    callback(...decryptedResponses);
  });
};

const subscribeSocket = ({ eventName, callback }) =>
  new Promise((resolve, reject) => {
    try {
      import("../store").then(({ store }) => {
        const on = encryptedOn(GunSocket);
        const emit = encryptedEmit(GunSocket);

        emit(
          `subscribe:${eventName}`,
          {
            token: store.getState().node.authToken
          },
          err => {
            if (err) {
              console.error(err);
              reject(err);
              return;
            }
          }
        );

        on(eventName, data => {
          if (callback) {
            callback(null, data);
            return;
          }
          resolve(data);
        });
      });
    } catch (err) {
      console.error(err);
    }
  });

export const unsubscribeRifleById = subscriptionId => {
  const cachedSocket = rifleSubscriptions.get(subscriptionId);

  if (cachedSocket) {
    unsubscribeEvent(subscriptionId);
    rifleSubscriptions.delete(subscriptionId);
  }
};

export const unsubscribeRifleByQuery = query => {
  const subscriptionEntries = Array.from(rifleSubscriptions.entries());

  subscriptionEntries.map(([id, subscription]) => {
    if (subscription.query === query) {
      console.log("Unsubscribing by query:", subscription);
      unsubscribeRifleById(id);
      return true;
    }

    return false;
  });
};

export const unsubscribeEvent = subscriptionId =>
  new Promise(resolve => {
    const emit = encryptedEmit(GunSocket);
    emit(
      "unsubscribe",
      {
        subscriptionId
      },
      () => {
        console.debug(
          `[SOCKET] Unsubscribed from event successfully! (${subscriptionId})`
        );
        resolve(true);
      }
    );
  });

export const rifleSocketExists = subscriptionId => {
  const cachedSocket = rifleSubscriptions.get(subscriptionId);
  return !!cachedSocket;
};

/**
 * @typedef {object} RifleParams
 * @prop {string} query
 * @prop {string=} publicKey Alias for publicKeyForDecryption
 * @prop {string=} epubForDecryption If epub is known before hand.
 * @prop {string=} epubField If the epub is included in the received data
 * itself. Handshake requests for example, have an epub field.
 * @prop {boolean=} reconnect
 * @prop {(data, key) => void} onData
 * @prop {((error) => void)=} onError
 */

/**
 * Returns a socket wired up to the given query. Use `.onData(callback)` for values.
 * Please do not forget to listen to the NOT_AUTH event and react accordingly.
 * Query example:
 * ```js
 * rifle(`$user::Profile>displayName::on`)
 * // results in:
 * gun.user().get('Profile').get('displayName').on(...)
 *
 * const pk = '....'
 * rifle(`${pk}::Profile::map.once`)
 * // results in:
 * gun.user(pk).get('Profile').get('displayName').map().once(...)
 *
 * rifle(`$gun::handshakeNodes::on`)
 * // results in:
 * gun.get('handshakeNodes').on(...)
 * ```
 * @param {RifleParams} args
 * @returns {Promise<Subscription>}
 */
export const rifle = ({
  query,
  publicKey,
  epubForDecryption,
  epubField,
  reconnect,
  onData,
  onError
}) =>
  new Promise((resolve, reject) => {
    import("../store").then(({ store }) => {
      if (reconnect) {
        unsubscribeRifleByQuery(query);
      }

      const emit = encryptedEmit(GunSocket);

      emit(
        "subscribe:query",
        {
          $shock: query,
          token: store.getState().node.authToken,
          publicKey,
          epubForDecryption,
          epubField
        },
        (err, data) => {
          if (err) {
            console.error(`Gun rifle error (${query})`);
            console.error(err);
            reject(err);
            return;
          }

          rifleSubscriptions.set(data.subscriptionId, {
            onData,
            onError,
            query
          });

          resolve({
            off: () => unsubscribeRifleById(data.subscriptionId)
          });
        }
      );
    });
  });

/**
 * @param {Promise<() => void>} subscription
 */
export const rifleCleanup = (...subscriptions) => () => {
  subscriptions.map(subscription =>
    subscription.then(unsubscribe => {
      unsubscribe.off();
    })
  );
};

/**
 * @returns {{ messages: any , contacts: Contact[]}}
 */
export const getChats = async ({ authToken }) => {
  try {
    const chats = await subscribeSocket({ authToken, eventName: "chats" });

    const contacts = chats.map(chat => ({
      pk: chat.recipientPublicKey,
      avatar: chat.recipientAvatar,
      displayName: chat.recipientDisplayName,
      didDisconnect: chat.didDisconnect
    }));

    const messages = chats.reduce(
      (messages, chat) => ({
        ...messages,
        [chat.recipientPublicKey]: chat.messages
          ?.filter(
            message =>
              message.body &&
              message.body.trim() &&
              message.body !== initialMessagePrefix
          )
          .sort((a, b) => b.timestamp - a.timestamp)
      }),
      {}
    );

    return {
      contacts,
      messages
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSentRequests = async ({ hostIP, authToken }, callback) => {
  try {
    const sentRequests = await subscribeSocket({
      hostIP,
      authToken,
      eventName: "sentRequests",
      callback
    });

    return sentRequests;
  } catch (err) {
    console.error(err);
  }
};

export const getReceivedRequests = async ({ hostIP, authToken }, callback) => {
  try {
    const receivedRequests = await subscribeSocket({
      hostIP,
      authToken,
      eventName: "receivedRequests",
      callback
    });

    return receivedRequests.map(request => ({
      id: request.id,
      pk: request.recipientPublicKey,
      avatar: request.recipientAvatar,
      displayName: request.recipientDisplayName,
      changedAddress: request.recipientChangedRequestAddress,
      timestamp: request.timestamp
    }));
  } catch (err) {
    console.error(err);
  }
};
