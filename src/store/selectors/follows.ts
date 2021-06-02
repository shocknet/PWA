import { createSelector } from "reselect";

import { State } from "../../reducers";

import { selectSelfPublicKey } from "./auth";

export const selectFollows = createSelector(
  selectSelfPublicKey,
  (state: State) => state.feed.follows,
  (selfPublicKey, follows) => {
    return follows.filter(f => f.user !== selfPublicKey);
  }
);
