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
import { processDisplayName } from "../../utils/String";

import * as Utils from "../../utils";
import {
  deleteService,
  subscribeMyServices
} from "../../actions/OrdersActions";

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
  const publicKey = Store.useSelector(({ node }) => node.publicKey);
  const hostIP = Store.useSelector(({ node }) => node.hostIP);
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);

  const myServices = Store.useSelector(({ orders }) => orders.myServices);
  const [selectedView, setSelectedView] = useState<"posts" | "services">(
    "posts"
  );
  const user = useSelector(Store.selectSelfUser);
  const myPosts = useMemo(() => {
    if (posts && posts[publicKey]) {
      const myP = posts[publicKey].sort((a, b) => b.date - a.date);
      return myP;
    }
    return [];
  }, [posts, publicKey]);
  console.debug(posts);
  console.debug(myPosts);
  const processedDisplayName = useMemo(
    () => processDisplayName(publicKey, user.displayName),
    [publicKey, user.displayName]
  );

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
  const [newDisplayName, setNewDisplayName] = useState(user.displayName);
  const [newBio, setNewBio] = useState(user.bio);
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

  const somethingInsideConfigModalChanged =
    newDisplayName !== user.displayName ||
    newBio !== user.bio ||
    newWebClientPrefix !== currWebClientPrefix;

  const toggleConfigModal = useCallback(() => {
    setProfileConfigModalOpen(open => !open);
    setNewDisplayName(user.displayName);
    setNewBio(user.bio);
    setNewWebClientPrefix(currWebClientPrefix);
  }, [
    setProfileConfigModalOpen,
    setNewDisplayName,
    user.displayName,
    setNewBio,
    user.bio,
    currWebClientPrefix
  ]);

  const onConfigCancel = useCallback(() => {
    setNewDisplayName(user.displayName);
    setNewBio(user.bio);
    toggleConfigModal();
  }, [user.displayName, user.bio, toggleConfigModal]);

  const onConfigSubmit = useCallback(() => {
    if (newDisplayName !== user.displayName) {
      Utils.Http.put(`/api/gun/me`, {
        displayName: newDisplayName
      }).catch(e => {
        alert(`There was an error setting a new display name: ${e.message}`);
      });
    }
    if (newBio !== user.bio) {
      Utils.Http.put("/api/gun/me", {
        bio: newBio
      }).catch(e => {
        alert(`There was an error setting a new bio: ${e.message}`);
      });
    }
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
  }, [
    newDisplayName,
    user.displayName,
    user.bio,
    newBio,
    toggleConfigModal,
    newWebClientPrefix,
    currWebClientPrefix
  ]);

  // ------------------------------------------------------------------------ //
  // HEADER IMAGE SET ------------------------------------------------------- //
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
  // ------------------------------------------------------------------------ //

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

  const deletePost = useCallback(async () => {
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
    deleteUserPost({
      id: deletePostModalData.id,
      authorId: publicKey
    });
    toggleDeleteModal(null);
  }, [deletePostModalData, publicKey, toggleDeleteModal]);
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
      const profile = userProfiles[post.authorId];
      if (post.type === "shared") {
        const originalPublicKey = post.originalAuthor;
        const originalProfile = userProfiles[originalPublicKey];
        return (
          <Suspense fallback={<Loader />} key={index}>
            <SharedPost
              originalPost={post.originalPost}
              originalPostProfile={originalProfile}
              sharedTimestamp={post.shareDate}
              sharerProfile={profile}
              postPublicKey={originalPublicKey}
              openTipModal={() => {}}
              openUnlockModal={() => {}}
              // TODO: User online status handling
              isOnlineNode
              openDeleteModal={toggleDeleteModal}
            />
          </Suspense>
        );
      }

      return (
        <Suspense fallback={<Loader />} key={index}>
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
            // TODO: User online status handling
            isOnlineNode
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
              <p className="profile-name" onClick={() => {}}>
                {processedDisplayName}
              </p>
              <p className="profile-desc">{user.bio || "Shockwallet user"}</p>
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
            <label htmlFor="newDisplayName">Display Name</label>
            <input
              autoCapitalize="none"
              autoCorrect="off"
              type="text"
              className="input-field"
              placeholder={user.displayName || "new display name"}
              name="newDisplayName"
              onChange={({ target: { value } }) => {
                setNewDisplayName(value);
              }}
            />

            <label htmlFor="newBio">New Bio</label>
            <input
              type="text"
              className="input-field"
              placeholder={user.displayName || "new bio"}
              name="newBio"
              onChange={({ target: { value } }) => {
                setNewBio(value);
              }}
            />

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
                onClick={toggleDeleteModal}
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
