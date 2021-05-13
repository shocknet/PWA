import { useCallback, useState } from "react";
import c from "classnames";

import * as Store from "../../../../store";
import * as Utils from "../../../../utils";
import * as gStyles from "../../../../styles";

import styles from "./FollowBtn.module.css";

export interface FollowBtnProps {
  publicKey: string;
}

const FollowBtn = ({ publicKey }: FollowBtnProps) => {
  const isFollowed = !!Store.useSelector(Store.selectFollows).find(
    f => f.user === publicKey
  );

  const [changingStatus, setChangingStatus] = useState(false);

  const handleFollow = useCallback(async () => {
    try {
      if (changingStatus) {
        return;
      }
      setChangingStatus(true);

      let res = { status: -1, data: { errorMessage: "" } };

      if (isFollowed) {
        res = await Utils.Http.delete(`/api/gun/follows/${publicKey}`);
      } else {
        res = await Utils.Http.put(`/api/gun/follows/${publicKey}`, {});
      }

      if (res.status !== 200) {
        throw new Error(res.data.errorMessage);
      }
    } catch (e) {
      if (isFollowed) {
        alert(`Could not unfollow: ${e.message}`);
      } else {
        alert(`Could not follow: ${e.message}`);
      }
    } finally {
      setChangingStatus(false);
    }
  }, [changingStatus, setChangingStatus, isFollowed, publicKey]);

  return (
    <div className={styles.container} onClick={handleFollow}>
      <p className={c(gStyles.unselectable, styles.text)}>
        {changingStatus ? "..." : isFollowed ? "Unfollow" : "Follow"}
      </p>
    </div>
  );
};

export default FollowBtn;
