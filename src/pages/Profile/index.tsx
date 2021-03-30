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
import Http from "axios";

import * as Utils from "../../utils";
import { setSeedProviderPub } from "../../actions/ContentActions";
import {
  deleteService,
  subscribeMyServices
} from "../../actions/OrdersActions";

import BottomBar from "../../common/BottomBar";
import AddBtn from "../../common/AddBtn";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import ShockAvatar from "../../common/ShockAvatar";

import ClipboardIcon from "../../images/clipboard.svg";
import QRCodeIcon from "../../images/qrcode.svg";
import * as Store from "../../store";

import "./css/index.css";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const posts = Store.useSelector(({ feed }) => feed.posts);
  const publicKey = Store.useSelector(({ node }) => node.publicKey);
  const hostIP = Store.useSelector(({ node }) => node.hostIP);
  const seedProviderPub = Store.useSelector(
    ({ content }) => content.seedProviderPub
  );
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);

  const myServices = Store.useSelector(({ orders }) => orders.myServices);
  const [selectedView, setSelectedView] = useState("posts");
  const user = useSelector(Store.selectSelfUser);
  const myPosts = useMemo(() => {
    if (posts && posts[publicKey]) {
      const myP = posts[publicKey].sort((a, b) => b.date - a.date);
      return myP;
    }
    return [];
  }, [posts, publicKey]);
  console.log(posts);
  console.log(myPosts);
  const processedDisplayName = useMemo(
    () => processDisplayName(publicKey, user.displayName),
    [publicKey, user.displayName]
  );

  useEffect(() => {
    return subscribeMyServices(hostIP)(dispatch);
  }, [hostIP, dispatch]);
  const toggleModal = useCallback(() => {
    setProfileModalOpen(!profileModalOpen);
  }, [profileModalOpen]);

  // ------------------------------------------------------------------------ //
  // CONFIG MODAL

  const [profileConfigModalOpen, setProfileConfigModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user.displayName);
  const [newBio, setNewBio] = useState(user.bio);
  const [localSeedPub, setLocalSeedPub] = useState(seedProviderPub);

  const onInputChange = e => {
    const { value, name } = e.target;
    switch (name) {
      case "localPub": {
        setLocalSeedPub(value);
        return;
      }
      case "selectedView": {
        setSelectedView(value);
        return;
      }
      default:
        return;
    }
  };

  const somethingInsideConfigModalChanged =
    localSeedPub !== seedProviderPub ||
    newDisplayName !== user.displayName ||
    newBio !== user.bio;

  const toggleConfigModal = useCallback(() => {
    setProfileConfigModalOpen(open => !open);
    setNewDisplayName(user.displayName);
    setNewBio(user.bio);
  }, [
    setProfileConfigModalOpen,
    setNewDisplayName,
    user.displayName,
    setNewBio,
    user.bio
  ]);

  const onConfigCancel = useCallback(() => {
    setLocalSeedPub(seedProviderPub);
    setNewDisplayName(user.displayName);
    setNewBio(user.bio);
    toggleConfigModal();
  }, [
    seedProviderPub,
    setNewDisplayName,
    user.displayName,
    setNewBio,
    user.bio,
    toggleConfigModal
  ]);
  const onConfigSubmit = useCallback(() => {
    setSeedProviderPub(localSeedPub)(dispatch);
    if (newDisplayName !== user.displayName) {
      Http.put(`/api/gun/me`, {
        displayName: newDisplayName
      });
    }
    if (newBio !== user.bio) {
      Http.put("/api/gun/me", {
        bio: newBio
      });
    }
    toggleConfigModal();
  }, [
    localSeedPub,
    dispatch,
    newDisplayName,
    user.displayName,
    newBio,
    user.bio,
    toggleConfigModal
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

  const copyClipboard = useCallback(() => {
    navigator.clipboard.writeText(publicKey);
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
            avatar={`data:image/png;base64,${profile?.avatar}`}
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
          <div className="">
            <select
              value={selectedView}
              name="selectedView"
              onChange={onInputChange}
            >
              <option value="posts">POSTS</option>
              <option value="services">SERVICES</option>
            </select>
            {selectedView === "posts" && renderPosts()}
            {selectedView === "services" && renderServices()}
            {myPosts.map((post, index) => {
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
                      // TODO: User online status handling
                      isOnlineNode
                      openUnlockModal={false}
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
                    avatar={`data:image/png;base64,${profile?.avatar}`}
                    username={processDisplayName(
                      profile?.publicKey,
                      profile?.displayName
                    )}
                    publicKey={post.authorId}
                    openTipModal={() => {}}
                    // TODO: User online status handling
                    isOnlineNode
                    openUnlockModal={false}
                    tipCounter={undefined}
                    tipValue={undefined}
                  />
                </Suspense>
              );
            })}
          </div>
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
              padding: "2em 2em",
              height: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%"
              }}
            >
              <label htmlFor="newDisplayName">Display Name</label>
              <input
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

              <label htmlFor="localPub">Seed Service Provider</label>
              <input
                type="text"
                className="input-field"
                placeholder={localSeedPub}
                name="localPub"
                onChange={onInputChange}
              />
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

export default ProfilePage;
