import SocketIO from "socket.io-client";
import binaryParser from "socket.io-msgpack-parser";
import * as Common from "shock-common";
import * as Encryption from "./Encryption";
import { initialMessagePrefix } from "./String";
import { setAuthenticated } from "../actions/AuthActions";
import { listenPath } from "./Gun";
import { uniqueId } from "lodash";
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

/** @type {import("socket.io-client").Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap>} */
export let GunSocket = null;

const reconnectRifleSubscriptions = () => {
  Array.from(rifleSubscriptions.entries()).forEach(([key, value]) => {
    unsubscribeRifleById(key);
    rifle(value);
    rifleSubscriptions.delete(key);
  });
};

export const connectSocket = async (host = "", reconnect = false) => {
  const { store } = await import("../store");
  const socketOptions = {
    ...options,
    auth: {
      encryptionId: store.getState().encryption.deviceId,
      /**
       * Signals LND rpc socket handling that this is just the intial handshake
       * and to not try to process non-existent arguments.
       */
      isInitial: true
    }
  };

  if (GunSocket?.connected && !reconnect) {
    return { GunSocket };
  }

  if (GunSocket && reconnect) {
    disconnectSocket(GunSocket);
  }

  GunSocket = SocketIO(`${host}/gun`, socketOptions);

  const relayId = store.getState().node.relayId;
  if (relayId) {
    GunSocket.emit("hybridRelayId", { id: relayId });
  }

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
  //TODO listen on relay error
  GunSocket.on("encryption:error", async err => {
    if (err.field === "deviceId" || err.message === "Bad Mac") {
      store.dispatch(setAuthenticated(false));
    }
  });

  reconnectRifleSubscriptions();

  GunSocket.on("connect", () => {
    console.log("Connected to new socket");
    reconnectRifleSubscriptions();
  });

  const onlineListener = () => {
    connectSocket(host, true);
    window.removeEventListener("online resume", onlineListener);
  };

  window.addEventListener("online resume", onlineListener);

  return { GunSocket };
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
    try {
      const decryptedMessage = await Encryption.decryptMessage({
        privateKey,
        encryptedMessage: data
      });

      callback(err, decryptedMessage);
    } catch (e) {
      callback(e, undefined);
    }
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
        try {
          if (!response) {
            return response;
          }

          if (response && !Encryption.isEncryptedMessage(response)) {
            console.warn("Non-encrypted socket message", response);
            return response;
          }

          const res = await Encryption.decryptMessage({
            privateKey: localPrivateKey,
            encryptedMessage: response
          });
          return res;
        } catch (e) {
          return e;
        }
      })
    );

    const sanitized = decryptedResponses.filter(
      data => !(data instanceof Error)
    );
    const errors = decryptedResponses.filter(data => data instanceof Error);

    if (errors.length) {
      console.log("Errors inside socket.on:", errors);
    }

    if (sanitized.length) {
      callback(...sanitized);
    }
  });
};

/**
 * @returns {Promise<Subscription>}
 */
export const subscribeSocket = ({ eventName, callback }) =>
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

        if (callback) {
          on(eventName, data => {
            callback(null, data);
          });
        }

        resolve({
          off() {
            emit(`unsubscribe:${eventName}`);
          }
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
      if (subscription.listener && subscription.listener.off) {
        subscription.listener.off();
        return true;
      }
      unsubscribeRifleById(id);
      return true;
    }

    return false;
  });
};

export const unsubscribeEvent = subscriptionId =>
  new Promise(resolve => {
    const subscription = rifleSubscriptions.get(subscriptionId);

    if (subscription.listener && subscription.listener.off) {
      subscription.listener.off();
      resolve(true);
    }

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
    import("../store").then(async ({ store }) => {
      const { authenticated } = store.getState().auth;
      const { authToken } = store.getState().node;

      if (!authenticated) {
        const listener = await listenPath({
          query,
          callback: onData
        });

        const id = uniqueId();

        rifleSubscriptions.set(id, {
          publicKey,
          onData,
          query,
          listener
        });

        return listener;
      }

      if (reconnect) {
        unsubscribeRifleByQuery(query);
      }

      const emit = encryptedEmit(GunSocket);

      emit(
        "subscribe:query",
        {
          $shock: query,
          token: authToken,
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
            publicKey,
            epubForDecryption,
            epubField,
            reconnect,
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
 * @param {Promise<Subscription>[]} subscriptions
 */
export const rifleCleanup = (...subscriptions) => () => {
  subscriptions.map(subscription =>
    subscription.then(unsubscribe => {
      unsubscribe.off();
    })
  );
};

/**
 * @returns {Promise<{ messages: any , contacts: Contact[]}>}
 */
export const getChats = async () => {
  try {
    const chats = await new Promise(res => {
      const subscription = subscribeSocket({
        callback(_, data) {
          subscription.then(sub => sub.off());
          res(data);
        },
        eventName: "chats"
      });
    });

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

/**
 * @returns {Promise<Common.SimpleSentRequest[]>}
 */
export const getSentRequests = async () => {
  try {
    const sentRequests = await new Promise(res => {
      const subscription = subscribeSocket({
        eventName: "sentRequests",
        callback(_, data) {
          subscription.then(sub => sub.off());
          res(data);
        }
      });
    });

    return sentRequests;
  } catch (err) {
    console.error(err);
  }
};

/**
 * @returns {Promise<Common.SimpleReceivedRequest[]>}
 */
export const getReceivedRequests = async () => {
  try {
    const receivedRequests = await new Promise(res => {
      const subscription = subscribeSocket({
        eventName: "receivedRequests",
        callback(_, data) {
          subscription.then(sub => sub.off());
          res(data);
        }
      });
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
