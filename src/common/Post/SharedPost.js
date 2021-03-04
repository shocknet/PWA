import React, { useCallback, useLayoutEffect } from "react";
import { DateTime } from "luxon";
import Tooltip from "react-tooltip";

import Post from ".";

import av1 from "../../images/av1.jpg";
import "../Post/css/index.css";
import { attachMedia } from "../../utils/Torrents";
import Loader from "../Loader";

const SharedPost = ({
  sharerProfile,
  originalPostProfile,
  originalPost,
  sharedTimestamp,
  isOnlineNode,
  postPublicKey,
  openTipModal
}) => {
  const loadPostMedia = useCallback(async () => {
    if (originalPost) {
      attachMedia([originalPost], false);
    }
  }, [originalPost]);

  useLayoutEffect(() => {
    Tooltip.rebuild();
    loadPostMedia();
  }, [loadPostMedia]);

  return (
    <div className="post shared-post">
      <div className="head">
        <div className="user">
          <div
            className="av"
            style={{
              backgroundImage: `url(data:image/png;base64,${sharerProfile?.avatar})`
            }}
          ></div>
          <div className="details">
            <p>{sharerProfile?.displayName}</p>
            <p>{DateTime.fromMillis(sharedTimestamp).toRelative()}</p>
          </div>
        </div>
      </div>

      <div className="shared-content">
        {!originalPost ? (
          <Loader text="Loading Post..." />
        ) : originalPost && originalPostProfile ? (
          <Post
            id={originalPost.id}
            timestamp={originalPost.date}
            avatar={
              originalPostProfile.avatar
                ? `data:image/png;base64,${originalPostProfile.avatar}`
                : av1
            }
            tipCounter={originalPost.tipCounter}
            tipValue={originalPost.tipValue}
            publicKey={postPublicKey}
            openTipModal={openTipModal}
            contentItems={originalPost.contentItems ?? {}}
            username={
              originalPostProfile.displayName ?? originalPostProfile.alias
            }
            isOnlineNode={isOnlineNode}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SharedPost;
