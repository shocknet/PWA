import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import c from "classnames";
import { v1 as uuid } from "uuid";

import "./css/index.scoped.css";

import Loader from "../../common/Loader";
import Http from "../../utils/Http";
import {
  addPublishedContent,
  removeUnavailableToken
} from "../../actions/ContentActions";
import { RequestToken } from "../../utils/seed";
import { useHistory } from "react-router";
import * as Store from "../../store";
import Modal from "../../common/Modal";
import DarkPage from "../../common/DarkPage";
import UploadThumbnail from "./components/UploadThumbnail";
import * as gStyles from "../../styles";
import * as Schema from "../../schema";
import { base64toBlob } from "../../utils/Media";

const PublishContentPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const seedProviderPub = Store.useSelector(
    ({ content }) => content.seedProviderPub
  );
  const { seedUrl, seedToken } = Store.useSelector(
    ({ content }) => content.seedInfo
  );
  const availableTokens = Store.useSelector(
    ({ content }) => content.availableTokens
  );
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [title, setTitle] = useState("");
  const [thumbnailOpen, setThumbnailOpen] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const [thumbnailTarget, setThumbnailTarget] = useState(null);
  const [titleMissing, setTitleMissing] = useState(false);
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState<"public" | "private">("public");
  const imageFile = useRef(null);
  const videoFile = useRef(null);
  const [promptInfo, setPromptInfo] = useState(null);
  const selfPublicKey = Store.useSelector(Store.selectSelfPublicKey);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const onSubmitCb = useCallback(
    async (servicePrice?, serviceID?) => {
      console.log([title, description, mediaPreviews, videoThumbnails]);
      if (!title) {
        setError("Please input a title");
        setTitleMissing(true);
        return;
      }
      if (selectedFiles.length === 0) {
        setError("No selected files");
        return;
      }
      setLoading(true);
      let res: Response | null = null;
      try {
        const {
          seedUrl: finalSeedUrl,
          tokens,
          deleteToken
        } = await RequestToken({
          availableTokens,
          seedProviderPub,
          seedToken,
          seedUrl,
          serviceID,
          servicePrice
        });
        const formData = new FormData();
        //TODO support public/private content by requesting two tokens and doing this req twice
        await Promise.all(
          mediaPreviews.map(async preview => {
            const extension = preview.file.type.replace(`${preview.type}/`, "");
            const fileName = `${preview.type}-${preview.index}`;

            if (preview.type === "video") {
              const thumbnail = videoThumbnails[fileName];

              formData.append(
                "files",
                preview.file,
                `${fileName}.${extension}`
              );

              if (thumbnail && thumbnail.type) {
                // extract extension from base64
                const extension = thumbnail.type?.replace(/.*\//gi, "");

                formData.append(
                  "files",
                  thumbnail,
                  `${fileName}-thumb.${extension}`
                );
              }

              return;
            }

            formData.append("files", preview.file);
          })
        );
        formData.append("info", "extraInfo");
        formData.append("comment", "comment");
        console.log("Form Data:", formData);
        res = await fetch(`${finalSeedUrl}/api/put_file`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens[0]}`
          },
          body: formData
        });
        const resJson = await res.json();
        console.log(resJson);
        if (resJson.error && resJson.error.message) {
          const err = resJson.error.message;
          if (err === "The provided token has already been used") {
            setError("An error occurred, please try again");
            removeUnavailableToken(finalSeedUrl, tokens[0])(dispatch);
          } else {
            setError(err);
          }
          setLoading(false);
          return;
        }
        const { torrent } = resJson.data;
        const { magnet } = torrent;
        const [firstFile] = mediaPreviews;
        console.log(firstFile);

        const type =
          firstFile.type === "video"
            ? ("video/embedded" as const)
            : ("image/embedded" as const);

        const contentItem: Schema.PublicContentItem = {
          id: uuid(),
          timestamp: Date.now(),
          author: selfPublicKey,
          type,
          magnetURI: magnet,
          width: 0,
          height: 0,
          title,
          description
        };
        const published = await addPublishedContent(
          contentItem,
          postType
        )(dispatch);
        console.log("content publish complete");
        console.log(published);
        setLoading(false);
        if (deleteToken) {
          removeUnavailableToken(finalSeedUrl, tokens[0])(dispatch);
        }
        history.replace("/profile");
      } catch (err) {
        console.error(err);
        if (res) {
          res
            .text()
            .then(txt => {
              console.error(`Response data as text: `, txt);
            })
            .catch(e => {
              console.error(`Could not process bad response data as text: `, e);
            });
        }
        setError(err?.errorMessage ?? err?.message);
        setLoading(false);
      }
    },
    [
      availableTokens,
      description,
      dispatch,
      history,
      mediaPreviews,
      postType,
      seedProviderPub,
      seedToken,
      seedUrl,
      selectedFiles,
      selfPublicKey,
      title,
      videoThumbnails
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
      availableTokens,
      setPromptInfo,
      setError,
      onSubmitCb,
      userProfiles,
      seedProviderPub,
      seedToken,
      seedUrl
    ]
  );

  const onDiscard = useCallback(
    async e => {
      e.preventDefault();
      setTitle("");
      setTitleMissing(false);
      setDescription("");
      setError(null);
      setPromptInfo(null);
      setSelectedFiles([]);
      setMediaPreviews([]);
    },
    [
      setDescription,
      setTitle,
      setError,
      setPromptInfo,
      setSelectedFiles,
      setMediaPreviews
    ]
  );
  const onInputChange = useCallback(
    e => {
      const { value, name } = e.target;
      //e.preventDefault()
      switch (name) {
        case "title": {
          setTitleMissing(false);
          setTitle(value);
          return;
        }
        case "description": {
          setDescription(value);
          return;
        }
        case "postType": {
          setPostType(value);
          return;
        }
        case "createPost": {
          console.log("create post");
          return;
        }
        default:
          return;
      }
    },
    [setTitle, setDescription]
  );
  const onSelectedFile = useCallback(
    e => {
      e.preventDefault();

      console.log(e.target.files);
      setSelectedFiles(e.target.files);
      const promises = Array.from(e.target.files).map((file, index) => {
        console.log("doing file...");
        return new Promise(res => {
          //@ts-expect-error
          const { type } = file;
          const reader = new FileReader();

          reader.onload = function (e) {
            if (type.startsWith("image/")) {
              res({ type: "image", uri: e.target.result, index, file });
            }
            if (type.startsWith("video/")) {
              res({ type: "video", uri: e.target.result, index, file });
            }
          };
          //@ts-expect-error
          reader.readAsDataURL(file);
        });
      });
      Promise.allSettled(promises).then(res => {
        const previews = [];
        res.forEach(singleRes => {
          if (singleRes.status === "fulfilled") {
            previews.push(singleRes.value);
          }
        });
        console.log(previews);
        setMediaPreviews(previews);
      });
    },
    [setSelectedFiles, setMediaPreviews]
  );
  const onSelectImageFile = useCallback(
    e => {
      e.preventDefault();
      //imageFile.current.onChange =
      imageFile.current.click();
    },
    [imageFile]
  );
  const onSelectVideoFile = useCallback(
    e => {
      e.preventDefault();
      videoFile.current.click();
    },
    [videoFile]
  );

  const toggleModal = useCallback(() => {
    setThumbnailOpen(!thumbnailOpen);
  }, [thumbnailOpen]);

  return (
    <DarkPage padding pageTitle="PUBLISH CONTENT" scrolls>
      {loading ? (
        <Loader overlay fullScreen text="Publishing content..." />
      ) : null}

      <h2>
        Add to Library<div className="line"></div>
      </h2>

      <form
        className="publish-content-form"
        onSubmit={onSubmit}
        onReset={onDiscard}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div className="publish-content-title">
            <label htmlFor="title">
              <strong>Title</strong>
            </label>
          </div>
          <div>
            <strong>
              Audience:{" "}
              <i
                className={`fas ${
                  postType === "public" ? "fa-globe-europe" : "fa-credit-card"
                }`}
              ></i>
            </strong>
            <select
              name="postType"
              id="postType"
              onChange={onInputChange}
              style={{
                appearance: "none",
                backgroundColor: "rgba(0,0,0,0)",
                color: "var(--main-blue)",
                marginLeft: "0.3rem"
              }}
            >
              <option
                value="public"
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  color: "var(--main-blue)"
                }}
              >
                Public
              </option>
              <option value="private">Paywall</option>
            </select>
          </div>
        </div>
        <input
          type="text"
          name="title"
          placeholder="How I monetized my content with ShockWallet"
          value={title}
          onChange={onInputChange}
          className={c("input-field", titleMissing && "input-field-error")}
        />
        <div className="publish-content-title">
          <label htmlFor="contents">
            <strong>Contents</strong>
          </label>
        </div>

        <div
          className={
            mediaPreviews.length > 0
              ? gStyles.displayNone
              : "publish-content-icons"
          }
        >
          <i
            className="fas fa-images publish-content-icon"
            onClick={onSelectImageFile}
          ></i>

          <i
            className="fas fa-video publish-content-icon"
            onClick={onSelectVideoFile}
          ></i>
        </div>

        <div
          className={c({
            [c("publish-content-preview", gStyles.commonMarginHNegative)]:
              mediaPreviews.length > 0,
            [gStyles.displayNone]: mediaPreviews.length === 0
          })}
        >
          {mediaPreviews.length > 0 &&
            mediaPreviews.map((prev, i) => {
              if (prev.type === "image") {
                return (
                  <img
                    alt={`Media preview ${i + 1}`}
                    src={prev.uri}
                    key={prev.index.toString()}
                    width={288}
                    className="m-1"
                  />
                );
              }

              if (prev.type === "video") {
                return (
                  <div className="video-preview">
                    <div
                      className="change-thumbnail-btn"
                      onClick={() => {
                        toggleModal();
                        setThumbnailTarget(prev);
                      }}
                    >
                      <i className="fas fa-images" />
                    </div>
                    <video
                      src={prev.uri}
                      key={prev.index.toString()}
                      controls
                      width={288}
                      className="m-1"
                    />
                  </div>
                );
              }

              console.error(
                `Unknown type of preview --| ${prev.type} |-- found inside <PublishContentPage />`
              );
              return null;
            })}

          <div
            className="remove-btn"
            onClick={useCallback(() => {
              setSelectedFiles([]);
              setMediaPreviews([]);
            }, [])}
          >
            <i className="far fa-trash-alt" />
          </div>
          <div
            className="remove-btn"
            onClick={useCallback(() => {
              setSelectedFiles([]);
              setMediaPreviews([]);
            }, [])}
          >
            <i className="far fa-trash-alt" />
          </div>
        </div>
        <div className="publish-content-title">
          <label htmlFor="description">
            <strong>Description</strong>
          </label>
        </div>
        <textarea
          name="description"
          placeholder="I made a quick video to show you guys how easy it is to run your own social platform on ShockWallet, and start earning Bitcoin"
          rows={3}
          value={description}
          onChange={onInputChange}
          className="input-field"
        />

        {error ? <p className="error-container">{error}</p> : null}
        <div className="flex-center">
          <input type="reset" value="Reset" className="shock-form-button m-1" />
          <input
            type="submit"
            value="Submit"
            className="shock-form-button-confirm m-1"
          />
        </div>
      </form>
      {promptInfo && (
        <Modal modalOpen={promptInfo && !loading} toggleModal={closePrompt}>
          <div style={{ padding: "1rem" }}>
            <p>
              The service from the default service provider will cost:{" "}
              <strong>{promptInfo.servicePrice} sats</strong>
            </p>

            <button className="shock-form-button m-1" onClick={onDiscard}>
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
      <UploadThumbnail
        open={thumbnailOpen}
        toggleModal={toggleModal}
        target={thumbnailTarget}
        setVideoThumbnails={setVideoThumbnails}
      />

      <input
        type="file"
        id="file"
        ref={imageFile}
        className={gStyles.displayNone}
        accept="image/*"
        onChange={onSelectedFile}
      />
      <input
        type="file"
        id="file"
        ref={videoFile}
        className={gStyles.displayNone}
        accept="video/*"
        onChange={onSelectedFile}
      />
    </DarkPage>
  );
};

export default PublishContentPage;
