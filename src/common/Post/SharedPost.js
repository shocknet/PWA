// @ts-check
import { useCallback, useLayoutEffect } from "react";
import { DateTime } from "luxon";
import Tooltip from "react-tooltip";
import * as Common from "shock-common";

import Post from ".";

import "../Post/css/index.scoped.css";
import { attachMedia } from "../../utils/Torrents";
import Loader from "../Loader";
import * as Store from "../../store";
import ShockAvatar from "../ShockAvatar";
import Pad from "../Pad";
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
  openShareModal = _ => {}
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
          <ShockAvatar height={50} publicKey={sharerProfile.publicKey} />

          <Pad amt={10} insideRow />

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
