import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { processDisplayName } from "../../utils/String";
import { attachMedia } from "../../utils/Torrents";

import BottomBar from "../../common/BottomBar";
import UserIcon from "./components/UserIcon";
import Post from "../../common/Post";
import SharedPost from "../../common/Post/SharedPost";

import { subscribeFollows } from "../../actions/FeedActions";

import "./css/index.css";

const FeedPage = () => {
  const dispatch = useDispatch();
  const follows = useSelector(({ feed }) => feed.follows);
  const posts = useSelector(({ feed }) => feed.posts);
  const userProfiles = useSelector(({ userProfiles }) => userProfiles);
  const followedPosts = useMemo(() => {
    if (posts) {
      const feed = Object.values(posts)
        .reduce((posts, userPosts) => [...posts, ...userPosts], [])
        .sort((a, b) => b.date - a.date);

      return feed;
    }

    return [];
  }, [posts]);

  useEffect(() => {
    const subscription = dispatch(subscribeFollows());

    return () => {
      subscription.off("*");
      subscription.close();
    };
  }, [dispatch]);

  useEffect(() => {
    attachMedia(followedPosts.filter(post => post.type === "post"));
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
        {followedPosts.map(post => {
          const profile = userProfiles[post.authorId];

          if (post.type === "shared") {
            const originalPublicKey = post.originalAuthor;
            const originalProfile = userProfiles[originalPublicKey];
            return (
              <SharedPost
                originalPost={post.originalPost}
                originalPostProfile={originalProfile}
                sharedTimestamp={post.shareDate}
                sharerProfile={profile}
                postPublicKey={originalPublicKey}
              />
            );
          }

          return (
            <Post
              id={post.id}
              timestamp={post.date}
              contentItems={post.contentItems}
              avatar={`data:image/png;base64,${profile?.avatar}`}
              username={processDisplayName(profile?.user, profile?.displayName)}
            />
          );
        })}
      </div>
      <BottomBar />
    </div>
  );
};

export default FeedPage;
