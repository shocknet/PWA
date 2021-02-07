import React from "react";
import classNames from "classnames";
import "./css/index.css";

const ChatMessage = ({ text = "", receivedMessage = false }) => {
  return (
    <div
      className={classNames({
        "chat-message": true,
        "chat-message-received": receivedMessage
      })}
    >
      {receivedMessage ? <div className="chat-message-avatar"></div> : null}
      <p className="chat-message-text">{text}</p>
    </div>
  );
};

export default ChatMessage;
