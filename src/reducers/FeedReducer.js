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
      const authorId = data.authorId;
      const userPosts = state.posts[authorId] ?? [];
      const existingPost = userPosts.find(post => data.id === post.id);

      if (existingPost) {
        return state;
      }

      return {
        ...state,
        posts: {
          ...state.posts,
          [authorId]: [...userPosts, data]
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
    default:
      return state;
  }
};

export default feed;
