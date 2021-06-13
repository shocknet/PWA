// @ts-check
import { Link } from "react-router-dom";

import * as Store from "../../../../store";
import ShockAvatar from "../../../../common/ShockAvatar";
import { AVATAR_CONTAINER_STYLE, AVATAR_SIZE } from "../common";

import "./css/index.scoped.css";

const Request = ({ publicKey = "", time, sent, id }) => {
  const user = Store.useSelector(Store.selectUser(publicKey));

  return (
    <Link to={`/chat/${id}`} className="request-container">
      <div className="request-author-container">
        <div className="request-author-avatar" style={AVATAR_CONTAINER_STYLE}>
          <ShockAvatar publicKey={publicKey} height={AVATAR_SIZE} />
        </div>
        <div className="request-author-details">
          <p className="request-author-username">
            {sent ? "Sent Request" : "Received Request"} - {user.displayName}
          </p>
          <p className="request-author-text">Request pending acceptance...</p>
        </div>
      </div>
      <p className="request-timestamp">{time}</p>
    </Link>
  );
};

export default Request;
