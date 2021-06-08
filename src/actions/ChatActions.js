// @ts-check
import Http from "../utils/Http";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import * as Common from "shock-common";
/**
 * @typedef {import('shock-common').Message} RawMessage
 */

import {
  getChats,
  getReceivedRequests,
  getSentRequests,
  rifle,
  subscribeSocket
} from "../utils/WebSocket";
import { initialMessagePrefix } from "../utils/String";
import * as Schema from "../schema";
import * as Utils from "../utils";
/**
 * @typedef {import('../schema').Contact} Contact
 * @typedef {import('../schema').SentRequest} SentRequest
 * @typedef {import("../schema").ReceivedRequest} ReceivedRequest
 * @typedef {import('../schema').ChatMessage} ChatMessage
 */

export const ACTIONS = {
  LOAD_CHAT_DATA: /** @type {"chat/loadData"} */ ("chat/loadData"),
  LOAD_SENT_REQUESTS: /** @type {"chat/loadSentRequests"} */ ("chat/loadSentRequests"),
  LOAD_RECEIVED_REQUESTS: /** @type {"chat/loadReceivedRequests"} */ ("chat/loadReceivedRequests"),
  SET_CHAT_CONTACTS: "chat/contacts",
  SET_CHAT_MESSAGES: "chat/messages",
  SENT_REQUEST: /** @type {"chat/request/sent"} */ ("chat/request/sent"),
  ACCEPT_HANDSHAKE_REQUEST: "chat/request/accept",
  DECLINE_HANDSHAKE_REQUEST: "chat/request/decline",
  SENDING_MESSAGE: "chat/message/sending",
  SENT_MESSAGE: "chat/message/sent",
  FAILED_MESSAGE: "chat/message/failed",
  RECEIVED_MESSAGE: /** @type {"chat/message/received"} */ ("chat/message/received"),
  CHAT_WAS_DELETED: /** @type {'chat/deleted'} */ ("chat/deleted")
};

/**
 * @typedef {object} SentRequestAction
 * @prop {typeof ACTIONS.SENT_REQUEST} type
 * @prop {string} data The public key.
 */

/**
 * @typedef {object} LoadChatDataAction
 * @prop {typeof ACTIONS.LOAD_CHAT_DATA} type
 * @prop {{ messages: Record<string, ChatMessage[]> , contacts: Contact[] }} data
 */

/**
 * @typedef {object} LoadSentRequestsAction
 * @prop {typeof ACTIONS.LOAD_SENT_REQUESTS} type
 * @prop {SentRequest[]} data
 */

/**
 * @typedef {object} LoadReceivedRequestsAction
 * @prop {typeof ACTIONS.LOAD_RECEIVED_REQUESTS} type
 * @prop {ReceivedRequest[]} data
 */

/**
 * @typedef {object} ReceivedMessageAction
 * @prop {typeof ACTIONS.RECEIVED_MESSAGE} type
 * @prop {ChatMessage} data
 */

export const loadChatData = () => async dispatch => {
  const data = await getChats();
  console.log("LOAD_CHAT_DATA:", data);

  dispatch({
    type: ACTIONS.LOAD_CHAT_DATA,
    data
  });
};

export const loadSentRequests = () => async dispatch => {
  const sentRequests = await getSentRequests();

  /** @type {LoadSentRequestsAction} */
  const action = {
    type: ACTIONS.LOAD_SENT_REQUESTS,
    data: sentRequests.map(request => {
      /** @type {SentRequest} */
      const req = {
        id: request.id,
        pk: request.recipientPublicKey,
        avatar: request.recipientAvatar,
        displayName: request.recipientDisplayName,
        changedAddress: request.recipientChangedRequestAddress,
        timestamp: request.timestamp,
        loading: false
      };

      return req;
    })
  };

  dispatch(action);
};

export const loadReceivedRequests = () => async (dispatch, getState) => {
  const receivedRequests = await getReceivedRequests();

  /** @type {LoadReceivedRequestsAction} */
  const action = {
    type: ACTIONS.LOAD_RECEIVED_REQUESTS,
    data: receivedRequests.map(request => {
      /** @type {ReceivedRequest} */
      const req = {
        id: request.id,
        pk: request.requestorPK,
        avatar: request.requestorAvatar,
        displayName: request.requestorDisplayName,
        timestamp: request.timestamp
      };

      return req;
    })
  };

  dispatch(action);
};

/**
 * @param {string} userPublicKey
 * @param {string} recipientPublicKey
 * @returns {(dispatch: (action: any) => void) => Promise<{off(): void}>}
 */
