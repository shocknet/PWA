// @ts-check
/**
 * @format
 */
import produce from "immer";
import * as Common from "shock-common";
/**
 * @typedef {import('redux').AnyAction} AnyAction
 * @typedef {import("shock-common").StoredRequest} StoredReq
 */
/**
 * @template S
 * @typedef {import('redux').Reducer<S, AnyAction>} Reducer
 */

import * as Schema from "../schema";
import {
  ACTIONS,
  handshakeAddressUpdated,
  receivedHandshakeRequest
} from "../actions/ChatActions";
/**
 * @typedef {import('../schema').ReceivedRequest} ReceivedRequest
 */

const INITIAL_STATE = {
  /**
   * @type {Record<string, Schema.ChatMessage[]>}
   */
  messages: {},
  receivedRequests: /** @type {ReceivedRequest[]} */ ([]),
  requestBlacklist: [],
  currentHandshakeAddress: /** @type {string} */ ("DOES_NOT_EXIST")
};

/**
 * @param {Schema.ChatMessage} oldMessage
 * @param {Schema.ChatMessage} newMessage
 * @returns {boolean}
 */
const _identicalMessages = (oldMessage, newMessage) =>
  oldMessage.id && newMessage.id
    ? oldMessage.id === newMessage.id
    : oldMessage.localId === newMessage.localId;

/**
 * @param {Schema.ChatMessage[]} messages
 * @returns {Schema.ChatMessage[]}
 */
const _sortMessages = (messages = []) =>
  messages.sort((a, b) => b.timestamp - a.timestamp);

/**
 * @typedef {object} ProcessNewMessageParams
 * @prop {Schema.ChatMessage} data
 * @prop {Schema.ChatMessageStatus} status
 * @prop {typeof INITIAL_STATE} state
 * @prop {boolean=} outgoing
 */

/**
 * @param {ProcessNewMessageParams} args
 * @returns {typeof INITIAL_STATE}
 */
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
  if (handshakeAddressUpdated.match(action)) {
    const { handshakeAddress } = action.payload;
    return produce(state, draft => {
      if (
        draft.currentHandshakeAddress !== handshakeAddress &&
        Common.isPopulatedString(handshakeAddress)
      ) {
        draft.receivedRequests = [];
        draft.currentHandshakeAddress = handshakeAddress;
      }
    });
  }
  if (receivedHandshakeRequest.match(action)) {
    const { receivedRequest } = action.payload;
    return produce(state, draft => {
      if (draft.receivedRequests.find(req => req.id === receivedRequest.id)) {
        return;
      }
      draft.receivedRequests.push(receivedRequest);
    });
  }

  switch (action.type) {
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
        status: Schema.CHAT_MESSAGE_STATUS.SENDING,
        state,
        outgoing: true
      });
    }
    case ACTIONS.SENT_MESSAGE: {
      const { data } = action;
      return _processNewMessage({
        data,
        status: Schema.CHAT_MESSAGE_STATUS.SENT,
        state,
        outgoing: true
      });
    }
    case ACTIONS.FAILED_MESSAGE: {
      const { data } = action;
      return _processNewMessage({
        data,
        status: Schema.CHAT_MESSAGE_STATUS.FAILED,
        state,
        outgoing: true
      });
    }
    case ACTIONS.RECEIVED_MESSAGE: {
      const { data } = action;
      return _processNewMessage({
        data,
        status: Schema.CHAT_MESSAGE_STATUS.RECEIVED,
        state
      });
    }
    case ACTIONS.CHAT_WAS_DELETED: {
      const {
        data: { publicKey }
      } = action;
      return produce(state, draft => {
        delete draft.messages[publicKey];
        draft.messages[publicKey] = [];
      });
    }
    default:
      return state;
  }
};

export default chat;
