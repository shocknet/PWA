import React, { memo, useCallback, useState } from "react";
import * as Common from "shock-common";
import { useDispatch } from "react-redux";
import c from "classnames";

import "../css/index.scoped.css";
import { addStream, removeStream } from "../../../actions/ContentActions";
import Loader from "../../../common/Loader";
import Http from "../../../utils/Http";
import obsLogo from "../../../images/obs-2.svg";
import { RequestToken } from "../../../utils/seed";
import { useHistory } from "react-router";
import Modal from "../../../common/Modal";
import * as Store from "../../../store";
import DarkPage from "../../../common/DarkPage";
import * as gStyles from "../../../styles";
import Line from "../../../common/Line";
import Pad from "../../../common/Pad";

import styles from "./css/GoLive.module.css";
import InputGroup from "../../../common/InputGroup";

const GoLive = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const nodeIP = Store.useSelector(({ node }) => node.hostIP);
  const relayId = Store.useSelector(({ node }) => node.relayId);
  const seedProviderPub = Store.useSelector(
    ({ content }) => content.seedProviderPub
  );
  const { seedUrl, seedToken } = Store.useSelector(
    ({ content }) => content.seedInfo
  );
  const streamLiveToken = Store.useSelector(
    ({ content }) => content.streamLiveToken
  );
  const streamUserToken = Store.useSelector(
    ({ content }) => content.streamUserToken
  );
  const availableTokens = Store.useSelector(
    ({ content }) => content.availableTokens
  );
  const streamBroadcasterUrl = Store.useSelector(
    ({ content }) => content.streamBroadcasterUrl
  );
  const streamContentId = Store.useSelector(
    ({ content }) => content.streamContentId
  );
  const tipOverlayUrl = Store.useSelector(
    ({ content }) => content.tipOverlayUrl
  );
  const streamPostId = Store.useSelector(({ content }) => content.streamPostId);
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);
  const [selectedSource, setSelectedSource] = useState<"camera" | "obs">("obs");
  const [loading, setLoading] = useState(false);
  const [streamToken, setStreamToken] = useState(streamLiveToken);
  const [, setUserToken] = useState(streamUserToken);
  const [paragraph, setParagraph] = useState("Look I'm streaming!");

  const [error, setError] = useState<string | null>(null);
  const [promptInfo, setPromptInfo] = useState(null);
  const [starting, setStarting] = useState(false);

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedOverlayUrl, setCopiedOverlayUrl] = useState(false);
  const [enableTipsOverlay, setEnableTipsOverlay] = useState(true);
  const onSubmitCb = React.useCallback(
    async (servicePrice?, serviceID?) => {
      try {
        setLoading(true);
        const { seedUrl: finalSeedUrl, tokens } = await RequestToken({
          availableTokens,
          seedProviderPub,
          seedToken,
          seedUrl,
          serviceID,
          servicePrice
        });
        const [latestUserToken] = tokens;
        setUserToken(latestUserToken);
        const { data: streamData } = await Http.post(
          `${finalSeedUrl}/api/stream/auth`,
          {
            token: latestUserToken
          }
        );
        const { token: obsToken } = streamData.data;
        console.log(obsToken);
        const liveToken = `${latestUserToken}?key=${obsToken}`;
        setStreamToken(`${latestUserToken}?key=${obsToken}`);
        const streamPlaybackUrl = `${finalSeedUrl}/rtmpapi/live/${latestUserToken}/index.m3u8`;
        const rtmp = finalSeedUrl.replace("https", "rtmp");
        const rtmpUrl = `${rtmp}/live`;
        const stUrl = `${finalSeedUrl}/rtmpapi/api/streams/live/${latestUserToken}`;
        const viewersSocketUrl = `${finalSeedUrl.replace(
          "https",
          "wss"
        )}/websocket`;
        let contentItems = [];
        if (paragraph !== "") {
          contentItems.push({
            type: "text/paragraph",
            text: paragraph
          });
        }

        const streamContent: Common.EmbeddedStream = {
          height: 0,
          isPreview: false,
          isPrivate: false,
          liveStatus: "waiting",
          magnetURI: streamPlaybackUrl,
          playbackMagnet: "",
          statusUrl: stUrl,
          type: "stream/embedded",
          userToken: latestUserToken,
          viewersCounter: 0,
          // @ts-expect-error
          viewersSocketUrl,
          width: 0
        };

        contentItems.push(streamContent);

        const res = await Http.post(`/api/gun/wall`, {
          tags: [],
          title: "Post",
          contentItems,
          enableTipsOverlay
        });
        if (res.status === 200) {
          const { data } = res;

          const [postId, newPost, overlayAccessId] = data as [
            string,
            Common.RawPost,
            string
          ];
          let tipsNotificationsOverlayUrl = "";
          if (overlayAccessId) {
            const relayIdParam = relayId
              ? `&x-shock-hybrid-relay-id-x=${relayId}`
              : "";
            tipsNotificationsOverlayUrl = `${nodeIP}/api/subscribeStream?accessId=${overlayAccessId}${relayIdParam}`;
          }
          console.log(newPost.contentItems);

          const [contentId] = Object.entries(newPost.contentItems ?? {}).find(
            ([_, item]) =>
              item.type === "stream/embedded" &&
              item.magnetURI === streamPlaybackUrl
          );
          addStream({
            seedToken: latestUserToken,
            liveToken,
            streamUrl: streamPlaybackUrl,
            streamPostId: postId,
            streamContentId: contentId,
            streamStatusUrl: stUrl,
            streamBroadcasterUrl: rtmpUrl,
            tipOverlayUrl: tipsNotificationsOverlayUrl
          })(dispatch);
          await Http.post(`/api/listenStream`, {
            postId,
            contentId,
            statusUrl: `${finalSeedUrl}/rtmpapi/api/streams/live/${latestUserToken}`
          });
          console.log("post created successfully");
          setLoading(false);
        } else {
          setError("invalid response status");
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setError(err?.errorMessage ?? err?.message);
        setLoading(false);
      }
    },
    [
      availableTokens,
      seedProviderPub,
      seedToken,
      seedUrl,
      enableTipsOverlay,
      dispatch,
      paragraph,
      nodeIP,
      relayId
    ]
  );
  const closePrompt = useCallback(() => {
    setPromptInfo(null);
  }, [setPromptInfo]);

  const submitPrompt = useCallback(() => {
    const { servicePrice, serviceID } = promptInfo;
    onSubmitCb(servicePrice, serviceID);
    setPromptInfo(null);
  }, [promptInfo, onSubmitCb, setPromptInfo]);

  const onSubmit = useCallback(
    async e => {
      try {
        if (starting) {
          return;
        }
        setStarting(true);
        e.preventDefault();
        let availableToken = false;
        for (const key in availableTokens) {
          if (Object.prototype.hasOwnProperty.call(availableTokens, key)) {
            const element = availableTokens[key];
            if (element[0]) {
              availableToken = true;
              break;
            }
          }
        }
        let serviceID = "";
        if (userProfiles[seedProviderPub]) {
          //@ts-expect-error
          serviceID = userProfiles[seedProviderPub].offerSeedService;
        }
        if (availableToken || (seedUrl && seedToken)) {
          onSubmitCb();
        } else if (serviceID && seedProviderPub) {
          const { data: servicePrice } = await Http.get(
            `/api/gun/otheruser/${seedProviderPub}/once/offeredServices>${serviceID}>servicePrice`
          );
          setPromptInfo({ servicePrice, serviceID });
        } else {
          setError("No way found to publish content");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setStarting(false);
      }
    },
    [
      starting,
      userProfiles,
      seedProviderPub,
      seedUrl,
      seedToken,
      availableTokens,
      onSubmitCb
    ]
  );
  const copyToken = useCallback(() => {
    navigator.clipboard.writeText(streamToken);
    setCopiedToken(true);
  }, [streamToken, setCopiedToken]);

  const copyOverlayUrl = useCallback(() => {
    navigator.clipboard.writeText(tipOverlayUrl);
    setCopiedOverlayUrl(true);
  }, [tipOverlayUrl, setCopiedOverlayUrl]);

  const copyUri = useCallback(() => {
    navigator.clipboard.writeText(streamBroadcasterUrl);
    setCopiedUrl(true);
  }, [streamBroadcasterUrl, setCopiedUrl]);

  const onInputChange = useCallback(
    e => {
      const { value, name } = e.target;
      switch (name) {
        case "paragraph": {
          setParagraph(value);
          return;
        }
        case "source": {
          setSelectedSource(value);
          return;
        }
        default:
          return;
      }
    },
    [setParagraph, setSelectedSource]
  );

  const onTipsOverlayChange = useCallback(
    (e: { target: { checked: boolean } }) => {
      setEnableTipsOverlay(e.target.checked);
    },
    []
  );

  const stopStream = useCallback(() => {
    Http.post("/api/stopStream", {
      postId: streamPostId,
      contentId: streamContentId,
      endUrl: `https://stream.shock.network/api/stream/end`,
      urlForMagnet: `https://stream.shock.network/api/stream/torrent/${streamUserToken}`,
      obsToken: streamLiveToken
    });
    removeStream()(dispatch);
    console.info(streamUserToken);
    history.push("/profile");
  }, [
    dispatch,
    history,
    streamContentId,
    streamLiveToken,
    streamPostId,
    streamUserToken
  ]);
  const btnClass = c(
    gStyles.col,
    gStyles.centerJustify,
    gStyles.centerAlign,
    styles["stream-type-btn"]
  );

  return (
    <>
      <DarkPage pageTitle="GO LIVE" scrolls>
        {/*hide for now since it's not implemented and causes a duplication*/}
        {/*!isLive && selectedSource === "camera" ? <CamFeed /> : <Static /> */}

        <div className={c(gStyles.rowCentered, gStyles.width100)}>
          <div
            className={btnClass}
            onClick={setSelectedSource.bind(null, "camera")}
          >
            <i
              className={c(styles["stream-type-btn-icon"], "fas", "fa-camera")}
            ></i>

            <Pad amt={16} />
            <Line
              color={selectedSource === "camera" ? "#4285b9" : "white"}
              length={36}
              type="horizontal"
              width={2}
            />
          </div>

          <div
            className={btnClass}
            onClick={setSelectedSource.bind(null, "obs")}
          >
            <img alt="" className={styles["obs-logo"]} src={obsLogo} />

            <Pad amt={16} />
            <Line
              color={selectedSource === "obs" ? "#4285b9" : "white"}
              length={36}
              type="horizontal"
              width={2}
            />
          </div>
        </div>

        <div className={gStyles.commonPaddingH}>
          {(() => {
            if (error) {
              return (
                <>
                  <p> An error ocurred: </p>

                  <br />

                  <p className="error-container">{error}</p>

                  <button
                    className="shock-form-button"
                    onClick={setError.bind(null, null)}
                  >
                    Dismiss
                  </button>
                </>
              );
            }

            if (streamToken) {
              return (
                <>
                  {selectedSource === "obs" && (
                    <p className="m-b-1">
                      You are ready to go! setup the stream with OBS and watch
                      it from your profile
                    </p>
                  )}

                  <p>Broadcaster:</p>

                  <div className="d-flex flex-align-center">
                    {/*@ts-expect-error*/}
                    <InputGroup
                      name="Streamer Url"
                      value={streamBroadcasterUrl}
                      disabled
                    />
                    <i
                      className={
                        !copiedUrl
                          ? "far fa-copy fa-lg m-1"
                          : "fas fa-check fa-lg m-1"
                      }
                      onClick={copyUri}
                    ></i>
                  </div>
                  <p>Stream Key:</p>

                  <div className="d-flex flex-align-center">
                    {/*@ts-expect-error*/}
                    <InputGroup
                      name="Stream Key"
                      value={streamToken}
                      disabled
                    />
                    <i
                      className={
                        !copiedToken
                          ? "far fa-copy fa-lg m-1"
                          : "fas fa-check fa-lg m-1"
                      }
                      onClick={copyToken}
                    ></i>
                  </div>
                  {tipOverlayUrl && <p>Tips notifications overlay Url:</p>}
                  {tipOverlayUrl && (
                    <div className="d-flex flex-align-center">
                      {/*@ts-expect-error*/}
                      <InputGroup
                        name="Overlay Url"
                        value={tipOverlayUrl}
                        disabled
                      />
                      <i
                        className={
                          !copiedOverlayUrl
                            ? "far fa-copy fa-lg m-1"
                            : "fas fa-check fa-lg m-1"
                        }
                        onClick={copyOverlayUrl}
                      ></i>
                    </div>
                  )}
                  <div className="flex-center">
                    <button
                      onClick={stopStream}
                      className="shock-form-button-confirm"
                    >
                      STOP
                    </button>
                  </div>
                </>
              );
            }

            return (
              <>
                <input
                  className="input-field"
                  type="text"
                  name="paragraph"
                  id="paragraph"
                  value={paragraph}
                  onChange={onInputChange}
                />
                <label htmlFor="enable-tips-notifications">
                  Enable Tips notifications overlay{" "}
                </label>
                <input
                  type="checkbox"
                  name="enable-tips-notifications"
                  id="enable-tips-notifications"
                  checked={enableTipsOverlay}
                  onChange={onTipsOverlayChange}
                />
                <button
                  onClick={onSubmit}
                  className={c(gStyles.width100, "shock-form-button-confirm")}
                  disabled={selectedSource === "camera" || starting}
                >
                  {starting ? "..." : "START NOW"}
                </button>
              </>
            );
          })()}
        </div>
      </DarkPage>

      {promptInfo && (
        <Modal
          modalOpen={promptInfo && !loading}
          toggleModal={closePrompt}
          contentClass="p-1"
          blueBtn="Confirm"
          onClickBlueBtn={submitPrompt}
          forceRenderTitleBar
          noFullWidth
        >
          <p className="text-center">
            The service from the default service provider will cost:{" "}
            <strong>{promptInfo.servicePrice} sats</strong>
          </p>
        </Modal>
      )}

      {loading ? <Loader overlay fullScreen text="Creating stream..." /> : null}
    </>
  );
};

export default memo(GoLive);