export const subscribeChatMessages = (
  userPublicKey,
  recipientPublicKey
) => async dispatch => {
  try {
    const { data: incomingId } = await Http.get(
      `/api/gun/user/once/userToIncoming>${recipientPublicKey}`,
      {
        headers: {
          "public-key-for-decryption": userPublicKey
        }
      }
    );

    if (!incomingId.data) {
      throw new Error(`Unable to retrieve incoming ID for selected contact.`);
    }

    const incomingMessages = await rifle({
      query: `${recipientPublicKey}::outgoings>${incomingId.data}>messages::map.on`,
      publicKey: recipientPublicKey,
      onData: (message, id) => {
        if (!message.body || message.body === initialMessagePrefix) {
          return;
        }
        /** @type {RawMessage} */
        const rawMsg = message;

        /** @type {ChatMessage} */
        const msg = {
          body: rawMsg.body,
          id,
          localId: id,
          outgoing: false,
          recipientPublicKey,
          status: Schema.CHAT_MESSAGE_STATUS.SENT,
          timestamp: rawMsg.timestamp
        };

        /** @type {ReceivedMessageAction} */
        const action = {
          type: ACTIONS.RECEIVED_MESSAGE,
          data: msg
        };

        dispatch(action);
      }
    });

    return incomingMessages;
  } catch (e) {
    Utils.logger.error(
      `Error inside subscribeChatMessages, recipient public key: ${recipientPublicKey}: `,
      e
    );
    return Promise.resolve({
      off() {}
    });
  }
};

export const acceptHandshakeRequest = requestId => async dispatch => {
  const { data } = await Http.put(`/api/gun/requests/${requestId}`, {
    accept: true
  });

  dispatch({
    type: ACTIONS.ACCEPT_HANDSHAKE_REQUEST,
    data: requestId
  });

  return data;
};

export const sendHandshakeRequest = publicKey => async (dispatch, getState) => {
  const { data } = await Http.post(`/api/gun/requests`, {
    publicKey
  });

  /** @type {SentRequest[]} */
  const sentRequests = getState().chat.sentRequests;
  const [userExists] = sentRequests.filter(request => request.pk === publicKey);

  if (!userExists) {
    /** @type {SentRequestAction} */
    const action = {
      type: ACTIONS.SENT_REQUEST,
      data: publicKey
    };
    dispatch(action);
  }

  return data;
};

export const sendMessage = ({
  publicKey,
  message,
  localId = null
}) => async dispatch => {
  const tempId = localId ?? uuidv4();
  try {
    dispatch({
      type: ACTIONS.SENDING_MESSAGE,
      data: {
        body: message,
        localId: tempId,
        timestamp: DateTime.utc().toMillis(),
        recipientPublicKey: publicKey
      }
    });
    const { data } = await Http.post(`/api/gun/chats/${publicKey}`, {
      body: message
    });
    console.log(data);
    dispatch({
      type: ACTIONS.SENT_MESSAGE,
      data: { ...data, localId: tempId, recipientPublicKey: publicKey }
    });
  } catch (err) {
    dispatch({
      type: ACTIONS.FAILED_MESSAGE,
      data: {
        body: message,
        localId: tempId,
        timestamp: DateTime.utc().toMillis(),
        recipientPublicKey: publicKey
      }
    });
  }
};

/**
 * @param {string} publicKey
 */
export const chatWasDeleted = publicKey => ({
  type: ACTIONS.CHAT_WAS_DELETED,
  data: {
    publicKey
  }
});

export const subChats = () => async dispatch => {
  try {
    console.debug(`Subbing to chats`);
    const sub = await subscribeSocket({
      callback(err, chats) {
        if (err) {
          console.error(`Error in chats subscription: `, err);
        } else {
          console.debug(`sub chat data received: `, chats);

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

          dispatch({
            type: ACTIONS.LOAD_CHAT_DATA,
            data: { contacts, messages }
          });
        }
      },
      eventName: "chats"
    });

    return sub;
  } catch (e) {
    alert(`Could not subscribe to chats: ${e.message}`);
    console.error(`Could not subscribe to chats: `, e);
  }
};

export const subReceivedRequests = () => async dispatch => {
  try {
    console.debug(`Subbing to received requests`);
    const sub = await subscribeSocket({
      callback(err, receivedRequests) {
        if (err) {
          console.error(`Error in received requests subscription: `, err);
        } else {
          console.debug(
            `sub received requests data received: `,
            receivedRequests
          );

          /** @type {LoadReceivedRequestsAction} */
          const action = {
            type: ACTIONS.LOAD_RECEIVED_REQUESTS,
            data: receivedRequests.map(request => {
              /** @type {ReceivedRequest} */
              const req = {
                id: request.id,
                pk: request.requestorPK,
                avatar: request.requestorAvatar,
                displayName: request.requestorDisplayName,
                timestamp: request.timestamp
              };

              return req;
            })
          };

          dispatch(action);
        }
      },
      eventName: "receivedRequests"
    });

    return sub;
  } catch (e) {
    alert(`Could not subscribe to received requests: ${e.message}`);
    console.error(`Could not subscribe to received requests: `, e);
  }
};

