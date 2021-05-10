import produce from "immer";

import {
  ACTIONS,
  publishedContentAdded,
  publishedContentRemoved
} from "../actions/ContentActions";
import { PublishedContent } from "../schema";

const INITIAL_STATE = {
  seedProviderPub:
    "qsgziGQS99sPUxV1CRwwRckn9cG6cJ3prbDsrbL7qko.oRbCaVKwJFQURWrS1pFhkfAzrkEvkQgBRIUz9uoWtrg",
  streamUserToken: "",
  streamLiveToken: "",
  streamUrl: "",
  streamPostId: "",
  streamContentId: "",
  streamStatusUrl: "",
  publishedContent: {} as Record<string, PublishedContent>,
  unlockedContent: {},
  seedInfo: {},
  availableTokens: {},
  availableStreamTokens: {}
};

const content = (state = INITIAL_STATE, action) => {
  if (publishedContentAdded.match(action)) {
    return produce(state, draft => {
      const {
        payload: { content, res }
      } = action;
      if (res.ok) {
        draft.publishedContent[res.id] = content;
      }
    });
  }

  if (publishedContentRemoved.match(action)) {
    return produce(state, draft => {
      delete draft.publishedContent[action.payload.id];
    });
  }

  switch (action.type) {
    case ACTIONS.SET_SEED_PROVIDER_PUB: {
      return { ...state, seedProviderPub: action.data };
    }

    case ACTIONS.ADD_UNLOCKED_CONTENT: {
      const { data } = action;
      const unlockedTmp = { ...state.unlockedContent };
      unlockedTmp[data.contentPath] = data.content;
      return { ...state, unlockedContent: unlockedTmp };
    }
    case ACTIONS.ADD_STREAM: {
      const { data } = action;
      return {
        ...state,
        streamLiveToken: data.liveToken,
        streamUserToken: data.seedToken,
        streamUrl: data.streamUrl,
        streamPostId: data.streamPostId,
        streamContentId: data.streamContentId,
        streamStatusUrl: data.streamStatusUrl
      };
    }
    case ACTIONS.REMOVE_STREAM: {
      return {
        ...state,
        streamLiveToken: "",
        streamUserToken: "",
        streamUrl: "",
        streamPostId: "",
        streamContentId: "",
        streamStatusUrl: ""
      };
    }
    case ACTIONS.SET_SEED_INFO: {
      const { data } = action;
      return { ...state, seedInfo: data };
    }
    case ACTIONS.ADD_AVAILABLE_TOKEN: {
      const { data } = action;
      const { seedUrl, userToken } = data;
      const availableTmp = { ...state.availableTokens };
      if (!availableTmp[seedUrl]) {
        availableTmp[seedUrl] = [];
      }
      availableTmp[seedUrl].push(userToken);
      return { ...state, availableTokens: availableTmp };
    }
    case ACTIONS.REMOVE_USED_TOKEN: {
      const { data } = action;
      const { seedUrl, userToken } = data;
      const availableTmp = { ...state.availableTokens };
      if (!availableTmp[seedUrl]) {
        return state;
      }
      const index = availableTmp[seedUrl].indexOf(userToken);
      if (index > -1) {
        availableTmp[seedUrl].splice(index, 1);
        return { ...state, availableTokens: availableTmp };
      }
      return state;
    }
    case ACTIONS.ADD_STREAM_TOKEN: {
      const { data } = action;
      const { seedUrl, userToken } = data;
      const availableTmp = { ...state.availableStreamTokens };
      if (!availableTmp[seedUrl]) {
        availableTmp[seedUrl] = [];
      }
      availableTmp[seedUrl].push(userToken);
      return { ...state, availableStreamTokens: availableTmp };
    }
    case ACTIONS.REMOVE_STREAM_TOKEN: {
      const { data } = action;
      const { seedUrl, userToken } = data;
      const availableTmp = { ...state.availableStreamTokens };
      if (!availableTmp[seedUrl]) {
        return state;
      }
      const index = availableTmp[seedUrl].indexOf(userToken);
      if (index > -1) {
        availableTmp[seedUrl].splice(index, 1);
        return { ...state, availableStreamTokens: availableTmp };
      }
      return state;
    }
    default:
      return state;
  }
};

export default content;
