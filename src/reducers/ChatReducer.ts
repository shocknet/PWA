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

import * as Schema from "../schema";
import {
  handshakeAddressUpdated,
  receivedHandshakeRequest,
  convoReceived,
  convoDeleted,
  messageTransmissionFailed,
  messageTransmissionRequested,
  messageTransmissionRetried,
  messageTransmissionSucceeded,
  handshakeRequestDeleted
} from "../actions/ChatActions";

const INITIAL_STATE = {
  currentHandshakeAddress: "DOES_NOT_EXIST" as string,
  convos: {} as Record<string, Schema.Convo>,
  /**
   * Maps convo id to a set of the messages corresponding to it.
   */
  convoToMessages: {} as Record<
    string,
    Record<
      string,
      Schema.ConvoMsg & { err: string; state: "ok" | "sending" | "error" }
    >
  >,
  receivedRequests: {} as Record<string, Schema.HandshakeReqNew>
};

const chat = produce((draft, action) => {
  if (handshakeAddressUpdated.match(action)) {
    const { handshakeAddress } = action.payload;
    if (
      draft.currentHandshakeAddress !== handshakeAddress &&
      Common.isPopulatedString(handshakeAddress)
    ) {
      draft.receivedRequests = {};
      draft.currentHandshakeAddress = handshakeAddress;
    }
  }

  if (receivedHandshakeRequest.match(action)) {
    const { receivedRequest } = action.payload;
    if (!draft.receivedRequests[receivedRequest.id]) {
      draft.receivedRequests[receivedRequest.id] = receivedRequest;
    }
  }

  if (convoReceived.match(action)) {
    const { convo } = action.payload;
    if (!draft.convos[convo.id]) {
      draft.convoToMessages[convo.id] = {};
      draft.convos[convo.id] = convo;
    }
  }

  if (convoDeleted.match(action)) {
    const { id } = action.payload;
    if (draft.convos[id]) {
      delete draft.convos[id];
    }
  }

  if (messageTransmissionFailed.match(action)) {
    const { convoID, errorMessage, messageID } = action.payload;
    draft.convoToMessages[convoID][messageID].err = errorMessage;
    draft.convoToMessages[convoID][messageID].state = "error";
  }
  if (messageTransmissionRequested.match(action)) {
    const { convoID, message, messageID } = action.payload;
    draft.convoToMessages[convoID][messageID] = {
      body: message,
      convoID,
      err: "",
      id: messageID,
      state: "sending",
      timestamp: Date.now()
    };
  }
  if (messageTransmissionRetried.match(action)) {
    const { convoID, messageID } = action.payload;
    draft.convoToMessages[convoID][messageID].err = "";
    draft.convoToMessages[convoID][messageID].state = "sending";
  }
  if (messageTransmissionSucceeded.match(action)) {
    const { convoID, messageID } = action.payload;
    draft.convoToMessages[convoID][messageID].err = "";
    draft.convoToMessages[convoID][messageID].state = "ok";
  }
  if (handshakeRequestDeleted.match(action)) {
    const { id } = action.payload;
    if (draft.receivedRequests[id]) {
      delete draft.receivedRequests[id];
    }
  }
}, INITIAL_STATE);

export default chat;
