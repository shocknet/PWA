// @ts-check
import classNames from "classnames";

import Pad from "../../../../common/Pad";
import ShockAvatar from "../../../../common/ShockAvatar";

import "./css/index.css";

const ChatMessage = ({
  text = "",
  receivedMessage = false,
  publicKey = ""
}) => {
  return (
    <div
      className={classNames({
        "chat-message": true,
        "chat-message-received": receivedMessage
      })}
    >
      {receivedMessage && (
        <>
          <ShockAvatar height={48} publicKey={publicKey} />

          <Pad amt={16} insideRow />
        </>
      )}

      <p className="chat-message-text">{text}</p>
    </div>
  );
};

export default ChatMessage;
