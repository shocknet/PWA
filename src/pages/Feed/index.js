// @ts-check
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import * as Common from "shock-common";
import { useHistory } from "react-router-dom";

import { attachMedia } from "../../utils/Torrents";
import * as Store from "../../store";
import BottomBar from "../../common/BottomBar";

import SendTipModal from "./components/SendTipModal";
import ShareModal from "../Feed/components/ShareModal";
import Loader from "../../common/Loader";
import ShockAvatar from "../../common/ShockAvatar";

import "./css/index.scoped.css";
import UnlockModal from "./components/UnlockModal";
import {
  subscribeFollows,
  subscribeUserPosts,
  unsubscribeFollows,
  reloadFeed,
  subSharedPosts,
  reloadFollows
} from "../../actions/FeedActions";
import { subscribeUserProfile } from "../../actions/UserProfilesActions";
import styles from "./css/Feed.module.css";
import { DEFAULT_FOLLOWS } from "../../utils/Constants";
import GuestTipModal from "../../common/TipModal";
import AddBtn from "../../common/AddBtn";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const FeedPage = () => {
  const dispatch = Store.useDispatch();
  const history = useHistory();
  const authenticated = Store.useSelector(({ auth }) => auth.authenticated);
  const follows = Store.useSelector(Store.selectFollows);
  const posts = Store.useSelector(
    Store.selectAllPostsFromFollowedNewestToOldest
  );
  const [tipModalData, setTipModalOpen] = useState(null);
  const [unlockModalData, setUnlockModalOpen] = useState(null);
  const [shareModalData, setShareModalData] = useState(null);
  const [tipPublicKey, setTipPublicKey] = useState(null);
  const { publicKey: selfPublicKey } = Store.useSelector(Store.selectSelfUser);
  const reloadDone = Store.useSelector(({ feed }) => feed.reloadDone);
  // Effect to sub follows
  useEffect(() => {
    dispatch(subscribeFollows());
    return () => {
      dispatch(unsubscribeFollows());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!authenticated) {
      dispatch(reloadFollows(DEFAULT_FOLLOWS));
    }
  }, [authenticated, dispatch]);

  const toggleTipModal = useCallback(
    tipData => {
      console.log(tipData);
      if (tipModalData || !tipData) {
        setTipModalOpen(null);
        setTipPublicKey(null);
        return;
      }

      setTipModalOpen(tipData);
      setTipPublicKey(tipData.publicKey);
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

  const redirectAuth = useCallback(() => {
    history.push("/auth");
  }, [history]);

  useLayoutEffect(() => {
    attachMedia(
      posts.filter(post => !Common.isSharedPost(post)),
      false
    );
  }, [posts]);

  useEffect(() => {
    const subscriptions = follows.map(follow => {
      const profileSubscription = dispatch(subscribeUserProfile(follow.user));
      const postsSubscription = dispatch(subscribeUserPosts(follow.user));
      const sharedPostsSubscription = dispatch(subSharedPosts(follow.user));

      return () => {
        profileSubscription();
        postsSubscription();
        sharedPostsSubscription();
      };
    });

    return () => {
      subscriptions.map(unsubscribe => unsubscribe());
    };
  }, [follows, dispatch]);

  //effect to reload the feed once after a cache clear
  useEffect(() => {
    if (posts.length > 0 && !reloadDone) {
      dispatch(reloadFeed());
      setTimeout(() => {
        history.go(0);
      }, 3000);
    }
  }, [reloadDone, history, dispatch, posts.length]);

  return (
    <div className="page-container feed-page">
      <div className={styles.followed}>
        {authenticated && (
          <ShockAvatar
            forceAddBtn
            height={60}
            publicKey={selfPublicKey}
            createsPost
          />
        )}

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
        {posts.length === 0 && <Loader text="loading posts..." />}
        {posts.map(post => {
          if (Common.isSharedPost(post)) {
            return (
              <Suspense fallback={<Loader />} key={post.shareID}>
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

          return (
            <Suspense fallback={<Loader />} key={post.id}>
              <Post
                id={post.id}
                publicKey={post.authorId}
                openTipModal={toggleTipModal}
                openUnlockModal={toggleUnlockModal}
                openShareModal={toggleShareModal}
              />
            </Suspense>
          );
        })}
      </div>
      <SendTipModal tipData={tipModalData} toggleOpen={toggleTipModal} />
      <GuestTipModal
        publicKey={tipPublicKey}
        tipData={tipModalData}
        toggleOpen={toggleTipModal}
      />
      <UnlockModal
        unlockData={unlockModalData}
        toggleOpen={toggleUnlockModal}
      />
      <ShareModal shareData={shareModalData} toggleOpen={toggleShareModal} />
      {!authenticated && (
        <AddBtn
          onClick={redirectAuth}
          large
          icon="user"
          label="Create a Lightning Page"
        />
      )}
      <BottomBar />
    </div>
  );
};

export default FeedPage;
