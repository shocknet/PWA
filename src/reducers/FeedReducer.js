import { ACTIONS } from "../actions/FeedActions";

const INITIAL_STATE = {
  follows: [],
  posts: {}
};

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
        return state;
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
      const userPosts = state.posts[data.author] ?? [];
      const existingPost = userPosts.find(post => data.id === post.id);

      if (existingPost) {
        return state;
      }

      return {
        ...state,
        posts: {
          ...state.posts,
          [data.author]: [...userPosts, data]
        }
      };
    }
    case ACTIONS.DELETE_USER_POST: {
      const { id, author } = action.data;
      const userPosts = (state.posts[author] ?? []).filter(
        post => post.id !== id
      );

      return {
        ...state,
        posts: {
          ...state.posts,
          [author]: userPosts
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
      const { id, author } = data;
      const userPosts = state.posts[author] ?? [];
      const updatedPosts = userPosts.map(post => {
        if (post.id === id && post.type === "shared") {
          return {
            ...post,
            originalPost: data
          };
        }

        return post;
      });

      return updatedPosts;
    }
    default:
      return state;
  }
};

export default feed;
