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
  const followedPosts = useMemo(() => {
    if (posts) {
      const feed = Object.values(posts)
        .reduce((posts, userPosts) => [...posts, ...userPosts], [])
        .map(post => {
          if (post.type === "post") {
            const follow = follows.find(
              follow => follow.user === post.author.user
            );

            return { ...post, author: follow.profile };
          }

          return post;
        })
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
          {follows?.map(follow => (
            <UserIcon
              username={processDisplayName(
                follow.user,
                follow.profile?.displayName
              )}
              avatar={`data:image/png;base64,${follow.profile?.avatar}`}
            />
          ))}
        </div>
      </div>

      <div className="tabs-holder">
        <p className="tab active">Feed</p>
        <p className="tab">Saved</p>
        <p className="tab">Videos</p>
      </div>
      <div className="posts-holder">
        {followedPosts.map(post => {
          if (post.type === "shared") {
            return (
              <SharedPost
                originalPost={post.originalPost}
                originalPostProfile={post.originalPost?.author}
                sharedTimestamp={post.shareDate}
                sharerProfile={post.author.profile}
                postPublicKey={post.originalAuthor}
              />
            );
          }

          return (
            <Post
              id={post.id}
              timestamp={post.date}
              contentItems={post.contentItems}
              avatar={`data:image/png;base64,${post.author?.avatar}`}
              username={processDisplayName(
                post.author?.user,
                post.author?.displayName
              )}
            />
          );
        })}
      </div>
      <BottomBar />
    </div>
  );
};

export default FeedPage;
