import React, { Suspense, useCallback, useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";
import * as Common from "shock-common";

import Http from "../../utils/Http";

import { subscribeUserProfile } from "../../actions/UserProfilesActions";

import BottomBar from "../../common/BottomBar";
import AddBtn from "../../common/AddBtn";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";
import ShockAvatar from "../../common/ShockAvatar";
import ProfileDivider from "../../common/ProfileDivider";
import Pad from "../../common/Pad";
import ContentWall from "../../common/ContentWall";

import ClipboardIcon from "../../images/clipboard.svg";
import QRCodeIcon from "../../images/qrcode.svg";
import SendTipModal from "../Feed/components/SendTipModal";
import UnlockModal from "../Feed/components/UnlockModal";
import BuyServiceModal from "../Feed/components/BuyServiceModal";
import ShareModal from "../Feed/components/ShareModal";
import * as Store from "../../store";
import * as gStyles from "../../styles";

import styles from "./css/OtherUser.module.css";
import FollowBtn from "./components/FollowBtn";
import SendReqBtn from "./components/SendReqBtn";
import {
  subscribeFollows,
  unsubscribeFollows,
  subscribeUserPosts as subPosts,
  subSharedPosts
} from "../../actions/FeedActions";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const AVATAR_SIZE = 122;

const OtherUserPage = () => {
  //#region controller
  const dispatch = Store.useDispatch();
  const history = useHistory();
  const myGunPub = Store.useSelector(({ node }) => node.publicKey);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { publicKey: userPublicKey, selectedView = "posts" } = useParams<{
    publicKey: string;
    selectedView: "posts" | "services" | "content";
  }>();
  const user = Store.useSelector(Store.selectUser(userPublicKey));
  const [userServices, setUserServices] = useState({});
  const [tipModalData, setTipModalOpen] = useState(null);
  const [unlockModalData, setUnlockModalOpen] = useState(null);
  const [buyServiceModalData, setBuyServiceModalOpen] = useState(null);
  const [shareModalData, setShareModalData] = useState(null);
  const isMe = myGunPub === user.publicKey;
  // Effect to sub follows
  useEffect(() => {
    dispatch(subscribeFollows());
    return () => {
      dispatch(unsubscribeFollows());
    };
  }, [dispatch]);

  useEffect(() => dispatch(subPosts(userPublicKey)), [dispatch, userPublicKey]);
  useEffect(() => dispatch(subSharedPosts(userPublicKey)), [
    dispatch,
    userPublicKey
  ]);

  // effect for user profile
  useEffect(() => {
    const unsubscribe = dispatch(subscribeUserProfile(userPublicKey));

    return unsubscribe;
  }, [dispatch, userPublicKey]);

  //effect for services
  useEffect(() => {
    Http.get(`/api/gun/otheruser/${userPublicKey}/load/offeredServices`)
      .then(({ data }) => {
        setUserServices(data.data);
      })
      .catch(e => {
        console.log(e);
      });
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

  const posts = Store.useSelector(
    Store.selectPostsNewestToOldest(userPublicKey)
  );

  const copyClipboard = useCallback(() => {
    navigator.clipboard.writeText(userPublicKey);
  }, [userPublicKey]);
  const renderPosts = () => {
    if (posts.length === 0) {
      return <Loader text="loading posts..." />;
    }
    return posts.map(post => {
      if (Common.isSharedPost(post)) {
        // const item = Object.entries(post.originalPost.contentItems).find(
        //   ([_, item]) => item.type === "stream/embedded"
        // );
        // let streamContentId, streamItem;
        // if (item) {
        //   [streamContentId, streamItem] = item;
        // }
        // if (streamItem) {
        //   if (!streamItem.liveStatus) {
        //     return null;
        //   }
        //   if (streamItem.liveStatus === "waiting") {
        //     return null;
        //   }
        //   if (streamItem.liveStatus === "wasLive") {
        //     if (!streamItem.playbackMagnet) {
        //       return null;
        //     }
        //     post.originalPost.contentItems[streamContentId].type =
        //       "video/embedded";
        //     // @ts-expect-error
        //     post.originalPost.contentItems[streamContentId].magnetURI =
        //       streamItem.playbackMagnet;
        //   }
        // }
        return (
          <Suspense fallback={<Loader />} key={post.originalPostID}>
            <SharedPost
              openTipModal={toggleTipModal}
              openUnlockModal={toggleUnlockModal}
              openShareModal={toggleShareModal}
              postID={post.originalPostID}
              sharerPublicKey={post.sharedBy}
            />
          </Suspense>
        );
      }
      const item = Object.entries(post.contentItems).find(
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
          // @ts-expect-error
          post.contentItems[streamContentId].magnetURI =
            streamItem.playbackMagnet;
        }
      }
      return (
        <Suspense fallback={<Loader />} key={post.id}>
          <Post
            id={post.id}
            timestamp={post.date}
            contentItems={post.contentItems}
            publicKey={post.authorId}
            openTipModal={toggleTipModal}
            openUnlockModal={toggleUnlockModal}
            tipCounter={0}
            tipValue={0}
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
            // @ts-expect-error
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
  const renderContent = () => {
    return (
      <div className={styles["content-container"]}>
        <ContentWall publicKey={userPublicKey} />
      </div>
    );
  };
  const handleViewChange = useCallback(
    (selected: "posts" | "services" | "content") => {
      history.replace(`/otherUser/${userPublicKey}/${selected}`);
    },
    [history, userPublicKey]
  );
  //#endregion controller

  return (
    <div className={classNames("page-container", styles["profile-page"])}>
      <div className={classNames(styles["profile-container"])}>
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
          <div>
            <p className={styles["profile-name"]}>{user.displayName}</p>
            <p className={styles["profile-desc"]}>
              {user.bio || "Shockwallet user"}
            </p>

            <div className={gStyles.rowCentered}>
              {!isMe && <FollowBtn publicKey={userPublicKey} />}

              <Pad amt={24} insideRow />

              {!isMe && <SendReqBtn publicKey={userPublicKey} />}
            </div>
          </div>
        </div>

        <ProfileDivider
          onChange={handleViewChange}
          selected={selectedView}
          showContentBtn
        />

        <div>
          {selectedView === "posts" && renderPosts()}
          {selectedView === "services" && renderServices()}
          {selectedView === "content" && renderContent()}
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
