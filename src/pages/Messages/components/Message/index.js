// @ts-check
import { Link } from "react-router-dom";

import ShockAvatar from "../../../../common/ShockAvatar";
import { AVATAR_CONTAINER_STYLE, AVATAR_SIZE } from "../common";
import * as Store from "../../../../store";

import "./css/index.scoped.css";

import { processDisplayName } from "../../../../utils/String";

const Message = ({ subtitle = "", time, publicKey, id }) => {
  const user = Store.useSelector(Store.selectUser(publicKey));

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
