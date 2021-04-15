import * as Common from "shock-common";
import produce from "immer";

import { ACTIONS } from "../actions/UserProfilesActions";
import { ACTIONS as NODE_ACTIONS } from "../actions/NodeActions";
import { ACTIONS as CHAT_ACTIONS } from "../actions/ChatActions";
/**
 * @typedef {import('../actions/ChatActions').LoadChatDataAction} LoadChatDataAction
 * @typedef {import("../actions/ChatActions").LoadSentRequestsAction} LoadSentRequestsAction
 * @typedef {import('../actions/ChatActions').LoadReceivedRequestsAction} LoadReceivedRequestsAction
 * @typedef {import('../actions/ChatActions').SentRequestAction} SentRequestAction
 */

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
    case CHAT_ACTIONS.LOAD_CHAT_DATA: {
      return produce(state, draft => {
        const { data } = /** @type {LoadChatDataAction} */ (action);

        data.contacts.forEach(c => {
          draft[c.pk] = {
            ...Common.createEmptyUser(c.pk),
            ...draft[c.pk]
          };
        });
      });
    }
    case CHAT_ACTIONS.LOAD_RECEIVED_REQUESTS: {
      return produce(state, draft => {
        const { data } = /** @type {LoadReceivedRequestsAction} */ (action);

        data.forEach(req => {
          draft[req.pk] = {
            ...Common.createEmptyUser(req.pk),
            ...draft[req.pk]
          };
        });
      });
    }
    case CHAT_ACTIONS.LOAD_SENT_REQUESTS: {
      return produce(state, draft => {
        const { data } = /** @type {LoadSentRequestsAction} */ (action);

        data.forEach(req => {
          draft[req.pk] = {
            ...Common.createEmptyUser(req.pk),
            ...draft[req.pk]
          };
        });
      });
    }
    case CHAT_ACTIONS.SENT_REQUEST: {
      return produce(state, draft => {
        const { data: pk } = /** @type {SentRequestAction} */ (action);

        if (!draft[pk]) {
          draft[pk] = Common.createEmptyUser(pk);
        }
      });
    }
    default:
      return state;
  }
};

export default userProfiles;
