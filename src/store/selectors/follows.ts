import { State } from "../../reducers";

import { selectSelfPublicKey } from "./auth";

export const selectFollows = (state: State) => {
  const selfPublicKey = selectSelfPublicKey(state);
  // TODO: Fix self-follow bug
  return state.feed.follows.filter(f => f.user !== selfPublicKey);
};
