// @ts-check
import Http from "../../utils/Http";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
/**
 * @typedef {import('shock-common').Message} RawMessage
 * @typedef {import('../../schema').Subscription} Subscription
 */

/**
 * @typedef {import('../../schema').Contact} Contact
 * @typedef {import('../../schema').SentRequest} SentRequest
 * @typedef {import("../../schema").ReceivedRequest} ReceivedRequest
 * @typedef {import('../../schema').ChatMessage} ChatMessage
 */

export const ACTIONS = {
  SET_CHAT_CONTACTS: "chat/contacts",
  SET_CHAT_MESSAGES: "chat/messages",
  SENT_REQUEST: /** @type {"chat/request/sent"} */ ("chat/request/sent"),
  SENDING_MESSAGE: "chat/message/sending",
  SENT_MESSAGE: "chat/message/sent",
  FAILED_MESSAGE: "chat/message/failed",
  RECEIVED_MESSAGE: /** @type {"chat/message/received"} */ ("chat/message/received"),
  CHAT_WAS_DELETED: /** @type {'chat/deleted'} */ ("chat/deleted")
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
