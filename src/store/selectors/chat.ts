import { createSelector } from "reselect";

import { State } from "../../reducers";
import * as Schema from "../../schema";

import { selectAllOtherUsers } from "./users";

export const selectIsInContact = (publicKey: string) => (
  state: State
): boolean => {
  const {
    chat: { contacts, sentRequests, receivedRequests }
  } = state;

  const isContact = !!contacts.find(c => c.pk === publicKey);
  const hasSentReq = !!sentRequests.find(r => r.pk === publicKey);
  const hasReceivedReq = !!receivedRequests.find(r => r.pk === publicKey);

  return isContact || hasSentReq || hasReceivedReq;
};

export const selectCurrentHandshakeAddress = (state: State) =>
  state.chat.currentHandshakeAddress;

export const selectReceivedRequests = createSelector(
  (state: State) => state.chat.receivedRequests,
  (state: State) => state.chat.recipientToOutgoing,
  (receivedRequests, recipientToOutgoing): Schema.ReceivedRequest[] => {
    return receivedRequests.filter(req => {
      const conversationExists = recipientToOutgoing[req.pk];

      return !conversationExists;
    });
  }
);

export const selectContacts = selectAllOtherUsers;
