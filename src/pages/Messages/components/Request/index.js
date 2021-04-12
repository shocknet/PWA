// @ts-check
import { Link } from "react-router-dom";

import * as Store from "../../../../store";

import "./css/index.css";

const Request = ({ publicKey = "", time, sent }) => {
  const user = Store.useSelector(Store.selectUser(publicKey));

  return (
    <Link to={`/chat/${publicKey}`} className="request-container">
      <div className="request-author-container">
        <div className="request-author-avatar"></div>
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
