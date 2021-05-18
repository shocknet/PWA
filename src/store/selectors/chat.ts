import { State } from "../../reducers";
import * as Schema from "../../schema";

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

export const selectReceivedRequests = (
  state: State
): Schema.ReceivedRequest[] => {
  const { receivedRequests, recipientToOutgoing } = state.chat;

  return receivedRequests.filter(req => {
    const conversationExists = recipientToOutgoing[req.pk];

    return !conversationExists;
  });
};
