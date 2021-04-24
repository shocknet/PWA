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

import "./css/index.css";
import UnlockModal from "./components/UnlockModal";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const FeedPage = () => {
  const follows = Store.useSelector(Store.selectFollows);
  useEffect(()=>{
    console.info("follows in feed just updated:")
    console.info(follows)
  },[follows])
  const posts = Store.useSelector(({ feed }) => feed.posts);
  useEffect(()=>{
    console.info("posts in feed just updated:")
    console.info(posts)
  },[posts])
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);
  useEffect(()=>{
    console.info("userProfiles in feed just updated:")
    console.info(userProfiles)
  },[userProfiles])
  const [tipModalData, setTipModalOpen] = useState(null);
  const [unlockModalData, setUnlockModalOpen] = useState(null);
  const { avatar } = Store.useSelector(Store.selectSelfUser);

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
            
            console.log(publicKey)
            console.log(profile.displayName)
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
                tipCounter={undefined}
                tipValue={undefined}
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
