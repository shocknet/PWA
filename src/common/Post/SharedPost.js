// @ts-check
import { useCallback, useLayoutEffect } from "react";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";
import Tooltip from "react-tooltip";
import * as Common from "shock-common";

import Post from ".";

import av1 from "../../images/av1.jpg";
import "../Post/css/index.scoped.css";
import { attachMedia } from "../../utils/Torrents";
import Loader from "../Loader";
import * as Store from "../../store";
/**
 * @typedef {import('../../schema').Post} Post
 */

const SharedPost = ({
  sharerProfile,
  originalPostProfile,
  originalPost: origPost,
  sharedTimestamp,
  postPublicKey,
  openTipModal,
  openUnlockModal,
  openDeleteModal = undefined,
  openShareModal = (_)=>{}
}) => {
  /** @type {Post|undefined} */
  const originalPost = origPost;
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

  const selfPublicKey = Store.useSelector(Store.selectSelfPublicKey);
  const isOwn = sharerProfile.publicKey === selfPublicKey;
  const isAppOnline = Common.isAppOnline(
    Store.useSelector(Store.selectUser(sharerProfile.publicKey)).lastSeenApp
  );

  return (
    <div className="post shared-post">
      <div className="head">
        <div className="user">
          <Link
            to={isOwn ? `/profile` : `/otherUser/${sharerProfile.publicKey}`}
            className="av"
            style={{
              borderWidth: isAppOnline && !isOwn ? 2 : undefined,
              borderStyle: isAppOnline && !isOwn ? "solid" : undefined,
              borderColor: isAppOnline && !isOwn ? "#39B54A" : undefined,
              backgroundImage: `url(data:image/jpeg;base64,${sharerProfile?.avatar})`
            }}
          ></Link>
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
            // @ts-expect-error tipCounter not wired right now I think
            tipCounter={originalPost.tipCounter || 0}
            // @ts-expect-error tipValue ??
            tipValue={originalPost.tipValue || 0}
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
