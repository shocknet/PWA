// @ts-check
/**
 * @typedef {import('shock-common').Follow} Follow
 */

import { ACTIONS } from "../actions/FeedActions";
import { ACTIONS as AUTH_ACTIONS } from "../actions/AuthActions";
/**
 * @typedef {import('../schema').Post} Post
 * @typedef {import('../schema').SharedPost} SharedPost
 */

const INITIAL_STATE = {
  follows: /** @type {Follow[]} */ ([
    {
      user:
        "JVz7h3yUnbgMwwKxSddGenBlrE9eeDJVYWlmOr941mI.LW5PEWM3Y-DRf-UApdSN76wH6id6zR4mXNyBApihoAA",
      status: "ok",
      private: false
    }
  ]),
  /**
   * Maps public key to posts/shared posts.
   */
  posts: /** @type {Record<string, Array<Post|SharedPost>>} */ ({}),
  reloadDone: false
};

/**
 * @returns {typeof INITIAL_STATE}
 */
const feed = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.RESET_FOLLOWS: {
      return INITIAL_STATE;
    }
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
    case ACTIONS.ADD_USER_POST: {
      const { data } = action;
      /** @type {SharedPost} */
      const receivedPost = data;
      const authorId = receivedPost.authorId;
      const userPosts = state.posts[authorId] ?? [];
      const existingPostIndex = userPosts.findIndex(
        post => receivedPost.id === post.id
      );

      const tmp = [...userPosts];

      if (existingPostIndex !== -1) {
        tmp[existingPostIndex] = receivedPost;
      } else {
        tmp.push(receivedPost);
      }
      return {
        ...state,
        posts: {
          ...state.posts,
          [authorId]: tmp
        }
      };
    }
    case ACTIONS.DELETE_USER_POST: {
      const { id, authorId } = action.data;
      const userPosts = (state.posts[authorId] ?? []).filter(
        post => post.id !== id
      );

      return {
        ...state,
        posts: {
          ...state.posts,
          [authorId]: userPosts
        }
      };
    }
    case ACTIONS.LOAD_POSTS: {
      const { data } = action;

      return {
        ...state,
        posts: data
      };
    }
    case ACTIONS.LOAD_SHARED_POST: {
      const { data } = action;
      const { id, sharerId } = data;
      const userPosts = state.posts[sharerId] ?? [];
      const updatedPosts = userPosts.map(post => {
        if (post.id === id && post.type === "shared") {
          return {
            ...post,
            originalPost: data
          };
        }

        return post;
      });

      return {
        ...state,
        posts: {
          ...state.posts,
          [sharerId]: updatedPosts
        }
      };
    }
    case ACTIONS.RELOAD_FEED: {
      return { ...state, reloadDone: true };
    }
    case AUTH_ACTIONS.LOGOUT: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

export default feed;
