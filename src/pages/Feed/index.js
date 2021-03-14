import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { processDisplayName } from "../../utils/String";
import { attachMedia } from "../../utils/Torrents";

import BottomBar from "../../common/BottomBar";
import UserIcon from "./components/UserIcon";
import SendTipModal from "./components/SendTipModal";
import Loader from "../../common/Loader";

import { subscribeFollows } from "../../actions/FeedActions";

import "./css/index.css";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const FeedPage = () => {
  const dispatch = useDispatch();
  const follows = useSelector(({ feed }) => feed.follows);
  const posts = useSelector(({ feed }) => feed.posts);
  const userProfiles = useSelector(({ userProfiles }) => userProfiles);
  const [tipModalData, setTipModalOpen] = useState(null);

  const followedPosts = useMemo(() => {
    if (posts) {
      const feed = Object.values(posts)
        .reduce((posts, userPosts) => [...posts, ...userPosts], [])
        .sort((a, b) => b.date - a.date);

      return feed;
    }

    return [];
  }, [posts]);

  const toggleTipModal = useCallback(
    tipData => {
      if (tipModalData || !tipData) {
        setTipModalOpen(null);
      }

      setTipModalOpen(tipData);
    },
    [tipModalData]
  );

  useEffect(() => {
    const subscription = dispatch(subscribeFollows());

    return () => {
      subscription.off("*");
      subscription.close();
    };
  }, [dispatch]);

  useLayoutEffect(() => {
    attachMedia(
      followedPosts.filter(post => post.type === "post"),
      false
    );
  }, [followedPosts]);

  return (
    <div className="page-container feed-page">
      <div className="following-bar-container">
        <UserIcon addButton large main />
        <div className="following-bar-list">
          {follows?.map(follow => {
            const publicKey = follow.user;
            const profile = userProfiles[publicKey] ?? {};
            return (
              <UserIcon
                username={processDisplayName(publicKey, profile.displayName)}
                avatar={`data:image/png;base64,${profile.avatar}`}
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
        {followedPosts.map((post,index) => {
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
                  openTipModal={toggleTipModal}
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
                  profile?.user,
                  profile?.displayName
                )}
                publicKey={post.authorId}
                openTipModal={toggleTipModal}
                // TODO: User online status handling
                isOnlineNode
              />
            </Suspense>
          );
        })}
      </div>
      <SendTipModal tipData={tipModalData} toggleOpen={toggleTipModal} />
      <BottomBar />
    </div>
  );
};

export default FeedPage;
