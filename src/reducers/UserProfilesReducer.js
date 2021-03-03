import { ACTIONS } from "../actions/UserProfilesActions";

const INITIAL_STATE = {};

const userProfiles = (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
        [publicKey]: profile
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
