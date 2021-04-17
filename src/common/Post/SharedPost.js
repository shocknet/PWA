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
  openTipModal,
  openUnlockModal,
  openDeleteModal
}) => {
  const loadPostMedia = useCallback(async () => {
    if (originalPost) {
      attachMedia([originalPost], false);
    }
  }, [originalPost]);
  const deletePost = useCallback(() => {
    openDeleteModal({ id: originalPost.id, shared: true });
  }, [originalPost, openDeleteModal]);

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
              backgroundImage: `url(data:image/jpeg;base64,${sharerProfile?.avatar})`
            }}
          ></div>
          <div className="details">
            <p>{sharerProfile?.displayName}</p>
            <p>
              {sharedTimestamp && typeof sharedTimestamp === "number"
                ? DateTime.fromMillis(sharedTimestamp).toRelative()
                : "Loading..."}
            </p>
          </div>
        </div>
        {openDeleteModal && (
          <i className="fas fa-trash" onClick={deletePost}></i>
        )}
      </div>

      <div className="shared-content">
        {originalPost && originalPostProfile ? (
          <Post
            id={originalPost.id}
            timestamp={originalPost.date}
            avatar={
              originalPostProfile.avatar
                ? `data:image/jpeg;base64,${originalPostProfile.avatar}`
                : av1
            }
            tipCounter={originalPost.tipCounter}
            tipValue={originalPost.tipValue}
            publicKey={postPublicKey}
            openTipModal={openTipModal}
            openUnlockModal={openUnlockModal}
            contentItems={originalPost.contentItems ?? {}}
            username={
              originalPostProfile.displayName ?? originalPostProfile.alias
            }
            isOnlineNode={isOnlineNode}
          />
        ) : (
          <Loader text="Loading Post..." />
        )}
      </div>
    </div>
  );
};

export default SharedPost;
