import produce from "immer";

import {
  ACTIONS,
  publishedContentAdded,
  publishedContentRemoved,
  publicContentAdded
} from "../actions/ContentActions";
import { PublishedContent, PublicContentItem } from "../schema";

const INITIAL_STATE = {
  seedProviderPub:
    "JVz7h3yUnbgMwwKxSddGenBlrE9eeDJVYWlmOr941mI.LW5PEWM3Y-DRf-UApdSN76wH6id6zR4mXNyBApihoAA",
  streamUserToken: "",
  streamLiveToken: "",
  streamUrl: "",
  streamPostId: "",
  streamContentId: "",
  streamStatusUrl: "",
  streamBroadcasterUrl: "",
  publishedContent: {} as Record<string, PublishedContent>,
  publicContent: {} as Record<string, PublicContentItem>,
  unlockedContent: {},
  seedInfo: {} as { seedUrl?: string; seedToken?: string },
  availableTokens: {},
  availableStreamTokens: {}
};

const content = (state = INITIAL_STATE, action): typeof INITIAL_STATE => {
  if (publicContentAdded.match(action)) {
    return produce(state, draft => {
      const { item } = action.payload;
      if (!draft.publicContent[item.id]) {
        draft.publicContent[item.id] = item;
      }
    });
  }
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
        streamStatusUrl: data.streamStatusUrl,
        streamBroadcasterUrl: data.streamBroadcasterUrl
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
        streamStatusUrl: "",
        streamBroadcasterUrl: ""
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
