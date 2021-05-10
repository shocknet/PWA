import Http from "../utils/Http";

export const ACTIONS = {
  SET_SEED_PROVIDER_PUB: "content/setSeedProviderPub",
  SET_SEED_INFO: "content/setSeedInfo",
  ADD_PUBLISHED_CONTENT: "content/addPublishedContent",
  ADD_UNLOCKED_CONTENT: "content/addUnlocked",
  ADD_STREAM: "content/addStream",
  REMOVE_STREAM: "content/removeStream",
  ADD_AVAILABLE_TOKEN: "content/addToken",
  REMOVE_USED_TOKEN: "content/removeToken",
  ADD_STREAM_TOKEN: "content/addStreamToken",
  REMOVE_STREAM_TOKEN: "content/removeStreamToken"
};

export const setSeedProviderPub = pub => async dispatch => {
  let value = {
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
  dispatch({
    type: ACTIONS.SET_SEED_PROVIDER_PUB,
    data: pub
  });
};
export const setSeedInfo = (seedUrl, seedToken) => async dispatch => {
  const cleanUrl = seedUrl.endsWith("/") ? seedUrl.slice(0, -1) : seedUrl;
  const infoS = JSON.stringify({ seedUrl: cleanUrl, seedToken });
  await Http.post("/api/gun/put", {
    path: "$user>seedServiceSeedData",
    value: {
      $$__ENCRYPT__FOR: "me",
      value: infoS
    }
  });
  dispatch({
    type: ACTIONS.SET_SEED_INFO,
    data: { seedUrl: cleanUrl, seedToken }
  });
};
export const addPublishedContent = content => async dispatch => {
  let toSet = content;
  if (typeof content !== "string") {
    toSet = JSON.stringify(content);
  }
  const { data } = await Http.post("/api/gun/set", {
    path: "$user>publishedContent",
    value: {
      $$__ENCRYPT__FOR: "me",
      value: toSet
    }
  });
  dispatch({
    type: ACTIONS.ADD_PUBLISHED_CONTENT,
    data: { content, res: data }
  });
  return data;
};

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
export const addStream = ({
  seedToken,
  liveToken,
  streamUrl,
  streamPostId,
  streamContentId,
  streamStatusUrl
}) => dispatch => {
  dispatch({
    type: ACTIONS.ADD_STREAM,
    data: {
      seedToken,
      liveToken,
      streamUrl,
      streamPostId,
      streamContentId,
      streamStatusUrl
    }
  });
};
export const removeStream = () => dispatch => {
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
