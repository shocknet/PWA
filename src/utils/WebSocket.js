import SocketIO from "socket.io-client";
import { initialMessagePrefix } from "../utils/String";
import FieldError from "./FieldError";

const options = { reconnection: true, rejectUnauthorized: false };

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

const fetchSocket = ({ hostIP, authToken, namespace, callback }) =>
  new Promise((resolve, reject) => {
    try {
      console.log("getChats Executed", `${hostIP}/${namespace}`);
      const DataSocket = SocketIO.connect(`${hostIP}/${namespace}`, {
        ...options,
        query: {
          token: authToken
        }
      });
      DataSocket.on("$shock", data => {
        if (callback) {
          callback(null, data);
          return;
        }
        resolve(data);
      });

      DataSocket.on("$error", error => {
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

      DataSocket.on("error", error => {
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
    } catch (err) {
      console.error(err);
    }
  });

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
 * @param {string} host
 * @param {string} query
 * @param {string=} publicKeyForDecryption
 * @returns {ReturnType<typeof SocketIO>}
 */
export const rifle = (host, query, publicKeyForDecryption) => {
  const opts = {
    query: {
      $shock: query
    }
  };

  opts.query.publicKeyForDecryption = publicKeyForDecryption ?? "";

  const socket = SocketIO(`${host}/gun`, opts);

  return socket;
};

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
