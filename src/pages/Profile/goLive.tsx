import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addStream, removeStream } from "../../actions/ContentActions";
import "./css/index.css";
import Loader from "../../common/Loader";
import Http from "../../utils/Http";
import DialogNav from "../../common/DialogNav";
import obsLogo from "../../images/obs-2.svg";
import Stream from "../../common/Post/components/Stream";
import { RequestToken } from "../../utils/seed";
import { useHistory } from "react-router";
import Modal from "../../common/Modal";
import * as Store from "../../store";

const GoLive = () => {
  const dispatch = useDispatch();
  const history = useHistory();
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
  const streamUrl = Store.useSelector(({ content }) => content.streamUrl);
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);
  const [selectedSource, setSelectedSource] = useState("obs");
  const [loading, setLoading] = useState(false);
  const [streamToken, setStreamToken] = useState(streamLiveToken);
  const [, setUserToken] = useState(streamUserToken);
  const [paragraph, setParagraph] = useState("Look I'm streaming!");
  const [isLive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rtmpUri, setRtmpUri] = useState("");
  const [promptInfo, setPromptInfo] = useState(null);
  const onSubmitCb = useCallback(
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
        setRtmpUri(`${rtmp}/live`);
        addStream(latestUserToken, liveToken, streamPlaybackUrl)(dispatch);
        let contentItems = [];
        if (paragraph !== "") {
          contentItems.push({
            type: "text/paragraph",
            text: paragraph
          });
        }
        contentItems.push({
          type: "stream/embedded",
          width: 0,
          height: 0,
          magnetURI: streamPlaybackUrl,
          isPreview: false,
          isPrivate: false,
          userToken: latestUserToken
        });
        const res = await Http.post(`/api/gun/wall`, {
          tags: [],
          title: "Post",
          contentItems
        });
        if (res.status === 200) {
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
    [availableTokens, seedProviderPub, seedToken, seedUrl, dispatch, paragraph]
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
        serviceID = userProfiles[seedProviderPub].SeedServiceProvided;
      }
      if (availableToken || (seedUrl && seedToken)) {
        onSubmitCb();
      } else if (serviceID && seedProviderPub) {
        const { data: service } = await Http.get(
          `/api/gun/otheruser/${seedProviderPub}/load/offeredServices>${serviceID}`
        );
        const { servicePrice } = service.data;
        console.log(service);
        setPromptInfo({ servicePrice, serviceID });
      } else {
        setError("No way found to publish content");
      }
    },
    [
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
  }, [streamToken]);
  const copyUri = useCallback(() => {
    navigator.clipboard.writeText(rtmpUri);
  }, [rtmpUri]);
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
  const stopStream = useCallback(() => {
    removeStream()(dispatch);
    history.push("/profile");
  }, [dispatch, history]);

  const StreamRender = useMemo(() => {
    return (
      <Stream
        hideRibbon={true}
        item={{ magnetURI: streamUrl }}
        timeout={1500}
        id={undefined}
        index={undefined}
        postId={undefined}
        tipCounter={undefined}
        tipValue={undefined}
        width={undefined}
      />
    );
  }, [streamUrl]);
  return (
    <div className="h-100 m-1">
      {loading ? <Loader overlay fullScreen text="Creating stream..." /> : null}
      <DialogNav drawerVisible={false} pageTitle="GO LIVE" />

      {isLive && <div>{StreamRender}</div>}
      <select
        value={selectedSource}
        onChange={onInputChange}
        name="source"
        id="source"
        style={{
          backgroundColor: "rgba(0,0,0,0)",
          color: "white",
          width: "100%",
          border: "0",
          marginBottom: "1em"
        }}
      >
        <option
          value="camera"
          style={{
            backgroundColor: "rgba(0,0,0,0)",
            color: "var(--main-blue)"
          }}
        >
          Camera
        </option>
        <option
          value="obs"
          style={{
            backgroundColor: "rgba(0,0,0,0)",
            color: "var(--main-blue)"
          }}
        >
          OBS
        </option>
      </select>
      <div className="flex-center m-b-1">
        {selectedSource === "obs" && (
          <img src={obsLogo} style={{ width: "10em", height: "10em" }} alt="" />
        )}
        {selectedSource === "camera" && (
          <i className="fas fa-camera" style={{ fontSize: "10em" }}></i>
        )}
      </div>
      {streamToken ? (
        <div>
          {selectedSource === "obs" && (
            <p className="m-b-1">
              You are ready to go! setup the stream with OBS and watch it from
              your profile
            </p>
          )}
          <p>Broadcaster:</p>
          <div
            style={{
              border: "1px solid var(--main-blue)",
              padding: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem"
            }}
          >
            <p>
              {rtmpUri.substring(0, 20) + (rtmpUri.length > 21 ? "..." : "")}
            </p>
            <i className="far fa-copy" onClick={copyUri}></i>
          </div>
          <p>Stream Key:</p>
          <div
            style={{
              border: "1px solid var(--main-blue)",
              padding: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem"
            }}
          >
            <p>
              {streamToken.substring(0, 20) +
                (streamToken.length > 21 ? "..." : "")}
            </p>
            <i className="far fa-copy" onClick={copyToken}></i>
          </div>
          <div className="flex-center">
            <button onClick={stopStream} className="shock-form-button-confirm">
              STOP
            </button>
          </div>
        </div>
      ) : (
        <div className="vertical-flex-center">
          <input
            className="input-field"
            type="text"
            name="paragraph"
            id="paragraph"
            value={paragraph}
            onChange={onInputChange}
          />
          <button onClick={onSubmit} className="shock-form-button-confirm">
            START NOW
          </button>
        </div>
      )}
      {error ? <p className="error-container">{error}</p> : null}
      {promptInfo && (
        <Modal modalOpen={promptInfo && !loading} toggleModal={closePrompt}>
          <div style={{ padding: "1rem" }}>
            <p>
              The service from the default service provider will cost:{" "}
              <strong>{promptInfo.servicePrice} sats</strong>
            </p>

            <button className="shock-form-button m-1" onClick={closePrompt}>
              cancel
            </button>
            <button
              className="shock-form-button-confirm m-1"
              onClick={submitPrompt}
            >
              confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GoLive;
