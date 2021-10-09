import { createSelector } from "reselect";

import { State } from "../../reducers";

import { selectSelfPublicKey } from "./auth";

export const selectFollows = createSelector(
  selectSelfPublicKey,
  (state: State) => {
    if (!state.auth.authenticated) {
      return state.guest.follows;
    }

    return state.feed.follows;
  },
  (selfPublicKey, follows) => {
    return follows.filter(f => f.user !== selfPublicKey);
  }
);
