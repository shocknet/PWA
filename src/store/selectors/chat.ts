import { createSelector } from "reselect";
import uniq from "lodash/uniq";
import * as Common from "shock-common";

import { State } from "../../reducers";
import * as Schema from "../../schema";

export const selectConvos: (state: State) => Schema.Convo[] = createSelector(
  (state: State) => state.chat.convos,
  convos => {
    return Object.values(convos);
  }
);

export const selectSingleConvo = (convoID: string) => (
  state: State
): Schema.Convo | null => {
  const convo = state.chat.convos[convoID];
  return convo ?? null;
};

/**
 * TODO: Memoize.
 */
export const selectIsInContact = (publicKey: string) => (
  state: State
): boolean => {
  return !!Object.values(state.chat.convos).find(
    convo => convo.with === publicKey
  );
};

export const selectCurrentHandshakeAddress = (state: State) =>
  state.chat.currentHandshakeAddress;

export const selectReceivedRequests: (
  state: State
) => Schema.HandshakeReqNew[] = createSelector(
  (state: State) => state.chat.receivedRequests,
  selectConvos,
  (receivedRequests, convos) => {
    return Object.values(receivedRequests).filter(
      req => !convos.find(convo => convo.id === req.receiverConvoID)
    );
  }
);

export const selectAllMessages = (state: State) => state.chat.convoToMessages;

export const selectContacts = createSelector(
  (state: State) => state.chat.convos,
  (state: State) => state.userProfiles,
  (convos, users): Common.User[] => {
    const _publicKeys = Object.values(convos).map(convo => convo.with);
    const publicKeys = uniq(_publicKeys);
    return publicKeys.map(publicKey => {
      const user = users[publicKey];
      if (!user) {
        return Common.createEmptyUser(publicKey);
      }
      return user;
    });
  }
);

export const selectCommunication = (convoIDOrRequestID: string) => (
  state: State
): Schema.Convo | Schema.HandshakeReqNew | null => {
  const maybeConvo = state.chat.convos[convoIDOrRequestID];
  const maybeRequest = state.chat.receivedRequests[convoIDOrRequestID];

  if (maybeRequest) {
    return maybeRequest;
  }

  if (maybeConvo) {
    return maybeConvo;
  }

  return null;
};

export const selectConvoMessages = (convoID: string) => (
  state: State
): Schema.ConvoMsg[] => {
  return Object.values(state.chat.convoToMessages[convoID]).sort((a, b) => {
    return b.timestamp - a.timestamp;
  });
};
