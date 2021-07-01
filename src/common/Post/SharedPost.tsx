import { useCallback, useLayoutEffect } from "react";
import { DateTime } from "luxon";
import Tooltip from "react-tooltip";

import Post from ".";

import * as Schema from "../../schema";
import { attachMedia } from "../../utils/Torrents";
import Loader from "../Loader";
import ShockAvatar from "../ShockAvatar";
import Pad from "../Pad";
import "../Post/css/index.scoped.css";

const SharedPost = ({
  sharerProfile,
  originalPostProfile,
  originalPost: origPost,
  sharedTimestamp,
  postPublicKey,
  openTipModal,
  openUnlockModal,
  openDeleteModal = undefined,
  openShareModal = () => {}
}) => {
  const originalPost = origPost as Schema.Post | undefined;
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
          <ShockAvatar height={50} publicKey={sharerProfile.publicKey} />

          <Pad amt={10} insideRow />

          <div className="details">
            <p>{sharerProfile?.displayName}</p>
            <p>
              Shared {DateTime.fromMillis(sharedPost.shareDate).toRelative()}
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
            tipCounter={0}
            tipValue={0}
            publicKey={postPublicKey}
            openTipModal={openTipModal}
            openUnlockModal={openUnlockModal}
            contentItems={originalPost.contentItems ?? {}}
            username={
              originalPostProfile.displayName ?? originalPostProfile.alias
            }
            openShareModal={openShareModal}
          />
        ) : (
          <Loader text="Loading Post..." />
        )}
      </div>
    </div>
  );
};

export default SharedPost;
