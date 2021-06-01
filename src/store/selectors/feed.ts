import pickBy from "lodash/pickBy";

import { State } from "../../reducers";

import { selectSelfPublicKey } from "./auth";

export const selectFeedPosts = (state: State) => {
  // TODO: fix self-follow bug
  const selfPublicKey = selectSelfPublicKey(state);
  return pickBy(
    state.feed.posts,
    (_, publicKey) => publicKey !== selfPublicKey
  );
};
