import { createSelector } from "reselect";
import uniq from "lodash/uniq";
import * as Common from "shock-common";

import { State } from "../../reducers";
import * as Schema from "../../schema";

import { selectAllOtherUsers } from "./users";

export const selectConvos: (state: State) => Schema.Convo[] = createSelector(
  (state: State) => state.chat.convos,
  convos => {
    return Object.values(convos);
  }
);

export const selectSingleConvo = (convoID: string) => (state: State) => {
  const convo = state.chat.convos[convoID];
  if (!convo) {
    throw new ReferenceError(
      `Tried to select invalid convo with convoID: ${convoID}`
    );
  }
  return convo;
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
  receivedRequests => {
    return Object.values(receivedRequests);
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
