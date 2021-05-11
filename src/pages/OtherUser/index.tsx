import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "qrcode.react";
import { useParams } from "react-router-dom";
import classNames from "classnames";

import { GUN_PROPS } from "../../utils/Gun";
import Http from "../../utils/Http";
import { processDisplayName } from "../../utils/String";

import {
  subscribeUserProfile,
  unsubscribeUserProfile
} from "../../actions/UserProfilesActions";
import { rifle, rifleCleanup } from "../../utils/WebSocket";

import BottomBar from "../../common/BottomBar";
import AddBtn from "../../common/AddBtn";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import ShockAvatar from "../../common/ShockAvatar";
import ProfileDivider from "../../common/ProfileDivider";
import Pad from "../../common/Pad";

import ClipboardIcon from "../../images/clipboard.svg";
import QRCodeIcon from "../../images/qrcode.svg";
import SendTipModal from "../Feed/components/SendTipModal";
import UnlockModal from "../Feed/components/UnlockModal";
import BuyServiceModal from "../Feed/components/BuyServiceModal";
import ShareModal from "../Feed/components/ShareModal";
import * as Store from "../../store";

import styles from "./css/OtherUser.module.css";
import FollowBtn from "./components/FollowBtn";
import {
  subscribeFollows,
  unsubscribeFollows
} from "../../actions/FeedActions";
import node from "../../reducers/NodeReducer";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const AVATAR_SIZE = 122;

