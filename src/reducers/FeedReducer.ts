import * as Common from "shock-common";
import produce from "immer";

import * as Utils from "../utils";
import * as Schema from "../schema";
import {
  ACTIONS,
  postDeleted,
  postReceived,
  contentItemReceived,
  sharedPostDeleted,
  sharedPostReceived,
  postTipReceived
} from "../actions/FeedActions";
import { ACTIONS as AUTH_ACTIONS } from "../actions/AuthActions";

const INITIAL_STATE = {
  follows: [],
  /**
   * Maps public key to posts/shared posts.
   */
  posts: {} as Record<string, Schema.Post[]>,
  sharedPosts: {} as Record<string, Record<string, Common.SharedPost>>,
  reloadDone: false
};

const feed = (state = INITIAL_STATE, action: any): typeof INITIAL_STATE => {
  if (postDeleted.match(action)) {
    const {
      payload: { author, id }
    } = action;
    return produce(state, draft => {
      if (!draft.posts[author]) {
        draft.posts[author] = [];
      }

      const idx = draft.posts[author].findIndex(p => p.id === id);

      if (idx > -1) {
        draft.posts[author].splice(idx, 1);
      }
    });
  }
  if (postReceived.match(action)) {
    const {
      payload: { author, id, post }
    } = action;
    return produce(state, draft => {
      if (!draft.posts[author]) {
        draft.posts[author] = [];
      }
      const idx = draft.posts[author].findIndex(p => p.id === id);

      if (idx === -1) {
        const newPost: Schema.Post = {
          authorId: author,
          contentItems: {},
          date: post.date,
          id,
          status: post.status,
          tags: post.tags,
          title: post.title,
          tips: {},
          type: "post"
        };
        draft.posts[author].push(newPost);
      }
    });
  }
  if (contentItemReceived.match(action)) {
    const {
      payload: { author, contentItem, id, postID }
    } = action;
    return produce(state, draft => {
      if (!draft.posts[author]) {
        Utils.logger.error(
          `Error inside feed reducer, received a content item but post is not in existing state (no author found), post id ${postID} from author ...${author.slice(
            -8
          )}`
        );
        return;
      }
      const idx = draft.posts[author].findIndex(p => p.id === postID);
      if (idx === -1) {
        Utils.logger.error(
          `Error inside feed reducer, received a content item but post is not in existing state, post id ${postID} from author ...${author.slice(
            -8
          )}`
        );
        return;
      }
      (draft.posts[author][idx] as Schema.Post).contentItems[id] = contentItem;
    });
  }
  if (sharedPostDeleted.match(action)) {
    const { postID, sharerPublicKey } = action.payload;

    return produce(state, draft => {
      if (!draft.sharedPosts[sharerPublicKey]) {
        draft.sharedPosts[sharerPublicKey] = {};
      }
      if (draft.sharedPosts[sharerPublicKey][postID]) {
        delete draft.sharedPosts[sharerPublicKey][postID];
      }
    });
  }
  if (sharedPostReceived.match(action)) {
    const {
      originalAuthor,
      postID,
      shareDate,
      sharerPublicKey
    } = action.payload;

    return produce(state, draft => {
      if (!draft.sharedPosts[sharerPublicKey]) {
        draft.sharedPosts[sharerPublicKey] = {};
      }
      draft.sharedPosts[sharerPublicKey][postID] = {
        originalAuthor,
        originalPostID: postID,
        shareDate,
        shareID: sharerPublicKey + postID,
        sharedBy: sharerPublicKey
      };
    });
  }

  if (postTipReceived.match(action)) {
    const { author, postID, tipAmt, tipID } = action.payload;

    return produce(state, draft => {
      const post = draft.posts[author].find(p => p.id === postID);
      if (!post) {
        Utils.logger.error(
          `Got tip for non existent post ${postID} from author ...${author.slice(
            -8
          )}`
        );
      }
      if (!post.tips) {
        // cached data from previous app version won't have the tips object
        post.tips = {};
      }
      if (!post.tips[tipID]) {
        post.tips[tipID] = tipAmt;
      }
    });
  }

  switch (action.type) {
    case ACTIONS.ADD_FOLLOW: {
      const { data } = action;
      const existingFollow = state.follows.find(
        follow => data.user === follow.user
      );

      if (existingFollow) {
        return {
          ...state,
          follows: state.follows.map(follow =>
            follow.user === data.user ? data : follow
          )
        };
      }

      return {
        ...state,
        follows: [...state.follows, data]
      };
    }
    case ACTIONS.REMOVE_FOLLOW: {
      const { data } = action;
      return {
        ...state,
        follows: state.follows.filter(follow => follow.user !== data)
      };
    }
    case ACTIONS.UPDATE_FOLLOW: {
      const { data } = action;

      const follows = state.follows.map(follow => {
        if (follow.user === data.key) {
          return {
            ...follow,
            profile: data
          };
        }

        return follow;
      });

      return {
        ...state,
        follows
      };
    }
    case ACTIONS.RELOAD_FEED: {
      return { ...state, reloadDone: true };
    }
    case ACTIONS.RESET_DEFAULT_FOLLOWS: {
      const {data} = action
      return {...state, follows:data}
    }
    case AUTH_ACTIONS.LOGOUT: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

export default feed;
