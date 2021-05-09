// @ts-check
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from "react";
import * as Common from "shock-common";

import { processDisplayName } from "../../utils/String";
import { attachMedia } from "../../utils/Torrents";
import * as Store from "../../store";
import BottomBar from "../../common/BottomBar";

import SendTipModal from "./components/SendTipModal";
import ShareModal from "../Feed/components/ShareModal";
import Loader from "../../common/Loader";
import ShockAvatar from "../../common/ShockAvatar";

import { isSharedPost } from "../../schema";

import "./css/index.scoped.css";
import UnlockModal from "./components/UnlockModal";
import { useDispatch } from "react-redux";
import {
  subscribeFollows,
  subscribeSharedUserPosts,
  subscribeUserPosts,
  unsubscribeFollows
} from "../../actions/FeedActions";
import { subscribeUserProfile } from "../../actions/UserProfilesActions";
import { rifleCleanup } from "../../utils/WebSocket";
import styles from "./css/Feed.module.css";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const FeedPage = () => {
  const dispatch = useDispatch();
  const follows = Store.useSelector(Store.selectFollows);
  const posts = Store.useSelector(({ feed }) => feed.posts);
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);
  const [tipModalData, setTipModalOpen] = useState(null);
  const [unlockModalData, setUnlockModalOpen] = useState(null);
  const [shareModalData, setShareModalData] = useState(null);
  const { publicKey: selfPublicKey } = Store.useSelector(Store.selectSelfUser);
  // Effect to sub follows
  useEffect(() => {
    subscribeFollows()(dispatch);
    return () => {
      unsubscribeFollows();
    };
  }, [dispatch]);
  const followedPosts = useMemo(() => {
    if (posts) {
      const feed = Object.values(posts)
        .reduce((posts, userPosts) => [...posts, ...userPosts], [])
        .filter(p => {
          if (isSharedPost(p)) {
            return !!follows.find(f => f.user === p.sharerId);
          }
          return !!follows.find(f => f.user === p.authorId);
        })
        .sort((a, b) => {
          const alpha = isSharedPost(a) ? a.shareDate : a.date;
          const beta = isSharedPost(b) ? b.shareDate : b.date;

          return beta - alpha;
        });

      return feed;
    }

    return [];
  }, [follows, posts]);

  const toggleTipModal = useCallback(
    tipData => {
      console.log(tipData);
      if (tipModalData || !tipData) {
        setTipModalOpen(null);
      }

      setTipModalOpen(tipData);
    },
    [tipModalData]
  );
  const toggleUnlockModal = useCallback(
    unlockData => {
      console.log(unlockData);
      if (unlockModalData || !unlockData) {
        setUnlockModalOpen(null);
      }

      setUnlockModalOpen(unlockData);
    },
    [unlockModalData]
  );

  const toggleShareModal = useCallback(
    shareData => {
      console.log(shareData);
      if (shareModalData || !shareData) {
        setShareModalData(null);
      }

      setShareModalData(shareData);
    },
    [shareModalData]
  );

  useLayoutEffect(() => {
    attachMedia(
      followedPosts.filter(post => post.type === "post"),
      false
    );
  }, [followedPosts]);

  useEffect(() => {
    const subscriptions = follows.map(follow => {
      const profileSubscription = dispatch(subscribeUserProfile(follow.user));
      const postsSubscription = dispatch(subscribeUserPosts(follow.user));
      const sharedPostsSubscription = dispatch(
        subscribeSharedUserPosts(follow.user)
      );

      return () => {
        // @ts-ignore
        profileSubscription();
        rifleCleanup(postsSubscription, sharedPostsSubscription)();
      };
    });

    return () => {
      subscriptions.map(unsubscribe => unsubscribe());
    };
  }, [follows, dispatch]);

  return (
    <div className="page-container feed-page">
      <div className={styles.followed}>
        <ShockAvatar forceAddBtn height={60} publicKey={selfPublicKey} />

        {follows?.map(follow => {
          return (
            <ShockAvatar
              height={60}
              key={follow.user}
              nameAtBottom
              publicKey={follow.user}
            />
          );
        })}
      </div>

      <div className="tabs-holder">
        <p className="tab active">Feed</p>
        <p className="tab">Saved</p>
        <p className="tab">Videos</p>
      </div>
      <div className="posts-holder">
        {followedPosts.length === 0 && <Loader text="loading posts..." />}
        {followedPosts.map((post, index) => {
          if (post.type === "shared") {
            if (!post.originalPost) {
              return null;
            }
            const item = Object.entries(post.originalPost.contentItems).find(
              ([_, item]) => item.type === "stream/embedded"
            );
            let streamContentId, streamItem;
            if (item) {
              [streamContentId, streamItem] = item;
            }
            if (streamItem) {
              //@ts-expect-error
              if (!streamItem.liveStatus) {
                return null;
              }
              //@ts-expect-error
              if (streamItem.liveStatus === "waiting") {
                return null;
              }
              //@ts-expect-error
              if (streamItem.liveStatus === "wasLive") {
                //@ts-expect-error
                if (!streamItem.playbackMagnet) {
                  return null;
                }
                post.originalPost.contentItems[streamContentId].type =
                  "video/embedded";
                //@ts-expect-error
                post.originalPost.contentItems[streamContentId].magnetURI =
                  //@ts-expect-error
                  streamItem.playbackMagnet;
              }
            }
            const sharerProfile =
              userProfiles[post.sharerId] ||
              Common.createEmptyUser(post.sharerId);
            const originalPublicKey = post.originalAuthor;
            const originalProfile =
              userProfiles[originalPublicKey] ||
              Common.createEmptyUser(originalPublicKey);
            return (
              <Suspense fallback={<Loader />} key={index}>
                <SharedPost
                  originalPost={post.originalPost}
                  originalPostProfile={originalProfile}
                  sharedTimestamp={post.shareDate}
                  sharerProfile={sharerProfile}
                  postPublicKey={originalPublicKey}
                  openTipModal={toggleTipModal}
                  openUnlockModal={toggleUnlockModal}
                  openShareModal={toggleShareModal}
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
            //@ts-expect-error
            if (!streamItem.liveStatus) {
              return null;
            }
            //@ts-expect-error
            if (streamItem.liveStatus === "waiting") {
              return null;
            }
            //@ts-expect-error
            if (streamItem.liveStatus === "wasLive") {
              //@ts-expect-error
              if (!streamItem.playbackMagnet) {
                return null;
              }
              post.contentItems[streamContentId].type = "video/embedded";
              //@ts-expect-error
              post.contentItems[streamContentId].magnetURI =
                //@ts-expect-error
                streamItem.playbackMagnet;
            }
          }
          const profile =
            userProfiles[post.authorId] ||
            Common.createEmptyUser(post.authorId);

          return (
            <Suspense fallback={<Loader />} key={index}>
              <Post
                id={post.id}
                timestamp={post.date}
                contentItems={post.contentItems}
                username={processDisplayName(
                  profile?.publicKey,
                  profile?.displayName
                )}
                publicKey={post.authorId}
                openTipModal={toggleTipModal}
                openUnlockModal={toggleUnlockModal}
                //@ts-expect-error
                tipCounter={post.tipCounter || 0}
                //@ts-expect-error
                tipValue={post.tipValue || 0}
                openShareModal={toggleShareModal}
              />
            </Suspense>
          );
        })}
      </div>
      <SendTipModal tipData={tipModalData} toggleOpen={toggleTipModal} />
      <UnlockModal
        unlockData={unlockModalData}
        toggleOpen={toggleUnlockModal}
      />
      <ShareModal shareData={shareModalData} toggleOpen={toggleShareModal} />
      <BottomBar />
    </div>
  );
};

export default FeedPage;
