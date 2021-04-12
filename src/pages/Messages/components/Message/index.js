// @ts-check
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { subscribeChatMessages } from "../../../../actions/ChatActions";
import ShockAvatar from "../../../../common/ShockAvatar";
import { AVATAR_CONTAINER_STYLE, AVATAR_SIZE } from "../common";
import * as Store from "../../../../store";

import "./css/index.css";

const Message = ({
  name = "John Smith",
  subtitle = "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  time,
  publicKey,
  chatLoaded = false
}) => {
  const dispatch = useDispatch();
  const gunPublicKey = Store.useSelector(({ node }) => node.publicKey);
  const user = Store.useSelector(Store.selectUser(publicKey));

  // TODO: use a ref
  const [messagesListener, setMessagesListener] = useState();

  const subscribeMessages = useCallback(async () => {
    try {
      const subscription = await dispatch(
        subscribeChatMessages(gunPublicKey, publicKey)
      );
      // @ts-expect-error
      setMessagesListener(subscription);
    } catch (err) {
      console.warn(err);
    }
  }, [dispatch, gunPublicKey, publicKey]);

  useEffect(() => {
    if (!messagesListener && chatLoaded) {
      subscribeMessages();
    }

    return () => {
      console.log("Closing Subscription...", publicKey);
      // @ts-expect-error
      messagesListener?.close();
    };
  }, [messagesListener, subscribeMessages, publicKey, chatLoaded]);

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
