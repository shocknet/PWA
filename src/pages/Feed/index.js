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
import UserIcon from "./components/UserIcon";
import SendTipModal from "./components/SendTipModal";
import Loader from "../../common/Loader";

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

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const FeedPage = () => {
  const dispatch = useDispatch();
  const follows = Store.useSelector(Store.selectFollows);
  const posts = Store.useSelector(({ feed }) => feed.posts);
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);
  const [tipModalData, setTipModalOpen] = useState(null);
  const [unlockModalData, setUnlockModalOpen] = useState(null);
  const { avatar } = Store.useSelector(Store.selectSelfUser);
  // Effect to sub follows
  useEffect(() => {
    subscribeFollows()(dispatch);
    return () => {
      unsubscribeFollows();
    };
  }, []);
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
      <div className="following-bar-container">
        <UserIcon
          addButton
          large
          main
          avatar={avatar ? `data:image/jpeg;base64,${avatar}` : null}
          username={null}
        />
        <div className="following-bar-list">
          {follows?.map(follow => {
            const publicKey = follow.user;
            const profile =
              userProfiles[publicKey] ?? Common.createEmptyUser(publicKey);

            return (
              <UserIcon
                username={processDisplayName(publicKey, profile.displayName)}
                avatar={`data:image/jpeg;base64,${profile.avatar}`}
                key={publicKey}
              />
            );
          })}
        </div>
      </div>

      <div className="tabs-holder">
        <p className="tab active">Feed</p>
        <p className="tab">Saved</p>
        <p className="tab">Videos</p>
      </div>
      <div className="posts-holder">
        {followedPosts.map((post, index) => {
          if (post.type === "shared") {
            if (!post.originalPost) {
              return null;
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
                />
              </Suspense>
            );
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
                avatar={`data:image/jpeg;base64,${profile?.avatar}`}
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
      <BottomBar />
    </div>
  );
};

export default FeedPage;
