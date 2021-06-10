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
  convoDeleted
} from "../actions/ChatActions";

const INITIAL_STATE = {
  currentHandshakeAddress: "DOES_NOT_EXIST" as string,
  convos: /** @type {Record<string, FeedNew>} */ {} as Record<
    string,
    Schema.Convo
  >,
  /**
   * Maps convo id to a set of the messages corresponding to it.
   */
  convoToMessages: {} as Record<string, Record<string, Schema.ConvoMsg>>,
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
      draft.convos[convo.id] = convo;
    }
  }

  if (convoDeleted.match(action)) {
    const { id } = action.payload;
    if (draft.convos[id]) {
      delete draft.convos[id];
    }
  }
}, INITIAL_STATE);

export default chat;
