// @ts-check
import Http from "../../utils/Http";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import * as Common from "shock-common";
/**
 * @typedef {import('shock-common').Message} RawMessage
 * @typedef {import('../../schema').Subscription} Subscription
 */

import {
  getChats,
  getReceivedRequests,
  getSentRequests
} from "../../utils/WebSocket";
/**
 * @typedef {import('../../schema').Contact} Contact
 * @typedef {import('../../schema').SentRequest} SentRequest
 * @typedef {import("../../schema").ReceivedRequest} ReceivedRequest
 * @typedef {import('../../schema').ChatMessage} ChatMessage
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

export const loadChatData = () => async (dispatch, getState) => {
  const { authToken } = getState().node;
  const data = await getChats({ authToken });
  console.log("LOAD_CHAT_DATA:", data);

  dispatch({
    type: ACTIONS.LOAD_CHAT_DATA,
    data
  });
};

export const loadSentRequests = () => (dispatch, getState) => {
  const { hostIP, authToken } = getState().node;
  getSentRequests({ hostIP, authToken }, (err, sentRequests) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("sentRequests:", sentRequests);

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
  });
};

export const loadReceivedRequests = () => (dispatch, getState) => {
  const { hostIP, authToken } = getState().node;
  getReceivedRequests({ hostIP, authToken }, (err, receivedRequests) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("receivedRequests:", receivedRequests);

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
  });
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