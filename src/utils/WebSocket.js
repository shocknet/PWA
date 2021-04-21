import SocketIO from "socket.io-client";
import binaryParser from "socket.io-msgpack-parser";
import * as Encryption from "./Encryption";
import { initialMessagePrefix } from "../utils/String";
import FieldError from "./FieldError";
/**
 * @typedef {import('../schema').Contact} Contact
 */

const options = {
  reconnection: true,
  rejectUnauthorized: false,
  parser: binaryParser,
  withCredentials: true
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
  console.log("Emitting event:", eventName, message);
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

        console.log("Emitting:", `subscribe:${eventName}`);
        emit(
          `subscribe:${eventName}`,
          {
            token: store.getState().node.authToken
          },
          (err, data) => {
            console.log(`subscribe:${eventName}`, err, data);
            if (err) {
              console.error(err);
              reject(err);
              return;
            }
          }
        );

        on(eventName, data => {
          console.log(`subscribe:${eventName}`, data);
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

export const unsubscribeRifleQuery = query => {
  const cachedSocket = rifleSubscriptions.get(query);

  if (cachedSocket) {
    cachedSocket.unsubscribe?.();
    rifleSubscriptions.delete(query);
  }
};

export const unsubscribeEvent = (subscriptionId) => {
  const emit = encryptedEmit(GunSocket);
  emit("unsubscribe", {
    subscriptionId
  })
}

export const rifleSocketExists = query => {
  const cachedSocket = rifleSubscriptions.get(query);
  return !!cachedSocket;
};

/**
 * @typedef {object} RifleParams
 * @prop {string} query
 * @prop {string=} publicKey Alias for publicKeyForDecryption
 * @prop {boolean=} reconnect
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
 * @returns {Promise<SocketIOClient.Socket>}
 */
export const rifle = ({ query, publicKey, reconnect }) =>
  new Promise((resolve, reject) => {
    import("../store").then(({ store }) => {
      const subscribed = rifleSubscriptions.get(query);

      if (reconnect && subscribed) {
        unsubscribeRifleQuery(query);
      }

      if (!subscribed || reconnect) {
        const on = encryptedOn(GunSocket);
        const emit = encryptedEmit(GunSocket);

        emit(
          "subscribe:query",
          {
            $shock: query,
            token: store.getState().node.authToken,
            publicKey
          },
          (err, data) => {
            console.log("Gun rifle response:", err, data);
            if (err) {
              console.error(`Gun rifle error (${query})`);
              console.error(err);
              reject(err);
              return;
            }
          }
        );

        resolve({
          onData: callback => {
            console.log(`Subscribing query: query:${query}:data`)
            on(`query:${query}:data`, (...args) => {
              console.log("Received event:", `query:${query}:data`, args)
              callback(...args)
            });
          },
          onError: callback => {
            on(`query:${query}:error`, callback);
          },
          off: () => unsubscribeRifleQuery(query)
        });
      }
    });
  });

/**
 * @returns {{ messages: any , contacts: Contact[]}}
 */
export const getChats = async ({ authToken }) => {
  try {
    const chats = await subscribeSocket({ authToken, eventName: "chats" });

    const contacts = chats.map(chat => ({
      pk: chat.recipientPublicKey,
      avatar: chat.recipientAvatar,
      displayName: chat.recipientDisplayName
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
