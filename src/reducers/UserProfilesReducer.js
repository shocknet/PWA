import * as Common from "shock-common";

import { ACTIONS } from "../actions/UserProfilesActions";
import { ACTIONS as NODE_ACTIONS } from "../actions/NodeActions";

/**
 * @typedef {Record<string, Common.User>} UserProfilesState
 */

/**
 * @type {UserProfilesState}
 */
const INITIAL_STATE = {};

/**
 * @param {UserProfilesState} state
 * @param {import('redux').AnyAction} action
 * @returns {UserProfilesState}
 */
const userProfiles = (state = INITIAL_STATE, action) => {
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
    case ACTIONS.LOAD_USER_PROFILE: {
      const { publicKey, profile } = action.data;

      if (!publicKey || !profile) {
        return state;
      }

      return {
        ...state,
        [publicKey]: {
          ...Common.createEmptyUser(publicKey),
          ...state[publicKey],
          ...profile
        }
      };
    }
    case ACTIONS.REMOVE_USER_PROFILE: {
      const { publicKey } = action.data;
      // Deletes the user profile property without mutating the state object
      const { [publicKey]: deletedProfile, ...profiles } = state;

      return profiles;
    }
    case ACTIONS.UPDATE_USER_PROFILE: {
      const { publicKey, profile: newProfile } = action.data;
      const oldProfile = state[publicKey];

      console.log("Updating User Profile:", publicKey, newProfile);
      if (!oldProfile || !newProfile) {
        return state;
      }

      return {
        ...state,
        [publicKey]: {
          ...Common.createEmptyUser(publicKey),
          ...oldProfile,
          ...newProfile
        }
      };
    }
    default:
      return state;
  }
};

export default userProfiles;
