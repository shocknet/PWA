import React, { memo, useCallback, useLayoutEffect } from "react";
import { DateTime } from "luxon";
import Tooltip from "react-tooltip";

import Post from ".";

import * as Store from "../../store";
import * as Utils from "../../utils";
import Loader from "../Loader";
import ShockAvatar from "../ShockAvatar";
import Pad from "../Pad";
import { attachMedia } from "../../utils/Torrents";
import { subPostContent, subSinglePost } from "../../actions/FeedActions";
import { subscribeUserProfile } from "../../actions/UserProfilesActions";
import "../Post/css/index.scoped.css";

export interface SharedPostProps {
  postID: string;
  sharerPublicKey: string;
  openTipModal?(tipData: any): void;
  openUnlockModal?(unlockData: any): void;
  openDeleteModal?(params: { id: string; shared: boolean }): void;
  openShareModal?(shareData: any): void;
}

const SharedPost = ({
  postID,
  sharerPublicKey,
  openTipModal,
  openUnlockModal,
  openDeleteModal = Utils.EMPTY_FN,
  openShareModal = Utils.EMPTY_FN
}: SharedPostProps) => {
  const dispatch = Store.useDispatch();

  const sharerProfile = Store.useSelector(Store.selectUser(sharerPublicKey));
  const sharedPost = Store.useSelector(
    Store.selectSharedPost(sharerPublicKey, postID)
  );
  const originalPost = Store.useSelector(
    Store.selectSinglePost(sharedPost.originalAuthor, postID)
  );

  const deletePost = useCallback(() => {
    openDeleteModal({ id: originalPost.id, shared: true });
  }, [originalPost, openDeleteModal]);

  React.useEffect(
    () => dispatch(subscribeUserProfile(sharedPost.originalAuthor)),
    [dispatch, sharedPost.originalAuthor]
  );

  React.useEffect(
    () => dispatch(subscribeUserProfile(sharerPublicKey)),
    [dispatch, sharerPublicKey]
  );

  React.useEffect(
    () => dispatch(subSinglePost(sharedPost.originalAuthor, postID)),
    [dispatch, postID, sharedPost.originalAuthor]
  );

  React.useEffect(
    () => dispatch(subPostContent(sharedPost.originalAuthor, postID)),
    [dispatch, postID, sharedPost.originalAuthor]
  );

  useLayoutEffect(() => {
    Tooltip.rebuild();
  }, []);

  return (
    <div className="post shared-post">
      <div className="head">
        <div className="user">
          <ShockAvatar height={50} publicKey={sharerPublicKey} />

          <Pad amt={10} insideRow />

          <div className="details">
            <p>{sharerProfile?.displayName}</p>
            <p>
              {/* @ts-ignore */}
              Shared {DateTime.fromMillis(sharedPost.shareDate).toRelative()}
            </p>
          </div>
        </div>
        {openDeleteModal && (
          <i className="fas fa-trash" onClick={deletePost}></i>
        )}
      </div>

      <div className="shared-content">
        {originalPost ? (
          <Post
            id={originalPost.id}
            publicKey={sharedPost.originalAuthor}
            openTipModal={openTipModal}
            openUnlockModal={openUnlockModal}
            openShareModal={openShareModal}
          />
        ) : (
          <Loader text="Loading Post..." />
        )}
      </div>
    </div>
  );
};

export default memo(SharedPost);
