import { createAction } from "@reduxjs/toolkit";

import Http from "../utils/Http";
import { rifle, unsubscribeRifleByQuery } from "../utils/WebSocket";
import {
  PublishedContent,
  isPublishedContent,
  PublicContentItem,
  isPublicContentItem
} from "../schema";
import { parseJson } from "../utils";
import { openDialog } from "./AppActions";

export const ACTIONS = {
  SET_SEED_PROVIDER_PUB: "content/setSeedProviderPub",
  SET_SEED_INFO: "content/setSeedInfo",

  PUBLISHED_CONTENT_ADDED: "content/publishedContentAdded",
  PUBLISHED_CONTENT_REMOVED: "content/publishedContentRemoved",

  ADD_UNLOCKED_CONTENT: "content/addUnlocked",
  ADD_STREAM: "content/addStream",
  REMOVE_STREAM: "content/removeStream",
  ADD_AVAILABLE_TOKEN: "content/addToken",
  REMOVE_USED_TOKEN: "content/removeToken",
  ADD_STREAM_TOKEN: "content/addStreamToken",
  REMOVE_STREAM_TOKEN: "content/removeStreamToken"
} as const;

export const setSeedProviderPub = (
  pub,
  dontBackup = false
) => async dispatch => {
  if (!dontBackup) {
    let value: string | Record<string, any> = {
      $$__ENCRYPT__FOR: "me",
      value: pub
    };
    if (!pub) {
      value = "";
    }
    await Http.post("/api/gun/put", {
      path: "$user>seedServiceProviderPubKey",
      value
    });
  }
  dispatch({
    type: ACTIONS.SET_SEED_PROVIDER_PUB,
    data: pub
  });
};
export const setSeedInfo = (
  seedUrl: string,
  seedToken: string,
  dontBackup = false
) => async dispatch => {
  const cleanUrl = seedUrl.endsWith("/") ? seedUrl.slice(0, -1) : seedUrl;
  if (!dontBackup) {
    const infoS = JSON.stringify({ seedUrl: cleanUrl, seedToken });
    await Http.post("/api/gun/put", {
      path: "$user>seedServiceSeedData",
      value: {
        $$__ENCRYPT__FOR: "me",
        value: infoS
      }
    });
  }
  dispatch({
    type: ACTIONS.SET_SEED_INFO,
    data: { seedUrl: cleanUrl, seedToken }
  });
};

export const publishedContentAdded = createAction<{
  content: PublishedContent;
  res: { ok: boolean; id: string };
}>(ACTIONS.PUBLISHED_CONTENT_ADDED);

export const addPublishedContent = (
  content: PublishedContent | PublicContentItem,
  type: "public" | "private"
) => async dispatch => {
  if (type === "public") {
    if (!isPublicContentItem(content)) {
      throw new TypeError(
        `Expected content to upload to be a PublicContentItem`
      );
    }

    await Http.post("/api/gun/put", {
      path: `$user>publishedContentPublic>${content.id}`,
      value: content
    });

    // TODO: redux public content

    return content;
  } else {
    const { data } = await Http.post<{ ok: boolean; id: string }>(
      "/api/gun/set",
      {
        path: "$user>publishedContent",
        value: {
          $$__ENCRYPT__FOR: "me",
          value: JSON.stringify(content)
        }
      }
    );
    dispatch(
      publishedContentAdded({
        content,
        res: data
      })
    );
    return data;
  }
};

export const publishedContentRemoved = createAction<{ id: string }>(
  ACTIONS.PUBLISHED_CONTENT_REMOVED
);