const OtherUserPage = () => {
  //#region controller
  const dispatch = useDispatch();
  const myGunPub = Store.useSelector(({ node }) => node.publicKey);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  //@ts-expect-error
  const userProfiles = useSelector(({ userProfiles }) => userProfiles);
  const { publicKey: userPublicKey } = useParams<{ publicKey: string }>();
  const user = Store.useSelector(Store.selectUser(userPublicKey));
  const [userPosts, setUserPosts] = useState([]);
  const [userSharedPosts, setUserSharedPosts] = useState([]);
  const [finalPosts, setFinalPosts] = useState([]);
  const [userServices, setUserServices] = useState({});
  const [tipModalData, setTipModalOpen] = useState(null);
  const [unlockModalData, setUnlockModalOpen] = useState(null);
  const [buyServiceModalData, setBuyServiceModalOpen] = useState(null);
  const [shareModalData, setShareModalData] = useState(null);
  const [selectedView, setSelectedView] = useState<"posts" | "services">(
    "posts"
  );
  const isMe = myGunPub === user.publicKey;
  // Effect to sub follows
  useEffect(() => {
    subscribeFollows()(dispatch);
    return () => {
      unsubscribeFollows();
    };
  }, []);
  const subscribeUserPosts = useCallback(() => {
    const query = `${userPublicKey}::posts::on`;
    const subscription = rifle({
      query,
      reconnect: false,
      onData: async posts => {
        const postEntries = Object.entries(posts);
        const newPosts = postEntries
          .filter(([key, value]) => value !== null && !GUN_PROPS.includes(key))
          .map(([key]) => key);

        const proms = newPosts.map(async id => {
          const { data: post } = await Http.get(
            `/api/gun/otheruser/${userPublicKey}/load/posts>${id}`
          );
          const tipSet = post.data.tipsSet
            ? Object.values(post.data.tipsSet)
            : [];
          const lenSet = tipSet.length;
          const tot =
            lenSet > 0
              ? tipSet.reduce((acc, val) => Number(val) + Number(acc))
              : 0;
          return {
            ...post.data,
            id,
            authorId: userPublicKey,
            tipCounter: lenSet,
            tipValue: tot
          };
        });
        const postsAlmostReady = await Promise.allSettled(proms);
        const postsReady = postsAlmostReady
          .filter(maybeOk => maybeOk.status === "fulfilled")
          //@ts-expect-error
          .map(res => res.value);
        setUserPosts(postsReady);
      }
    });

    return rifleCleanup(subscription);
  }, [userPublicKey]);

  const subscribeSharedPosts = useCallback(() => {
    const query = `${userPublicKey}::sharedPosts::on`;
    const subscription = rifle({
      query,
      reconnect: false,
      onData: async posts => {
        const postEntries = Object.entries(posts);
        const newPosts = postEntries
          .filter(([key, value]) => value !== null && !GUN_PROPS.includes(key))
          .map(([key]) => key);

        const proms = newPosts.map(async id => {
          const { data: shared } = await Http.get(
            `/api/gun/otheruser/${userPublicKey}/load/sharedPosts>${id}`
          );
          if (!shared.data || !shared.data.originalAuthor) {
            throw new Error(
              "invalid shared post provided for user " + userPublicKey
            );
          }
          const { data: post } = await Http.get(
            `/api/gun/otheruser/${shared.data.originalAuthor}/load/posts>${id}`
          );
          const tipSet = post.data.tipsSet
            ? Object.values(post.data.tipsSet)
            : [];
          const lenSet = tipSet.length;
          const tot =
            lenSet > 0
              ? tipSet.reduce((acc, val) => Number(val) + Number(acc))
              : 0;
          return {
            ...shared.data,
            originalPost: {
              ...post.data,
              id,
              tipCounter: lenSet,
              tipValue: tot
            },
            authorId: userPublicKey,
            type: "shared"
          };
        });
        const postsAlmostReady = await Promise.allSettled(proms);
        const postsReady = postsAlmostReady
          .filter(maybeOk => maybeOk.status === "fulfilled")
          // @ts-expect-error
          .map(res => res.value);
        setUserSharedPosts(postsReady);
      }
    });

    return rifleCleanup(subscription);
  }, [userPublicKey]);

  // effect for user profile
  // @ts-ignore
  useEffect(() => {
    const unsubscribe = dispatch(subscribeUserProfile(userPublicKey));

    return unsubscribe;
  }, [dispatch, userPublicKey]);
  //effect for user posts
  useEffect(() => {
    const unsubscribe = subscribeUserPosts();

    return unsubscribe;
  }, [subscribeUserPosts]);
  //effect for shared posts
  useEffect(() => {
    const unsubscribe = subscribeSharedPosts();

    return unsubscribe;
  }, [subscribeSharedPosts]);
  //effect for merge posts and shared posts
  useEffect(() => {
    const final = [...userPosts, ...userSharedPosts].sort(
      (a, b) => b.date - a.date
    );
    setFinalPosts(final);
    const unSubProfiles = userSharedPosts
      .filter(post => !userProfiles[post.originalAuthor])
      .map(post => {
        const pub = post.originalAuthor;
        dispatch(subscribeUserProfile(pub));
        return () => {
          dispatch(unsubscribeUserProfile(pub));
        };
      });
    return () => {
      unSubProfiles.forEach(unSub => unSub());
    };
  }, [dispatch, userPosts, userProfiles, userSharedPosts]);
  //effect for services
  useEffect(() => {
    Http.get(`/api/gun/otheruser/${userPublicKey}/load/offeredServices`).then(
      ({ data }) => {
        setUserServices(data.data);
      }
    );
  }, [userPublicKey]);

  const toggleModal = useCallback(() => {
    setProfileModalOpen(!profileModalOpen);
  }, [profileModalOpen]);

  const toggleTipModal = useCallback(
    tipData => {
      if (tipModalData || !tipData) {
        setTipModalOpen(null);
      }

      setTipModalOpen(tipData);
    },
    [tipModalData]
  );
  const toggleBuyServiceModal = useCallback(
    buyData => {
      if (buyServiceModalData || !buyData) {
        setBuyServiceModalOpen(null);
      }

      setBuyServiceModalOpen(buyData);
    },
    [buyServiceModalData]
  );
  const toggleUnlockModal = useCallback(
    unlockData => {
      if (unlockModalData || !unlockData) {
        setUnlockModalOpen(null);
      }

      setUnlockModalOpen(unlockData);
    },
    [unlockModalData]
  );

  const toggleShareModal = useCallback(
    shareData => {
      console.log("share click yo");
      console.log(shareData);
      if (shareModalData || !shareData) {
        setShareModalData(null);
      }

      setShareModalData(shareData);
    },
    [shareModalData]
  );

  const copyClipboard = useCallback(() => {
    navigator.clipboard.writeText(userPublicKey);
  }, [userPublicKey]);
  const renderPosts = () => {
    if (finalPosts.length === 0) {
      return <Loader text="loading posts..." />;
    }
    return finalPosts.map((post, index) => {
      const profile = userProfiles[post.authorId];
      if (post.type === "shared") {
        if (!post.originalPost) {
          return null;
        }

        const item = Object.entries(post.originalPost.contentItems).find(
          //@ts-expect-error
          ([_, item]) => item.type === "stream/embedded"
        );
        let streamContentId, streamItem;
        if (item) {
          [streamContentId, streamItem] = item;
        }
        if (streamItem) {
          if (!streamItem.liveStatus) {
            return null;
          }
          if (streamItem.liveStatus === "waiting") {
            return null;
          }
          if (streamItem.liveStatus === "wasLive") {
            if (!streamItem.playbackMagnet) {
              return null;
            }
            post.originalPost.contentItems[streamContentId].type =
              "video/embedded";
            post.originalPost.contentItems[streamContentId].magnetURI =
              streamItem.playbackMagnet;
          }
        }
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
              openTipModal={toggleTipModal}
              openUnlockModal={toggleUnlockModal}
              openDeleteModal={null}
              openShareModal={toggleShareModal}
            />
          </Suspense>
        );
      }
      const item = Object.entries(post.contentItems).find(
        //@ts-expect-error
        ([_, item]) => item.type === "stream/embedded"
      );
      let streamContentId, streamItem;
      if (item) {
        [streamContentId, streamItem] = item;
      }
      if (streamItem) {
        if (!streamItem.liveStatus) {
          return null;
        }
        if (streamItem.liveStatus === "waiting") {
          return null;
        }
        if (streamItem.liveStatus === "wasLive") {
          if (!streamItem.playbackMagnet) {
            return null;
          }
          post.contentItems[streamContentId].type = "video/embedded";
          post.contentItems[streamContentId].magnetURI =
            streamItem.playbackMagnet;
        }
      }
      return (
        <Suspense fallback={<Loader />} key={index}>
          <Post
            id={post.id}
            timestamp={post.date}
            contentItems={post.contentItems}
            username={processDisplayName(profile?.user, profile?.displayName)}
            publicKey={post.authorId}
            openTipModal={toggleTipModal}
            openUnlockModal={toggleUnlockModal}
            tipCounter={post.tipCounter || 0}
            tipValue={post.tipValue || 0}
            openDeleteModal={null}
            openShareModal={toggleShareModal}
          />
        </Suspense>
      );
    });
  };
  const renderServices = () => {
    return Object.entries(userServices)
      .filter(([id, service]) => !!service)
      .map(([id, service]) => {
        const buyCB = () => {
          setBuyServiceModalOpen({
            //@ts-expect-error
            ...service,
            serviceID: id,
            owner: userPublicKey
          });
        };
        return (
          <div className={styles.post}>
            <strong>Service ID</strong>
            <p>{id}</p>
            <strong>Service Tpe</strong>
            {/*@ts-expect-error*/}
            <p>{service.serviceType}</p>
            <strong>Service Title</strong>
            {/*@ts-expect-error*/}
            <p>{service.serviceTitle}</p>
            <strong>Service Description</strong>
            {/*@ts-expect-error*/}
            <p>{service.serviceDescription}</p>
            <strong>Service Condition</strong>
            {/*@ts-expect-error*/}
            <p>{service.serviceCondition}</p>
            <strong>Service Price</strong>
            {/*@ts-expect-error*/}
            <p>{service.servicePrice}</p>
            <button onClick={buyCB}>BUY SERVICE</button>
          </div>
        );
      });
  };
  const handleViewChange = useCallback((selected: "posts" | "services") => {
    setSelectedView(selected);
  }, []);
  //#endregion controller

  return (
    <div className={classNames("page-container", styles["profile-page"])}>
      <div className={styles["profile-container"]}>
        <div className="profile-cover">
          {user.header && (
            <img
              className="w-100"
              alt="User set profile header."
              src={`data:image/jpeg;base64,${user.header}`}
            />
          )}
        </div>

        <div className={styles["profile-info-container"]}>
          <div
            className={styles["profile-avatar"]}
            style={{
              height: `${AVATAR_SIZE}px`,
              width: `${AVATAR_SIZE}px`
            }}
          >
            <ShockAvatar
              height={AVATAR_SIZE}
              publicKey={userPublicKey}
              greyBorder
            />
          </div>
          <div className={styles["profile-info"]}>
            <p className={styles["profile-name"]}>{user.displayName}</p>
            <p className={styles["profile-desc"]}>
              {user.bio || "Shockwallet user"}
            </p>

            {!isMe && <FollowBtn publicKey={userPublicKey} />}
          </div>
        </div>

        <ProfileDivider onChange={handleViewChange} selected={selectedView} />

        <div>
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
            value={userPublicKey}
            size={180}
            className={styles["profile-qrcode"]}
          />
          <p className={styles["profile-qrcode-desc"]}>
            Scan this code to contact this user
          </p>
          <div
            className={styles["profile-clipboard-container"]}
            onClick={copyClipboard}
          >
            <img
              src={ClipboardIcon}
              className={styles["profile-clipboard-icon"]}
              alt=""
            />
            <p className={styles["profile-clipboard-text"]}>
              Tap to copy to clipboard
            </p>
          </div>
        </Modal>
        <SendTipModal tipData={tipModalData} toggleOpen={toggleTipModal} />
        <UnlockModal
          unlockData={unlockModalData}
          toggleOpen={toggleUnlockModal}
        />
        <BuyServiceModal
          service={buyServiceModalData}
          toggleOpen={toggleBuyServiceModal}
        />
        <ShareModal shareData={shareModalData} toggleOpen={toggleShareModal} />

        <AddBtn
          onClick={toggleModal}
          large
          iconURL={QRCodeIcon}
          icon={null}
          label={null}
        />
      </div>

      <BottomBar />
    </div>
  );
};

export default OtherUserPage;
