/**
 * @format
 */
/**
 * @typedef {import('redux').AnyAction} AnyAction
 */
/**
 * @template S
 * @typedef {import('redux').Reducer<S, AnyAction>} Reducer
 */
import { ACTIONS, MESSAGE_STATUS } from "../actions/ChatActions";
/**
 * @typedef {import('../schema').Contact} Contact
 * @typedef {import('../schema').ReceivedRequest} ReceivedRequest
 * @typedef {import("../schema").SentRequest} SentRequest
 */

const INITIAL_STATE = {
  contacts: /** @type {Contact[]} */ ([]),
  messages: {},
  sentRequests: /** @type {SentRequest[]} */ ([]),
  receivedRequests: /** @type {ReceivedRequest[]} */ ([]),
  requestBlacklist: []
};

const _identicalMessages = (oldMessage, newMessage) =>
  oldMessage.id && newMessage.id
    ? oldMessage.id === newMessage.id
    : oldMessage.localId === newMessage.localId;

const _sortMessages = (messages = []) =>
  messages.sort((a, b) => b.timestamp - a.timestamp);

const _processNewMessage = ({ data, status, state, outgoing = false }) => {
  const userMessages = state.messages[data.recipientPublicKey] ?? [];
  const [existingMessage] = userMessages.filter(message =>
    _identicalMessages(message, data)
  );

  if (existingMessage) {
    console.warn("Duplicate Message:", existingMessage?.body);
  }

  if (existingMessage) {
    const messages = userMessages.map(message =>
      _identicalMessages(message, existingMessage)
        ? { ...existingMessage, ...data, status, outgoing }
        : message
    );
    const sortedMessages = _sortMessages(messages);

    return {
      ...state,
      messages: {
        ...state.messages,
        [data.recipientPublicKey]: sortedMessages
      }
    };
  }

  const messages = [{ ...data, status, outgoing }, ...userMessages];
  const sortedMessages = _sortMessages(messages);

  return {
    ...state,
    messages: {
      ...state.messages,
      [data.recipientPublicKey]: sortedMessages
    }
  };
};

/**
 * @type {Reducer<typeof INITIAL_STATE>}
 */
const chat = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_CHAT_DATA: {
      const { contacts, messages } = action.data;
      return { ...state, contacts, messages };
    }
    case ACTIONS.LOAD_SENT_REQUESTS: {
      const requestPublicKeys = state.sentRequests.map(
        request => request.recipientPublicKey
      );
      const pendingRequests = state.sentRequests.filter(
        request =>
          request.loading &&
          !requestPublicKeys.includes(request.recipientPublicKey)
      );

      return {
        ...state,
        sentRequests: [...pendingRequests, ...action.data]
      };
    }
    case ACTIONS.LOAD_RECEIVED_REQUESTS: {
      return {
        ...state,
        receivedRequests: action.data
      };
    }
    case ACTIONS.SENT_REQUEST: {
      return {
        ...state,
        sentRequests: [
          ...state.sentRequests,
          { recipientPublicKey: action.data, loading: true }
        ]
      };
    }
    case ACTIONS.ACCEPT_HANDSHAKE_REQUEST: {
      const requestId = action.data;
      return {
        ...state,
        receivedRequests: state.receivedRequests.filter(
          request => request.id !== requestId
        )
      };
    }
    case ACTIONS.DECLINE_HANDSHAKE_REQUEST: {
      const requestId = action.data;
      if (!requestId || !requestId.trim()) {
        return state;
      }

      return {
        ...state,
        requestBlacklist: [...state.requestBlacklist, requestId]
      };
    }
    case ACTIONS.SENDING_MESSAGE: {
      const { data } = action;
      return _processNewMessage({
        data,
        status: MESSAGE_STATUS.SENDING,
        state,
        outgoing: true
      });
    }
    case ACTIONS.SENT_MESSAGE: {
      const { data } = action;
      return _processNewMessage({
        data,
        status: MESSAGE_STATUS.SENT,
        state,
        outgoing: true
      });
    }
    case ACTIONS.FAILED_MESSAGE: {
      const { data } = action;
      return _processNewMessage({
        data,
        status: MESSAGE_STATUS.FAILED,
        state,
        outgoing: true
      });
    }
    case ACTIONS.RECEIVED_MESSAGE: {
      const { data } = action;
      return _processNewMessage({
        data,
        status: MESSAGE_STATUS.RECEIVED,
        state
      });
    }
    default:
      return state;
  }
};

export default chat;
