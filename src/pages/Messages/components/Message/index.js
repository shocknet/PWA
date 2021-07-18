// @ts-check
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";

import ShockAvatar from "../../../../common/ShockAvatar";
import { AVATAR_CONTAINER_STYLE, AVATAR_SIZE } from "../common";
import * as Store from "../../../../store";

import "./css/index.scoped.css";
import { processDisplayName } from "../../../../utils/String";

const Message = ({
  subtitle = "",
  lastMessageTimestamp,
  publicKey,
  id = ""
}) => {
  const user = Store.useSelector(Store.selectUser(publicKey));
  const time = useMemo(() => {
    if (lastMessageTimestamp === -1) {
      return "";
    }
    const relativeTime = DateTime.fromMillis(lastMessageTimestamp).toRelative();
    return relativeTime === "in 0 seconds" ? "Just now" : relativeTime;
  }, [lastMessageTimestamp]);

  // useEffect(() => {
  //   const subscription = dispatch(
  //     subscribeChatMessages(gunPublicKey, publicKey)
  //   );

  //   return () => {
  //     subscription.then(sub => {
  //       sub.off();
  //     });
  //   };
  // }, [dispatch, gunPublicKey, publicKey]);

  return (
    <Link to={`/chat/${id}`} className="container">
      <div className="author-container">
        <div className="author-avatar" style={AVATAR_CONTAINER_STYLE}>
          <ShockAvatar publicKey={publicKey} height={AVATAR_SIZE} />
        </div>

        <div className="author-details">
          <p className="author-username">
            {processDisplayName(user.publicKey, user.displayName)}
          </p>
          <p className="author-text">{subtitle}</p>
        </div>
      </div>
      <p className="timestamp">{time}</p>
    </Link>
  );
};

export default Message;
