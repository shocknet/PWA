import * as Common from "shock-common";
import produce from "immer";

import { ACTIONS, updatedUserProfile } from "../actions/UserProfilesActions";
import { ACTIONS as NODE_ACTIONS } from "../actions/NodeActions";
import { sharedPostReceived } from "../actions/FeedActions";

import anon from "./anon.jpg";
import rothbard from "./rothbard.jpg";
import mencken from "./mencken.jpg";
import smith from "./smith.jpg";
import lightningPage from "./lightningPage.jpg";
import mises from "./mises.jpg";

/**
 * @typedef {Record<string, Common.User>} UserProfilesState
 */

/**
 * @type {UserProfilesState}
 */
const INITIAL_STATE = {
  anon: {
    ...Common.createEmptyUser("anon"),
    avatar: anon
  },
  rothbard: {
    ...Common.createEmptyUser("rothbard"),
    avatar: rothbard,
    displayName: `Murray Roth`
  },
  mencken: {
    ...Common.createEmptyUser("mencken"),
    avatar: mencken,
    displayName: "HL Mencken"
  },
  smith: {
    ...Common.createEmptyUser("smith"),
    avatar: smith,
    displayName: "Adam Smith"
  },
  lightningPage: {
    ...Common.createEmptyUser("lightningPage"),
    avatar: lightningPage,
    displayName: "Lightning.Page"
  },
  mises: {
    ...Common.createEmptyUser("mises"),
    avatar: mises,
    displayName: "Ludwig von Mises"
  }
};

/**
 * @param {UserProfilesState} state
 * @param {import('redux').AnyAction} action
 * @returns {UserProfilesState}
 */
const userProfiles = (state = INITIAL_STATE, action) => {
  if (sharedPostReceived.match(action)) {
    const { originalAuthor } = action.payload;
    return produce(state, draft => {
      if (!draft[originalAuthor]) {
        draft[originalAuthor] = Common.createEmptyUser(originalAuthor);
      }
    });
  }
  if (updatedUserProfile.match(action)) {
    return produce(state, draft => {
      const { profile, publicKey } = action.payload;

      if (!draft[publicKey]) {
        draft[publicKey] = Common.createEmptyUser(publicKey);
      }

      Object.assign(draft[publicKey], profile);
    });
  }

  switch (action.type) {
    case NODE_ACTIONS.SET_AUTHENTICATED_USER: {
      const { publicKey } = action.data;
      return {
        ...state,
        [publicKey]: {
          ...Common.createEmptyUser(publicKey),
          ...state[publicKey]
        }
      };
    }
    case ACTIONS.RESET_USER_PROFILES: {
      return INITIAL_STATE;
    }

    case ACTIONS.REMOVE_USER_PROFILE: {
      const { publicKey } = action.data;
      // Deletes the user profile property without mutating the state object
      const { [publicKey]: deletedProfile, ...profiles } = state;

      return profiles;
    }

    default:
      return state;
  }
};

export default userProfiles;
