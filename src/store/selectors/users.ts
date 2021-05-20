import { Schema } from "shock-common";

import { State } from "../../reducers";

import { selectSelfPublicKey } from "./auth";

export const selectSelfUser = (state: State) => {
  const selfPublicKey = selectSelfPublicKey(state);
  const maybeUser = state.userProfiles[selfPublicKey];
  if (maybeUser) {
    return maybeUser;
  } else {
    console.error("No self user created at auth?");
    return Schema.createEmptyUser(selfPublicKey);
  }
};

export const selectUser = (publicKey: string) => (
  state: State
): Schema.User => {
  const maybeUser = state.userProfiles[publicKey];

  if (maybeUser) {
    return maybeUser;
  } else {
    return Schema.createEmptyUser(publicKey);
  }
};

export const selectAllPublicKeys = (state: State): string[] => {
  return Object.keys(state.userProfiles);
};

export const selectAllOtherPublicKeys = (state: State): string[] => {
  const selfPublicKey = selectSelfPublicKey(state);
  return selectAllPublicKeys(state).filter(key => key !== selfPublicKey);
};

export const selectAllOtherUsers = createSelector(
  (state: State) => state.users,
  selectAllOtherPublicKeys,
  (users, allOtherPublicKeys): Schema.User[] => {
    const usersWithoutSelf = pickBy<Schema.User>(users, (_, publicKey) =>
      allOtherPublicKeys.includes(publicKey)
    );
    return Object.values(usersWithoutSelf);
  }
);