export const unlockContent = (amt, owner, postID) => async dispatch => {
  const { data } = await Http.post("/api/lnd/unifiedTrx", {
    type: "contentReveal",
    amt,
    to: owner,
    memo: "",
    feeLimit: 500,
    ackInfo: postID
  });
  const revealRes = JSON.parse(data.orderAck.response);
  if (revealRes && revealRes.unlockedContents) {
    for (const contentID in revealRes.unlockedContents) {
      if (Object.hasOwnProperty.call(revealRes.unlockedContents, contentID)) {
        const content = revealRes.unlockedContents[contentID];
        dispatch({
          type: ACTIONS.ADD_UNLOCKED_CONTENT,
          data: { contentPath: `${owner}>posts>${postID}`, content }
        });
      }
    }
  }
};
export const addStream = (
  {
    seedToken,
    liveToken,
    streamUrl,
    streamPostId,
    streamContentId,
    streamStatusUrl,
    streamBroadcasterUrl
  },
  dontBackup = false
) => async dispatch => {
  if (!dontBackup) {
    await Http.post("/api/gun/put", {
      path: "$user>currentStreamInfo",
      value: {
        $$__ENCRYPT__FOR: "me",
        value: JSON.stringify({
          seedToken,
          liveToken,
          streamUrl,
          streamPostId,
          streamContentId,
          streamStatusUrl,
          streamBroadcasterUrl
        })
      }
    });
  }
  dispatch({
    type: ACTIONS.ADD_STREAM,
    data: {
      seedToken,
      liveToken,
      streamUrl,
      streamPostId,
      streamContentId,
      streamStatusUrl,
      streamBroadcasterUrl
    }
  });
};
export const removeStream = (
  dontBackup = false,
  noDialog = false
) => async dispatch => {
  if (!noDialog) {
    openDialog({
      text: "The recording of the stream will be published in a few moments."
    })(dispatch);
  }
  if (!dontBackup) {
    await Http.post("/api/gun/put", {
      path: "$user>currentStreamInfo",
      value: {
        $$__ENCRYPT__FOR: "me",
        value: "NO DATA"
      }
    });
  }
  dispatch({
    type: ACTIONS.REMOVE_STREAM
  });
};
export const addAvailableToken = (seedUrl, userToken) => dispatch => {
  dispatch({
    type: ACTIONS.ADD_AVAILABLE_TOKEN,
    data: { seedUrl, userToken }
  });
};
export const removeUnavailableToken = (seedUrl, userToken) => dispatch => {
  dispatch({
    type: ACTIONS.REMOVE_USED_TOKEN,
    data: { seedUrl, userToken }
  });
};
export const addStreamToken = (seedUrl, userToken) => dispatch => {
  dispatch({
    type: ACTIONS.ADD_STREAM_TOKEN,
    data: { seedUrl, userToken }
  });
};
export const removeStreamToken = (seedUrl, userToken) => dispatch => {
  dispatch({
    type: ACTIONS.REMOVE_STREAM_TOKEN,
    data: { seedUrl, userToken }
  });
};

const OWN_PUBLISHED_CONTENT_QUERY = "$user::publishedContent::map.on";

export const subOwnPublishedContent = () => async (
  dispatch: (action: any) => void,
  getState: () => { node: { publicKey: string } }
) => {
  console.debug(`Subscribing to own published content`);
  const subscription = await rifle({
    query: OWN_PUBLISHED_CONTENT_QUERY,
    reconnect: true,
    publicKey: getState().node.publicKey,
    onData: async (content: string, key) => {
      try {
        console.debug(`Received own content:`);
        console.debug(content);

        if (typeof key !== "string") {
          throw new TypeError(`Invalid content key received: ${key}`);
        }

        if (!content) {
          dispatch(
            publishedContentRemoved({
              id: key
            })
          );
          return;
        }

        if (typeof content !== "string") {
          throw new TypeError(`Invalid content received (${content})`);
        }

        const parsed = parseJson(content);

        if (!isPublishedContent(parsed)) {
          throw new TypeError(
            `Invalid content received (might be incomplete replication): ${JSON.stringify(
              parsed,
              null,
              2
            )}`
          );
        }

        dispatch(
          publishedContentAdded({
            content: parsed,
            res: {
              id: key,
              ok: true
            }
          })
        );
      } catch (e) {
        console.error(`Error inside own published content sub:`);
        console.error(e);
      }
    }
  });

  return subscription;
};

export const unsubOwnPublishedContent = () => () => {
  console.debug(`Unsubbing own published content.`);
  unsubscribeRifleByQuery(OWN_PUBLISHED_CONTENT_QUERY);
};
