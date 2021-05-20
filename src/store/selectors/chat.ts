import { createSelector } from "reselect";
import * as Common from "shock-common";

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

export const selectUserToIncoming = (state: State) => state.chat.userToIncoming;

export const selectSentRequests = createSelector(
  (state: State) => state.chat.storedReqs,
  (state: State) => state.chat.pubToAddress,
  (state: State) => state.chat.userToLastReqSent,
  selectUserToIncoming,
  (
    storedReqs,
    pubToAddress,
    userToLastReqSent,
    userToIncoming
  ): Schema.SentRequest[] => {
    const sentRequests: Schema.SentRequest[] = [];

    for (const storedReq of Object.values(storedReqs)) {
      const {
        handshakeAddress,
        recipientPub,
        sentReqID,
        timestamp
      } = storedReq;
      const currAddress = pubToAddress[recipientPub];

      const lastReqID = userToLastReqSent[recipientPub];
      // invalidate if this stored request is not the last one sent to this
      // particular pk
      const isStale =
        typeof lastReqID !== "undefined" && lastReqID !== sentReqID;
      // invalidate if we are in a pub/sub state to this pk (handshake in place)
      const isConnected = userToIncoming[recipientPub];

      if (isStale || isConnected) {
        // eslint-disable-next-line no-continue
        continue;
      }

      sentRequests.push({
        id: sentReqID,
        changedAddress:
          // if we haven't received the other's user current handshake address,
          // let's assume he hasn't changed it and that this request is still
          // valid
          typeof currAddress !== "undefined" &&
          handshakeAddress !== currAddress,

        avatar: null,
        displayName: null,
        loading: false,
        pk: recipientPub,
        timestamp
      });
    }

    return sentRequests;
  }
);

export const selectContacts = createSelector(
  selectAllOtherUsers,
  selectUserToIncoming,
  (users, userToIncoming): Common.User[] => {
    return Object.values(users).filter(
      user => !!userToIncoming[user.publicKey]
    );
  }
);
