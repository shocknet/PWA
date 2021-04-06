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
import { setSeedInfo, setSeedProviderPub } from "../../actions/ContentActions";
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
import { rifle, disconnectRifleSocket } from "../../utils/WebSocket";

import "./css/index.css";

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

  const posts = Store.useSelector(({ feed }) => feed.posts);
  const publicKey = Store.useSelector(({ node }) => node.publicKey);
  const hostIP = Store.useSelector(({ node }) => node.hostIP);
  const seedProviderPub = Store.useSelector(
    ({ content }) => content.seedProviderPub
  );
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);
  const { seedUrl, seedToken } = Store.useSelector(
    ({ content }) => content.seedInfo
  );

  const myServices = Store.useSelector(({ orders }) => orders.myServices);
  const availableTokens = Store.useSelector(
    ({ content }) => content.availableTokens
  );
  const availableStreamTokens = Store.useSelector(
    ({ content }) => content.availableStreamTokens
  );
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
  const [localSeedPub, setLocalSeedPub] = useState(seedProviderPub);
  const [localSeedUrl, setLocalSeedUrl] = useState(seedUrl);
  const [localSeedToken, setLocalSeedToken] = useState(seedToken);
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
      placeholderEl.select();
      document.execCommand("copy");
      placeholderEl.blur();
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

  const onInputChange = (e: { target: { name: string; value: any } }) => {
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
      case "selfSeedUrl": {
        setLocalSeedUrl(value);
        return;
      }
      case "selfSeedToken": {
        setLocalSeedToken(value);
        return;
      }
      default:
        return;
    }
  };

  const somethingInsideConfigModalChanged =
    localSeedPub !== seedProviderPub ||
    newDisplayName !== user.displayName ||
    newBio !== user.bio ||
    localSeedUrl !== seedUrl ||
    localSeedToken !== seedToken ||
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
    setLocalSeedPub(seedProviderPub);
    setLocalSeedUrl(seedUrl);
    setLocalSeedToken(seedToken);
    setNewDisplayName(user.displayName);
    setNewBio(user.bio);
    toggleConfigModal();
  }, [
    seedProviderPub,
    seedUrl,
    seedToken,
    user.displayName,
    user.bio,
    toggleConfigModal
  ]);

  const onConfigSubmit = useCallback(() => {
    setSeedProviderPub(localSeedPub)(dispatch);
    setSeedInfo(localSeedUrl, localSeedToken)(dispatch);
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
    localSeedPub,
    dispatch,
    localSeedUrl,
    localSeedToken,
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

  const copyClipboard = useCallback(() => {
    try {
      // some browsers/platforms don't support navigator.clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(publicKey);
      } else {
        const placeholderEl = document.querySelector(
          "#public-key-holder"
        ) as HTMLInputElement;
        placeholderEl.select();
        document.execCommand("copy");
        placeholderEl.blur();
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
  const tokensView = useMemo(() => {
    return Object.entries(availableTokens).map(([seedUrl, tokens]) => {
      return (
        <div key={`${seedUrl}`}>
          URL: {seedUrl}
          {
            // @ts-expect-error
            tokens.map((token, index) => {
              return (
                <div
                  key={`${index}-${seedUrl}`}
                  style={{ paddingLeft: "1rem" }}
                >
                  <p>{token}</p>
                </div>
              );
            })
          }
        </div>
      );
    });
  }, [availableTokens]);

  const streamTokensView = useMemo(() => {
    return Object.entries(availableStreamTokens).map(([seedUrl, tokens]) => {
      return (
        <div key={`${seedUrl}`}>
          URL: {seedUrl}
          {
            // @ts-expect-error
            tokens.map((token, index) => {
              return (
                <div
                  key={`${index}-${seedUrl}`}
                  style={{ paddingLeft: "1rem" }}
                >
                  <p>{token}</p>
                </div>
              );
            })
          }
        </div>
      );
    });
  }, [availableStreamTokens]);
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

            {!navigator.clipboard && (
              <input
                className="input-field"
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
                  className="input-field"
                  id="web-client-url-holder"
                  readOnly
                  type="text"
                  value={newWebClientPrefix + "/" + publicKey}
                ></input>
              )}

              <br></br>

              <label htmlFor="localPub">Seed Service Provider</label>
              <input
                type="text"
                className="input-field"
                placeholder={localSeedPub}
                name="localPub"
                onChange={onInputChange}
              />

              <label htmlFor="selfSeedUrl">Self Token Provider</label>
              <input
                type="text"
                className="input-field"
                placeholder={"Seed Url"}
                name="selfSeedUrl"
                value={localSeedUrl}
                onChange={onInputChange}
              />

              <input
                type="text"
                className="input-field"
                placeholder={"Seed Token"}
                name="selfSeedToken"
                value={localSeedToken}
                onChange={onInputChange}
              />
              <h2>Available Content Tokens</h2>
              {tokensView.length === 0 && (
                <p>You don't have any content token available</p>
              )}
              {tokensView}
              <h2>Available Stream Tokens</h2>
              {streamTokensView.length === 0 && (
                <p>You don't have any stream token available</p>
              )}
              {streamTokensView}

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

const AVAILABLE_WEB_CLIENT_PREFIXES: readonly WebClientPrefix[] = [
  "https://shock.pub",
  "https://shock.page",
  "https://lightning.page",
  "https://satoshi.watch"
];

export default ProfilePage;
