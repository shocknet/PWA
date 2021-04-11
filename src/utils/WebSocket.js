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

const rifleSockets = new Map();

export let GunSocket = null;

export let LNDSocket = null;

export const connectSocket = url => {
  GunSocket = SocketIO.connect(`${url}/gun`, options);
  LNDSocket = SocketIO.connect(`${url}/lndstreaming`, options);
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

  if (!Encryption.isNonEncrypted(eventName)) {
    socket.on(eventName, callback);
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
        message
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

const fetchSocket = ({ hostIP, authToken, namespace, callback }) =>
  new Promise((resolve, reject) => {
    try {
      import("../store").then(({ store }) => {
        const { encryption } = store.getState();
        const DataSocket = SocketIO.connect(`${hostIP}/${namespace}`, {
          ...options,
          auth: {
            token: authToken,
            encryptionId: encryption.deviceId
          }
        });
        const on = encryptedOn(DataSocket);

        on("$shock", async data => {
          if (callback) {
            callback(null, data);
            return;
          }
          resolve(data);
        });

        on("$error", async error => {
          if (callback) {
            callback(error);
            return;
          }
          disconnectSocket(DataSocket);
          reject(
            new FieldError({
              field: "socket",
              message: error
            })
          );
        });

        on("error", error => {
          console.error(error);
          if (callback) {
            callback(error);
            return;
          }
          disconnectSocket(DataSocket);
          reject(
            new FieldError({
              field: "socket",
              message: error
            })
          );
        });
      });
    } catch (err) {
      console.error(err);
    }
  });

export const disconnectRifleSocket = query => {
  const cachedSocket = rifleSockets.get(query);

  if (cachedSocket) {
    cachedSocket.off("*");
    cachedSocket.close();
    rifleSockets.delete(query);
  }
};

export const rifleSocketExists = query => {
  const cachedSocket = rifleSockets.get(query);
  return !!cachedSocket;
};

/**
 * @typedef {object} RifleParams
 * @prop {string} host
 * @prop {string} query
 * @prop {string=} publicKeyForDecryption
 * @prop {string=} publicKey Alias for publicKeyForDecryption
 * @prop {boolean=} reconnect
 */

/**
 * Returns a socket wired up to the given query. Use `.on('$shock')` for values.
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
 * gun.user(pk).get('Profile').get('displayName').map()once(...)
 *
 * rifle(`$gun::handshakeNodes::on`)
 * // results in:
 * gun.get('handshakeNodes').on(...)
 * ```
 * @param {RifleParams} args
 * @returns {Promise<SocketIOClient.Socket>}
 */
export const rifle = async ({ host, query, publicKey, reconnect }) => {
  // TODO: remove circular dep
  const { store } = await import("../store");
  const opts = {
    ...options,
    auth: {
      encryptionId: store.getState().encryption.deviceId,
      $shock: query,
      publicKeyForDecryption: publicKey ?? ""
    }
  };

  const cachedSocket = rifleSockets.get(query);

  if (reconnect && cachedSocket) {
    disconnectRifleSocket(query);
  }

  if (!cachedSocket || reconnect) {
    const socket = SocketIO(`${host}/gun`, opts);
    rifleSockets.set(query, socket);
    const on = encryptedOn(socket);
    const emit = encryptedEmit(socket);

    on("$error", err => {
      console.error(`Gun rifle error (${query})`);

      console.error(err);
    });

    return {
      on,
      emit,
      off: () => socket.off(),
      close: () => socket.close()
    };
  }

  return cachedSocket;
};

/**
 * @returns {{ messages: any , contacts: Contact[]}}
 */
export const getChats = async ({ hostIP, authToken }) => {
  try {
    const chats = await fetchSocket({ hostIP, authToken, namespace: "chats" });

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
    const sentRequests = await fetchSocket({
      hostIP,
      authToken,
      namespace: "sentReqs",
      callback
    });

    return sentRequests;
  } catch (err) {
    console.error(err);
  }
};

export const getReceivedRequests = async ({ hostIP, authToken }, callback) => {
  try {
    const receivedRequests = await fetchSocket({
      hostIP,
      authToken,
      namespace: "receivedReqs",
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
