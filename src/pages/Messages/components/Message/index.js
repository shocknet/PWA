// @ts-check
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { subscribeChatMessages } from "../../../../actions/ChatActions";
import ShockAvatar from "../../../../common/ShockAvatar";
import { AVATAR_CONTAINER_STYLE, AVATAR_SIZE } from "../common";
import * as Store from "../../../../store";

import "./css/index.scoped.css";
import { rifleCleanup } from "../../../../utils/WebSocket";

const Message = ({ subtitle = "", time, publicKey, chatLoaded = false }) => {
  const dispatch = useDispatch();
  const gunPublicKey = Store.useSelector(({ node }) => node.publicKey);
  const user = Store.useSelector(Store.selectUser(publicKey));

  const subscribeMessages = useCallback(() => {
    const subscription = dispatch(
      subscribeChatMessages(gunPublicKey, publicKey)
    );

    return rifleCleanup(subscription);
  }, [dispatch, gunPublicKey, publicKey]);

  useEffect(() => {
    if (chatLoaded) {
      const unsubscribe = subscribeMessages();

      return unsubscribe;
    }
  }, [subscribeMessages, publicKey, chatLoaded]);

  return (
    <Link to={`/chat/${publicKey}`} className="message-container">
      <div className="message-author-container">
        <div className="message-author-avatar" style={AVATAR_CONTAINER_STYLE}>
          <ShockAvatar publicKey={publicKey} height={AVATAR_SIZE} />
        </div>

        <div className="message-author-details">
          <p className="message-author-username">{user.displayName}</p>
          <p className="message-author-text">{subtitle}</p>
        </div>
      </div>
      <p className="message-timestamp">{time}</p>
    </Link>
  );
};

export default Message;
