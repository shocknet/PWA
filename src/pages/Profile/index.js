// @ts-check
import React, { Suspense, useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "qrcode.react";
import { Link } from "react-router-dom";
import { processDisplayName } from "../../utils/String";

import { setSeedProviderPub } from "../../actions/ContentActions";

import BottomBar from "../../common/BottomBar";
import AddBtn from "../../common/AddBtn";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import ShockAvatar from "../../common/ShockAvatar";

import ClipboardIcon from "../../images/clipboard.svg";
import QRCodeIcon from "../../images/qrcode.svg";
import "./css/index.css";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileConfigModalOpen, setProfileConfigModalOpen] = useState(false);
  const posts = useSelector(({ feed }) => feed.posts);
  const displayName = useSelector(({ node }) => node.displayName);
  const publicKey = useSelector(({ node }) => node.publicKey);
  const seedProviderPub = useSelector(({ content }) => content.seedProviderPub);
  const userProfiles = useSelector(({ userProfiles }) => userProfiles);
  const [localSeedPub, setLocalSeedPub] = useState(seedProviderPub);
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
    () => processDisplayName(publicKey, displayName),
    [publicKey, displayName]
  );

  const toggleModal = useCallback(() => {
    setProfileModalOpen(!profileModalOpen);
  }, [profileModalOpen]);
  const toggleConfigModal = useCallback(() => {
    setProfileConfigModalOpen(!profileConfigModalOpen);
  }, [profileConfigModalOpen]);

  const copyClipboard = useCallback(() => {
    navigator.clipboard.writeText(publicKey);
  }, [publicKey]);

  const onInputChange = e => {
    const { value, name } = e.target;
    switch (name) {
      case "localPub": {
        setLocalSeedPub(value);
        return;
      }
      default:
        return;
    }
  };
  const onUpdatePub = useCallback(() => {
    setSeedProviderPub(localSeedPub)(dispatch);
  }, [localSeedPub, dispatch]);
  const onCancel = useCallback(() => {
    setLocalSeedPub(seedProviderPub);
  }, [seedProviderPub]);
  const somethingChanged = localSeedPub !== seedProviderPub;
  const AVATAR_SIZE = 122;
  return (
    <div className="page-container profile-page">
      <div className="profile-container">
        <div className="profile-cover" />
        <div className="profile-info-container">
          <div
            className="profile-avatar"
            style={{
              height: `${AVATAR_SIZE}px`,
              width: `${AVATAR_SIZE}px`
            }}
          >
            <ShockAvatar height={AVATAR_SIZE} publicKey={publicKey} />
          </div>

          <div className="profile-info">
            <p className="profile-name">{processedDisplayName}</p>
            <p className="profile-desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam,
              blanditiis
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
          <div className="profile-choice-container">
            <i className="profile-choice-icon fas fa-running"></i>
            <p className="profile-choice-text">Offer a Service</p>
          </div>
        </div>
        <div className="">
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
          <div className="profile-clipboard-container" onClick={copyClipboard}>
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
            <label htmlFor="localPub">Seed Service Provider</label>
            <input
              type="text"
              className="input-field"
              placeholder={localSeedPub}
              name="localPub"
              onChange={onInputChange}
            />
            {somethingChanged && (
              <div className="flex-center" style={{ marginTop: "auto" }}>
                <button onClick={onCancel} className="shock-form-button m-1">
                  CANCEL
                </button>
                <button
                  onClick={onUpdatePub}
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
  );
};

export default ProfilePage;
