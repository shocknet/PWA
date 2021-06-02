import pickBy from "lodash/pickBy";
import { createSelector } from "reselect";

import { State } from "../../reducers";

import { selectSelfPublicKey } from "./auth";

export const selectFeedPosts = createSelector(
  selectSelfPublicKey,
  (state: State) => state.feed.posts,
  (selfPublicKey, posts) => {
    // TODO: fix self-follow bug
    return pickBy(posts, (_, publicKey) => publicKey !== selfPublicKey);
  }
);
