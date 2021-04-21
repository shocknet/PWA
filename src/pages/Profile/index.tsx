import React, {
  Suspense,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  InputHTMLAttributes
} from "react";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "qrcode.react";
import { Link } from "react-router-dom";
import c from "classnames";

import { processDisplayName } from "../../utils/String";

import * as Utils from "../../utils";
import {
  deleteService,
  subscribeMyServices
} from "../../actions/OrdersActions";
import * as gStyles from "../../styles";

import BottomBar from "../../common/BottomBar";
import AddBtn from "../../common/AddBtn";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import ShockAvatar from "../../common/ShockAvatar";
import ContentHostInput from "../../common/ContentHostInput";
import ProfileDivider from "../../common/ProfileDivider";
import Pad from "../../common/Pad";

import ClipboardIcon from "../../images/clipboard.svg";
import QRCodeIcon from "../../images/qrcode.svg";
import * as Store from "../../store";
import { rifle, disconnectRifleSocket } from "../../utils/WebSocket";

import "./css/index.css";
import { deleteUserPost } from "../../actions/FeedActions";
import { isSharedPost } from "../../schema";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

export type WebClientPrefix =
  | "https://shock.page"
  | "https://shock.pub"
  | "https://lightning.page"
  | "https://satoshi.watch";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [deletePostModalData, setDeletePostModalData] = useState(null);

  const posts = Store.useSelector(({ feed }) => feed.posts);
  console.log("before reading pub")
  const publicKey = Store.useSelector(({ node }) => node.publicKey);
  console.log("after reading pub")
  const hostIP = Store.useSelector(({ node }) => node.hostIP);
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);

  const myServices = Store.useSelector(({ orders }) => orders.myServices);
  const [selectedView, setSelectedView] = useState<"posts" | "services">(
    "posts"
  );
  const user = useSelector(Store.selectSelfUser);
  const myPosts = useMemo(() => {
    if (posts && posts[publicKey]) {
      const myP = posts[publicKey].sort((a, b) => {
        const alpha = isSharedPost(a) ? a.shareDate : a.date;
        const beta = isSharedPost(b) ? b.shareDate : b.date;

        return beta - alpha;
      });
      return myP;
    }
    return [];
  }, [posts, publicKey]);
  console.debug(posts);
  console.debug(myPosts);

  useEffect(() => {
    const subscription = subscribeMyServices(hostIP)(dispatch);

    return () => {
      subscription.then(cancel => cancel());
    };
  }, [hostIP, dispatch]);
  const toggleModal = useCallback(() => {
    setProfileModalOpen(!profileModalOpen);
  }, [profileModalOpen]);

  // ------------------------------------------------------------------------ //
  // CONFIG MODAL

  const [profileConfigModalOpen, setProfileConfigModalOpen] = useState(false);
  const [currWebClientPrefix, setWebClientPrefix] = useState<WebClientPrefix>(
    AVAILABLE_WEB_CLIENT_PREFIXES[0]
  );
  const [newWebClientPrefix, setNewWebClientPrefix] = useState<WebClientPrefix>(
    AVAILABLE_WEB_CLIENT_PREFIXES[0]
  );

  const copyWebClientUrlToClipboard = useCallback(() => {
    // some browsers/platforms don't support navigator.clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(newWebClientPrefix + "/" + publicKey);
    } else {
      const placeholderEl = document.querySelector(
        "#web-client-url-holder"
      ) as HTMLInputElement;
      placeholderEl.style.display = "block";
      placeholderEl.select();
      document.execCommand("copy");
      placeholderEl.blur();
      placeholderEl.style.display = "none";
    }
  }, [newWebClientPrefix, publicKey]);

  useEffect(() => {
    const query = `$user::Profile>webClientPrefix::on`;

    (async () => {
      const socket = await rifle({
        host: hostIP,
        query
      });

      socket.on("$shock", (webClientPrefixReceived: unknown) => {
        if (typeof webClientPrefixReceived === "string") {
          setWebClientPrefix(webClientPrefixReceived as WebClientPrefix);
        } else {
          Utils.Http.post(`/api/gun/put`, {
            path: "$user>Profile>webClientPrefix",
            value: AVAILABLE_WEB_CLIENT_PREFIXES[0]
          }).catch(e => {
            alert(`Error setting default web client prefix: ${e.message}`);
          });
        }
      });

      socket.on("$error", (errorMessage: string) => {
        alert(`There was an error fetching web client prefix: ${errorMessage}`);
      });
    })();

    return () => {
      disconnectRifleSocket(query);
    };
  }, [hostIP, publicKey /* handles alias switch */]);

  const handleViewChange = useCallback((view: "posts" | "services") => {
    setSelectedView(view);
  }, []);
  //#region configModal ----------------------------------------------------- //
  const somethingInsideConfigModalChanged =
    newWebClientPrefix !== currWebClientPrefix;

  const toggleConfigModal = useCallback(() => {
    setProfileConfigModalOpen(open => !open);
    setNewWebClientPrefix(currWebClientPrefix);
  }, [currWebClientPrefix]);

  const onConfigCancel = useCallback(() => {
    toggleConfigModal();
  }, [toggleConfigModal]);

  const onConfigSubmit = useCallback(() => {
    if (newWebClientPrefix !== currWebClientPrefix) {
      Utils.Http.post(`/api/gun/put`, {
        path: "$user>Profile>webClientPrefix",
        value: newWebClientPrefix
      }).catch(e => {
        alert(
          `There was an error setting your web client prefix: ${e.message}`
        );
      });
    }
    toggleConfigModal();
  }, [toggleConfigModal, newWebClientPrefix, currWebClientPrefix]);
  //#endregion configModal -------------------------------------------------- //
  //#region header ---------------------------------------------------------- //
  const headerImageFileInput = useRef<HTMLInputElement>(null);
  const [settingHeader, setSettingHeader] = useState<boolean>(false);

  const onSelectedHeaderFile: InputHTMLAttributes<{}>["onChange"] = async e => {
    try {
      e.preventDefault();
      if (settingHeader) {
        return;
      }

      setSettingHeader(true);

      const { files } = (e.target as unknown) as {
        files: readonly Utils.File[];
      };

      if (files.length === 0) {
        return;
      }

      if (files.length !== 1) {
        Utils.logger.error(`Profile -> files.length !== 1`);
        alert(
          `An error occurred while trying to set a header. This has been logged.`
        );
        return;
      }

      const [file] = files;

      const imageObtained = await Utils.processImageFile(file, 320, 0.7);

      const DATA_URL_TYPE_PREFIX = "data:image/jpeg;base64,";
      const base64 = imageObtained.slice(DATA_URL_TYPE_PREFIX.length);

      await Utils.Http.post(`/api/gun/put`, {
        path: "$user>profileBinary>header",
        value: base64
      });
    } catch (e) {
      Utils.logger.error(`Error while trying to load new header.`);
      Utils.logger.error(e);
      alert(
        "There was an error loading the new header, this has error has been logged."
      );
    } finally {
      setSettingHeader(false);
    }
  };

  const onPressHeader = useCallback(e => {
    e.preventDefault();
    const { current } = headerImageFileInput;
    if (!current) {
      Utils.logger.error("File input element for avatar is falsy.");
      alert("There was an error and it was logged.");
    }
    current.click();
  }, []);
  //#endregion header ------------------------------------------------------- //
  //#region deleteModal------------------------------------------------------ //
  const toggleDeleteModal = useCallback(
    deleteData => {
      console.log(deleteData);
      if (deletePostModalData || !deleteData) {
        setDeletePostModalData(null);
      }
      setDeletePostModalData(deleteData);
    },
    [deletePostModalData]
  );
  const closeDeleteModal = useCallback(() => {
    setDeletePostModalData(null);
  }, []);

  const deletePost = useCallback(async () => {
    try {
      if (!deletePostModalData || !deletePostModalData.id) {
        return;
      }
      console.log("deleting:");
      console.log(deletePostModalData);
      const key = deletePostModalData.shared ? "sharedPosts" : "posts";
      await Utils.Http.post("/api/gun/put", {
        path: `$user>${key}>${deletePostModalData.id}`,
        value: null
      });
      dispatch(
        deleteUserPost({
          id: deletePostModalData.id,
          authorId: publicKey
        })
      );
      toggleDeleteModal(null);
    } catch (e) {
      console.log(`Error when deleting post:`);
      console.log(e);
      alert(`Could not delete post: ${e.message}`);
    }
  }, [deletePostModalData, dispatch, publicKey, toggleDeleteModal]);
  const copyClipboard = useCallback(() => {
    try {
      // some browsers/platforms don't support navigator.clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(publicKey);
      } else {
        const placeholderEl = document.querySelector(
          "#public-key-holder"
        ) as HTMLInputElement;
        placeholderEl.style.display = "block";
        placeholderEl.select();
        document.execCommand("copy");
        placeholderEl.blur();
        placeholderEl.style.display = "none";
        setProfileModalOpen(false);
      }
    } catch (e) {
      alert(`Could not copy to clipboard: ${e.message}`);
    }
  }, [publicKey]);

  const AVATAR_SIZE = 122;

  const renderPosts = () => {
    return myPosts.map((post, index) => {
      if (post.type === "shared") {
        const sharerProfile = userProfiles[post.sharerId];
        const originalPublicKey = post.originalAuthor;
        const originalProfile = userProfiles[originalPublicKey];
        return (
          <Suspense
            fallback={<Loader />}
            key={post.sharerId + post.originalPost.id}
          >
            <SharedPost
              originalPost={post.originalPost}
              originalPostProfile={originalProfile}
              sharedTimestamp={post.shareDate}
              sharerProfile={sharerProfile}
              postPublicKey={originalPublicKey}
              openTipModal={() => {}}
              openUnlockModal={() => {}}
              openDeleteModal={toggleDeleteModal}
            />
          </Suspense>
        );
      }

      const profile = userProfiles[post.authorId];

      return (
        <Suspense fallback={<Loader />} key={post.id}>
          <Post
            id={post.id}
            timestamp={post.date}
            contentItems={post.contentItems}
            avatar={`data:image/jpeg;base64,${profile?.avatar}`}
            username={processDisplayName(
              profile?.publicKey,
              profile?.displayName
            )}
            publicKey={post.authorId}
            openTipModal={() => {}}
            openUnlockModal={() => {}}
            tipCounter={0}
            tipValue={0}
            openDeleteModal={toggleDeleteModal}
          />
        </Suspense>
      );
    });
  };
  const renderServices = () => {
    console.log(myServices);
    return Object.entries(myServices)
      .filter(([id, service]) => !!service)
      .map(([id, serv]) => {
        const service = serv as Record<string, string>;
        const deleteCB = () => {
          console.log("delete wtf");
          deleteService(id)(dispatch);
        };
        return (
          <div className="post" key={id}>
            <strong>Service ID</strong>
            <p>{id}</p>
            <strong>Service Tpe</strong>
            <p>{service.serviceType || ""}</p>
            <strong>Service Title</strong>
            <p>{service.serviceTitle || ""}</p>
            <strong>Service Description</strong>
            <p>{service.serviceDescription || ""}</p>
            <strong>Service Condition</strong>
            <p>{service.serviceCondition || ""}</p>
            <strong>Service Price</strong>
            <p>{service.servicePrice || ""}</p>
            <button onClick={deleteCB}>DELETE SERVICE</button>
          </div>
        );
      });
  };
  //#endregion deleteModal------------------------------------------------------ //
  //#region displayName ----------------------------------------------------- //
  const [dnModalOpen, setDnModalOpen] = useState(false);
  const { displayName } = user;
  // stores the display name input value
  const [newDisplayName, setNewDisplayName] = useState(user.displayName);
  // stores the new display name while it's being uploaded
  const [newDnIfBeingSaved, setNewDnIfBeingSaved] = useState<string | null>(
    null
  );
  const saveNewDisplayName = useCallback((toBeSaved: string) => {
    if (toBeSaved === "") {
      return;
    }
    setNewDnIfBeingSaved(toBeSaved); // optimistically render new display name
    Utils.Http.put("/api/gun/me", {
      displayName: toBeSaved
    }).catch(e => {
      setNewDnIfBeingSaved(null); // reverts to existing display name
      alert(`There was an error setting a new display name: ${e.message}`);
    });
  }, []);
  useEffect(() => {
    // set placeholder display name back to null after getting the round trip
    // from api
    if (newDnIfBeingSaved === displayName) {
      console.debug(`Got display name round trip from api.`);
      setNewDnIfBeingSaved(null);
    }
  }, [newDnIfBeingSaved, displayName]);
  const toggleDnModal = useCallback(() => {
    setNewDisplayName(displayName);
    setDnModalOpen(open => !open);
  }, [displayName]);
  const handleOkDnChange = useCallback(() => {
    if (newDisplayName !== displayName) {
      saveNewDisplayName(newDisplayName);
    }
    toggleDnModal();
  }, [displayName, newDisplayName, saveNewDisplayName, toggleDnModal]);
  const dnModalStyle = useMemo<React.CSSProperties>(
    () => ({
      padding: "12px 24px"
    }),
    []
  );
  const handleNewDisplayNameChange = ({ target: { value } }) => {
    setNewDisplayName(value);
  };
  //#endregion displayName -------------------------------------------------- //
  //#region bio ------------------------------------------------------------- //
  const { bio } = user;
  const [bioModalOpen, setBioModalOpen] = useState(false);
  // stores the bio input value
  const [newBio, setNewBio] = useState(bio);
  // stores the new bio while it's being uploaded
  const [newBioIfBeingSaved, setNewBioIfBeingSaved] = useState<string | null>(
    null
  );
  const saveNewBio = useCallback((toBeSaved: string) => {
    if (toBeSaved === "") {
      return;
    }
    setNewBioIfBeingSaved(toBeSaved); // optimistically render new bio
    Utils.Http.put("/api/gun/me", {
      bio: toBeSaved
    }).catch(e => {
      setNewBioIfBeingSaved(null); // reverts to existing bio
      alert(`There was an error setting a new bio: ${e.message}`);
    });
  }, []);
  useEffect(() => {
    // set placeholder bio back to null after getting the round trip
    // from api
    if (newBioIfBeingSaved === bio) {
      console.debug(`Got bio round trip from api.`);
      setNewBioIfBeingSaved(null);
    }
  }, [newBioIfBeingSaved, bio]);
  const toggleBioModal = useCallback(() => {
    setNewBio(bio);
    setBioModalOpen(open => !open);
  }, [bio]);
  const handleOkBioChange = useCallback(() => {
    if (newBio !== bio) {
      saveNewBio(newBio);
    }
    toggleBioModal();
  }, [bio, newBio, saveNewBio, toggleBioModal]);
  const bioModalStyle = useMemo<React.CSSProperties>(
    () => ({
      padding: "12px 24px"
    }),
    []
  );
  const handleNewBioChange = ({ target: { value } }) => {
    setNewBio(value);
  };
  //#endregion bio ---------------------------------------------------------- //

  return (
    <>
      <div className="page-container profile-page">
        <div className="profile-container">
          <div className="profile-cover" onClick={onPressHeader}>
            {user.header && (
              <img
                alt="User set profile header."
                src={`data:image/jpeg;base64,${user.header}`}
              />
            )}
          </div>
          <div className="profile-info-container">
            <div
              className="profile-avatar"
              style={{
                height: `${AVATAR_SIZE}px`,
                width: `${AVATAR_SIZE}px`
              }}
            >
              <ShockAvatar
                height={AVATAR_SIZE}
                publicKey={publicKey}
                setsAvatar
                greyBorder
              />
            </div>

            <div className="profile-info">
              <p
                className={c(gStyles.unselectable, "profile-name")}
                onClick={toggleDnModal}
              >
                {newDnIfBeingSaved || displayName}
              </p>
              <p
                className={c(gStyles.unselectable, "profile-desc")}
                onClick={toggleBioModal}
              >
                {newBioIfBeingSaved || user.bio}
              </p>
              <div className="config-btn" onClick={toggleConfigModal}>
                <i className="config-btn-icon icon-solid-spending-rule" />
                <p className="config-btn-text">Config</p>
              </div>
            </div>
          </div>
          <div>
            <Link to={"/goLive"} className="profile-choice-container">
              <div
                style={{
                  backgroundColor: "red",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.2em 0.5em",
                  borderRadius: "0.7em",
                  fontSize: "16px",
                  fontWeight: 600
                }}
              >
                <i className="fas fa-video"></i>
                <p>GO LIVE</p>
              </div>
            </Link>
            <Link to={"/createPost"} className="profile-choice-container">
              <i className="profile-choice-icon fas fa-pen-square"></i>
              <p className="profile-choice-text">Create Post</p>
            </Link>
            <Link to={"/publishContent"} className="profile-choice-container">
              <i className="profile-choice-icon fab fa-youtube"></i>
              <p className="profile-choice-text">Publish Content</p>
            </Link>
            <button className="profile-choice-container">
              <i className="profile-choice-icon fas fa-shopping-cart"></i>
              <p className="profile-choice-text">Offer a Product</p>
            </button>
            <Link to={"/offerService"} className="profile-choice-container">
              <i className="profile-choice-icon fas fa-running"></i>
              <p className="profile-choice-text">Offer a Service</p>
            </Link>
          </div>

          <ProfileDivider onChange={handleViewChange} selected={selectedView} />
          <div className="">
            {selectedView === "posts" && renderPosts()}
            {selectedView === "services" && renderServices()}
          </div>

          {/* Allow some wiggle room to avoid the QR btn covering the view selector */}
          <Pad amt={200} />

          <Modal
            toggleModal={toggleModal}
            modalOpen={profileModalOpen}
            contentStyle={{
              padding: "40px 30px"
            }}
          >
            <QRCode
              bgColor="#23282d"
              fgColor="#4285b9"
              value={publicKey}
              size={180}
              className="profile-qrcode"
            />
            <p className="profile-qrcode-desc">
              Other users can scan this code to contact you
            </p>

            {!navigator.clipboard && (
              <input
                className="hidden-input"
                id="public-key-holder"
                readOnly
                type="text"
                value={publicKey}
              ></input>
            )}
            <div
              className="profile-clipboard-container"
              onClick={copyClipboard}
            >
              <img
                src={ClipboardIcon}
                className="profile-clipboard-icon"
                alt=""
              />
              <p className="profile-clipboard-text">Tap to copy to clipboard</p>
            </div>
          </Modal>

          <Modal
            toggleModal={toggleConfigModal}
            modalOpen={profileConfigModalOpen}
            contentStyle={{
              padding: "2em 2em"
            }}
          >
            <label htmlFor="new-web-client-prefix">Web Client</label>

            <div className="web-client-prefix-picker">
              <i
                className="far fa-copy"
                onClick={copyWebClientUrlToClipboard}
                style={{ fontSize: 24 }}
              />

              <select
                onChange={e => {
                  setNewWebClientPrefix(e.target.value as WebClientPrefix);
                }}
                name="new-web-client-prefix"
                id="new-web-client-prefix"
                value={newWebClientPrefix}
              >
                {AVAILABLE_WEB_CLIENT_PREFIXES.map(prefix => (
                  <option key={prefix} value={prefix}>
                    {prefix}
                  </option>
                ))}
              </select>

              <span>/</span>

              <span style={{ fontSize: 12 }}>{publicKey}</span>
            </div>

            {!navigator.clipboard && (
              <input
                className="hidden-input"
                id="web-client-url-holder"
                readOnly
                type="text"
                value={newWebClientPrefix + "/" + publicKey}
              ></input>
            )}

            <br></br>

            <label htmlFor="content-host">Content Host</label>

            <ContentHostInput />

            <br></br>

            {somethingInsideConfigModalChanged && (
              <div className="flex-center" style={{ marginTop: "auto" }}>
                <button
                  onClick={onConfigCancel}
                  className="shock-form-button m-1"
                >
                  CANCEL
                </button>
                <button
                  onClick={onConfigSubmit}
                  className="shock-form-button-confirm m-1"
                >
                  SUBMIT
                </button>
              </div>
            )}
          </Modal>

          <Modal
            toggleModal={toggleDeleteModal}
            modalOpen={deletePostModalData}
            contentStyle={{
              padding: "2em 2em"
            }}
          >
            <div>You sure delete</div>
            <div className="flex-center" style={{ marginTop: "auto" }}>
              <button
                onClick={closeDeleteModal}
                className="shock-form-button m-1"
              >
                CANCEL
              </button>
              <button
                onClick={deletePost}
                className="shock-form-button-confirm m-1"
              >
                DELETE
              </button>
            </div>
          </Modal>
          <AddBtn
            onClick={toggleModal}
            large
            iconURL={QRCodeIcon}
            style={{ backgroundColor: "var(--yellow)" }}
            icon={null}
            label={null}
          />
        </div>

        <BottomBar />
      </div>

      <input
        type="file"
        id="avatar-file"
        ref={headerImageFileInput}
        hidden
        accept="image/*"
        onChange={onSelectedHeaderFile}
      />

      {
        //#region displayNameModal
      }

      <Modal
        contentStyle={dnModalStyle}
        modalOpen={dnModalOpen}
        toggleModal={toggleDnModal}
      >
        <label htmlFor="newDisplayName">Display Name</label>
        <input
          autoCapitalize="none"
          autoCorrect="off"
          type="text"
          className="input-field"
          placeholder={"New display name"}
          name="newDisplayName"
          onChange={handleNewDisplayNameChange}
          value={newDisplayName}
        />

        {newDisplayName !== displayName && newDisplayName !== "" ? (
          <button
            onClick={handleOkDnChange}
            className="shock-form-button-confirm m-1"
          >
            OK
          </button>
        ) : (
          <button onClick={toggleDnModal} className="shock-form-button m-1">
            GO BACK
          </button>
        )}
      </Modal>

      {
        //#endregion displayNameModal
      }

      {
        //#region bioModal
      }
      <Modal
        contentStyle={bioModalStyle}
        modalOpen={bioModalOpen}
        toggleModal={toggleBioModal}
      >
        <label htmlFor="newBio">New Bio</label>
        <input
          autoCapitalize="none"
          autoCorrect="off"
          type="text"
          className="input-field"
          placeholder={"New bio"}
          name="newBio"
          onChange={handleNewBioChange}
          value={newBio}
        />
        {newBio !== bio && newBio !== "" ? (
          <button
            onClick={handleOkBioChange}
            className="shock-form-button-confirm m-1"
          >
            OK
          </button>
        ) : (
          <button onClick={toggleBioModal} className="shock-form-button m-1">
            GO BACK
          </button>
        )}
      </Modal>
      {
        //#endregion bioModal
      }
    </>
  );
};

const AVAILABLE_WEB_CLIENT_PREFIXES: readonly WebClientPrefix[] = [
  "https://shock.pub",
  "https://shock.page",
  "https://lightning.page",
  "https://satoshi.watch"
];

export default ProfilePage;
