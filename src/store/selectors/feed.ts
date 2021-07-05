import * as Common from "shock-common";
import pick from "lodash/pick";
import pickBy from "lodash/pickBy";
import { createSelector } from "reselect";

import * as Schema from "../../schema";
import { State } from "../../reducers";

import { selectSelfPublicKey } from "./auth";
import { selectFollows } from "./follows";

export const selectFeedPosts = createSelector(
  selectSelfPublicKey,
  (state: State) => state.feed.posts,
  (selfPublicKey, posts) => {
    // TODO: fix self-follow bug
    return pickBy(posts, (_, publicKey) => publicKey !== selfPublicKey);
  }
);

export const selectAllPosts = (state: State) => state.feed.posts;

export const selectAllSharedPosts = (state: State) => state.feed.sharedPosts;

export const selectSinglePost = (authorId: string, postID: string) => (
  state: State
): Schema.Post | null => {
  return state.feed.posts[authorId]?.find(post => post.id === postID) || null;
};

export const selectPostsNewestToOldest = (publicKey: string) => (
  state: State
): Array<Schema.Post | Common.SharedPost> => {
  const posts = state.feed.posts[publicKey]?.slice() || [];
  const sharedPostsMap = state.feed.sharedPosts[publicKey] || {};
  const sharedPosts = Object.values(sharedPostsMap);
  const allPosts = [...posts, ...sharedPosts];

  allPosts.sort((a, b) => {
    const alpha = Common.isSharedPost(a) ? a.shareDate : a.date;
    const beta = Common.isSharedPost(b) ? b.shareDate : b.date;

    return beta - alpha;
  });

  return allPosts;
};

export const selectSharedPost = (sharer: string, postID: string) => (
  state: State
): Common.SharedPost | null => {
  const sharedPostsMap = state.feed.sharedPosts[sharer] || {};
  return sharedPostsMap[postID] || null;
};

export const selectAllPostsFromFollowedNewestToOldest = createSelector(
  selectAllPosts,
  selectAllSharedPosts,
  selectFollows,
  (posts, sharedPosts, follows): Array<Schema.Post | Common.SharedPost> => {
    const followedPublicKeys = follows.map(f => f.user);
    const filteredPosts = pick(posts, followedPublicKeys);
    const filteredShared = pick(sharedPosts, followedPublicKeys);

    const allNonShared = Object.values(filteredPosts).flat();
    const allShared = Object.values(filteredShared)
      .map(records => Object.values(records))
      .flat();

    const all = [...allNonShared, ...allShared].sort((a, b) => {
      const alpha = Common.isSharedPost(a) ? a.shareDate : a.date;
      const beta = Common.isSharedPost(b) ? b.shareDate : b.date;

      return beta - alpha;
    });

    return all;
  }
);