export const subSentRequests = () => async dispatch => {
  try {
    console.debug(`Subbing to sent requests`);
    const sub = await subscribeSocket({
      callback(err, sentRequests) {
        if (err) {
          console.error(`Error in sent requests subscription: `, err);
        } else {
          console.debug(`sub sent requests data received: `, sentRequests);

          /** @type {LoadSentRequestsAction} */
          const action = {
            type: ACTIONS.LOAD_SENT_REQUESTS,
            data: sentRequests.map(request => {
              /** @type {SentRequest} */
              const req = {
                id: request.id,
                pk: request.recipientPublicKey,
                avatar: request.recipientAvatar,
                displayName: request.recipientDisplayName,
                changedAddress: request.recipientChangedRequestAddress,
                timestamp: request.timestamp,
                loading: false
              };

              return req;
            })
          };

          dispatch(action);
        }
      },
      eventName: "sentRequests"
    });

    return sub;
  } catch (e) {
    alert(`Could not subscribe to sent requests: ${e.message}`);
    console.error(`Could not subscribe to sent requests: `, e);
  }
};

export const sendHandshakeRequestNew = publicKey => async (_, getState) => {
  /**
   * @type {Promise<string>}
   */
  const epubP = new Promise((res, rej) => {
    const subscription = rifle({
      onData(epub) {
        if (Common.isPopulatedString(epub)) {
          res(epub);
          subscription.then(sub => sub.off());
        } else {
          rej(new TypeError(`Could not fetch epub`));
          subscription.then(sub => sub.off());
        }
      },
      query: `${publicKey}::epub::on`,
      onError(e) {
        if (typeof e === "string") {
          rej(new Error(e));
        } else {
          rej(e);
        }
      }
    });
  });

  /**
   * @type {Promise<string>}
   */
  const handshakeAddressP = new Promise((res, rej) => {
    const subscription = rifle({
      onData(handshakeAddress) {
        if (Common.isPopulatedString(handshakeAddress)) {
          res(handshakeAddress);
          subscription.then(sub => sub.off());
        } else {
          rej(new TypeError(`Could not fetch epub`));
          subscription.then(sub => sub.off());
        }
      },
      query: `${publicKey}::currentHandshakeAddress::on`,
      onError(e) {
        if (typeof e === "string") {
          rej(new Error(e));
        } else {
          rej(e);
        }
      }
    });
  });

  /**
   * @type {Promise<string>}
   */
  const selfEpubP = new Promise((res, rej) => {
    const subscription = rifle({
      onData(epub) {
        if (Common.isPopulatedString(epub)) {
          res(epub);
          subscription.then(sub => sub.off());
        } else {
          rej(new TypeError(`Could not fetch self epub`));
          subscription.then(sub => sub.off());
        }
      },
      query: `$user::epub::on`,
      onError(e) {
        if (typeof e === "string") {
          rej(new Error(e));
        } else {
          rej(e);
        }
      }
    });
  });

  const outgoingID = uuidv4();
  const incomingID = uuidv4();
  const requestID = uuidv4();
  const [epub, handshakeAddress, selfEpub] = await Promise.all([
    epubP,
    handshakeAddressP,
    selfEpubP
  ]);

  await Utils.Http.post(`/api/gun/set`, {
    path: `$gun>handshakeNodes>${handshakeAddress}>${requestID}`,
    value: {
      id: requestID,
      from: {
        $$__ENCRYPT__FOR: publicKey,
        $$__EPUB__FOR: epub,
        value: getState().node.publicKey
      },
      epub: selfEpub,
      timestamp: Date.now(),
      response: {
        $$__ENCRYPT__FOR: publicKey,
        $$__EPUB__FOR: epub,
        value: `[ "${outgoingID}" , "${incomingID}" ]`
      }
    }
  });

  // after request was sent let's now create our outgoing feed

  await Utils.Http.post(`/api/gun/put`, {
    path: `$user>outgoings>${outgoingID}`,
    value: {
      with: {
        $$__ENCRYPT__FOR: "me",
        value: {
          messages: {
            [uuidv4()]: {
              body: {
                $$__ENCRYPT__FOR: publicKey,
                $$__EPUB__FOR: epub,
                value: Common.INITIAL_MSG
              }
            }
          },
          with: {
            $$__ENCRYPT__FOR: "me",
            value: publicKey
          },
          incomingID: {
            $$__ENCRYPT__FOR: "me",
            value: incomingID
          }
        }
      }
    }
  });
};
