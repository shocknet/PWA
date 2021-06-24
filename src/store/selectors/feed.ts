import pickBy from "lodash/pickBy";
import { createSelector } from "reselect";

import * as Schema from "../../schema";
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

export const selectSinglePost = (authorId: string, postID: string) => (
  state: State
): Schema.Post | Schema.SharedPost | null => {
  return state.feed.posts[authorId]?.find(post => post.id === postID) || null;
};

export const selectSingleSelfPost = (postID: string) => (
  state: State
): Schema.Post | Schema.SharedPost | null => {
  const selfPublicKey = selectSelfPublicKey(state);
  return selectSinglePost(selfPublicKey, postID)(state);
};
