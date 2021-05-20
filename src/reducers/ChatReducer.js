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
  receivedHandshakeRequest,
  recipientToOutgoingReceived,
  userToIncomingReceived,
  storedReqUpdated,
  pubToAddressUpdated,
  userToLastReqSentUpdated,
  otherUserDisconnected
} from "../actions/ChatActions";
/**
 * @typedef {import('../schema').ReceivedRequest} ReceivedRequest
 * @typedef {import("../schema").SentRequest} SentRequest
 *
 * @typedef {import('../actions/ChatActions').SentRequestAction} SentRequestAction
 * @typedef {import('../actions/ChatActions').LoadChatDataAction} LoadChatDataAction
 * @typedef {import('../actions/ChatActions').LoadReceivedRequestsAction} LoadReceivedRequestsAction
 * @typedef {import('../actions/ChatActions').LoadSentRequestsAction} LoadSentRequestsAction
 */

const INITIAL_STATE = {
  /**
   * @type {Record<string, Schema.ChatMessage[]>}
   */
  messages: {},
  sentRequests: /** @type {SentRequest[]} */ ([]),
  receivedRequests: /** @type {ReceivedRequest[]} */ ([]),
  requestBlacklist: [],
  currentHandshakeAddress: /** @type {string} */ ("donotexistdoesnotexist"),
  recipientToOutgoing: /** @type {Record<string, string>} */ ({}),
  userToIncoming: /** @type {Record<string, string>} */ ({}),
  storedReqs: /** @type {Record<string, StoredReq>} */ ({}),
  pubToAddress: /** @type {Record<string, string>} */ ({}),
  userToLastReqSent: /** @type {Record<string, string>} */ ({})
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
  if (recipientToOutgoingReceived.match(action)) {
    const { outgoingID, publicKey } = action.payload;
    return produce(state, draft => {
      if (outgoingID === null && draft.recipientToOutgoing[publicKey]) {
        delete draft.recipientToOutgoing[publicKey];
      } else if (draft.recipientToOutgoing[publicKey] !== outgoingID) {
        draft.recipientToOutgoing[publicKey] = outgoingID;
      }
    });
  }
  if (userToIncomingReceived.match(action)) {
    const { incomingID, publicKey } = action.payload;
    return produce(state, draft => {
      if (incomingID === null && draft.userToIncoming[publicKey]) {
        delete draft.userToIncoming[publicKey];
      } else if (draft.userToIncoming[publicKey] !== incomingID) {
        draft.userToIncoming[publicKey] = incomingID;
      }
    });
  }
  if (otherUserDisconnected.match(action)) {
    const { recipientPublicKey } = action.payload;
    return produce(state, draft => {
      if (draft.userToIncoming[recipientPublicKey] !== Schema.DID_DISCONNECT) {
        draft.userToIncoming[recipientPublicKey] = Schema.DID_DISCONNECT;
      }
    });
  }
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
  if (storedReqUpdated.match(action)) {
    const { storedReq, storedReqID } = action.payload;

    return produce(state, draft => {
      if (storedReq === null && draft.storedReqs[storedReqID]) {
        delete draft.storedReqs[storedReqID];
        // stored reqs do not get edited
      }
      if (storedReq !== null && !draft.storedReqs[storedReqID]) {
        draft.storedReqs[storedReqID] = storedReq;
      }
    });
  }
  if (pubToAddressUpdated.match(action)) {
    const { address, pub } = action.payload;

    return produce(state, draft => {
      if (draft.pubToAddress[pub] !== address) {
        draft.pubToAddress[pub] = address;
      }
    });
  }
  if (userToLastReqSentUpdated.match(action)) {
    const { lastReqSent, user } = action.payload;

    return produce(state, draft => {
      if (lastReqSent === null && draft.userToLastReqSent[user]) {
        delete draft.userToLastReqSent[user];
      }
      if (
        lastReqSent !== null &&
        draft.userToLastReqSent[user] !== lastReqSent
      ) {
        draft.userToLastReqSent[user] = lastReqSent;
      }
    });
  }
  switch (action.type) {
    case ACTIONS.LOAD_CHAT_DATA: {
      const {
        data: { messages }
      } = /** @type {LoadChatDataAction} */ (action);
      return {
        ...state,
        // TODO: Could not replacing messages altogether be bad?
        messages: {
          ...state.messages,
          ...messages
        }
      };
    }
    case ACTIONS.LOAD_SENT_REQUESTS: {
      const {
        data: sentRequests
      } = /** @type {LoadSentRequestsAction} */ (action);
      const requestPublicKeys = state.sentRequests.map(request => request.pk);
      const pendingRequests = state.sentRequests.filter(
        request => request.loading && !requestPublicKeys.includes(request.pk)
      );

      return {
        ...state,
        sentRequests: [...pendingRequests, ...sentRequests]
      };
    }
    case ACTIONS.LOAD_RECEIVED_REQUESTS: {
      const {
        data: receivedRequests
      } = /** @type {LoadReceivedRequestsAction} */ (action);

      return {
        ...state,
        receivedRequests
      };
    }
    case ACTIONS.SENT_REQUEST: {
      const { data: publicKey } = /** @type {SentRequestAction} */ (action);
      return {
        ...state,
        sentRequests: [
          ...state.sentRequests,
          {
            avatar: null,
            changedAddress: false,
            displayName: null,
            id: "loading/" + publicKey,
            pk: publicKey,
            timestamp: Date.now(),
            loading: true
          }
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
