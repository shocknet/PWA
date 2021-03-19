import Http from "../utils/Http";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import {
  getChats,
  getReceivedRequests,
  getSentRequests,
  rifle
} from "../utils/WebSocket";
import { initialMessagePrefix } from "../utils/String";

export const ACTIONS = {
  LOAD_CHAT_DATA: "chat/loadData",
  LOAD_SENT_REQUESTS: "chat/loadSentRequests",
  LOAD_RECEIVED_REQUESTS: "chat/loadReceivedRequests",
  SET_CHAT_CONTACTS: "chat/contacts",
  SET_CHAT_MESSAGES: "chat/messages",
  SENT_REQUEST: "chat/request/sent",
  ACCEPT_HANDSHAKE_REQUEST: "chat/request/accept",
  DECLINE_HANDSHAKE_REQUEST: "chat/request/decline",
  SENDING_MESSAGE: "chat/message/sending",
  SENT_MESSAGE: "chat/message/sent",
  FAILED_MESSAGE: "chat/message/failed",
  RECEIVED_MESSAGE: "chat/message/received"
};

export const MESSAGE_STATUS = {
  SENT: "SENT",
  SENDING: "SENDING",
  FAILED: "FAILED",
  RECEIVED: "RECEIVED"
};

export const loadChatData = () => async (dispatch, getState) => {
  const { hostIP, authToken } = getState().node;
  const data = await getChats({ hostIP, authToken });
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

    dispatch({
      type: ACTIONS.LOAD_SENT_REQUESTS,
      data: sentRequests.map(request => ({
        id: request.id,
        pk: request.recipientPublicKey,
        avatar: request.recipientAvatar,
        displayName: request.recipientDisplayName,
        changedAddress: request.recipientChangedRequestAddress,
        timestamp: request.timestamp
      }))
    });
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

    dispatch({
      type: ACTIONS.LOAD_RECEIVED_REQUESTS,
      data: receivedRequests.map(request => ({
        id: request.id,
        pk: request.requestorPK,
        avatar: request.requestorAvatar,
        displayName: request.requestorDisplayName,
        timestamp: request.timestamp
      }))
    });
  });
};

export const subscribeChatMessages = (
  userPublicKey,
  recipientPublicKey
) => async (dispatch, getState) => {
  const { hostIP } = getState().node;
  const { data: incomingId } = await Http.get(
    `/api/gun/user/once/userToIncoming>${recipientPublicKey}`,
    {
      headers: {
        "public-key-for-decryption": userPublicKey
      }
    }
  );

  if (!incomingId.data) {
    console.warn("Unable to retrieve incoming ID for selected contact");
    return null;
  }

  const incomingMessages = rifle({
    host: hostIP,
    query: `${recipientPublicKey}::outgoings>${incomingId.data}>messages::map.on`,
    publicKey: recipientPublicKey
  });

  incomingMessages.on("$shock", (message, id) => {
    if (!message.body || message.body === initialMessagePrefix) {
      return;
    }
    dispatch({
      type: ACTIONS.RECEIVED_MESSAGE,
      data: { ...message, id, recipientPublicKey, localId: id }
    });
  });

  return incomingMessages;
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

  const { sentRequests } = getState().chat;
  const [userExists] = sentRequests.filter(
    request => request.recipientPublicKey === publicKey
  );

  if (!userExists) {
    dispatch({
      type: ACTIONS.SENT_REQUEST,
      data: publicKey
    });
  }

  return data;
};

export const sendMessage = ({
  publicKey,
  message,
  localId
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
