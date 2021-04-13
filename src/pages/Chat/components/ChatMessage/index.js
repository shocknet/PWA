// @ts-check
import classNames from "classnames";
import { DateTime } from "luxon";
import * as Common from "shock-common";

import Pad from "../../../../common/Pad";
import ShockAvatar from "../../../../common/ShockAvatar";
import * as gStyles from "../../../../styles";

import "./css/index.css";

const ChatMessage = ({
  text = "",
  receivedMessage = false,
  publicKey = "",
  timestamp
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

      {(() => {
        try {
          const normalizedTimestamp = Common.normalizeTimestampToMs(timestamp);

          const dateTime = DateTime.fromMillis(normalizedTimestamp);

          const dateTxt = dateTime.toRelative();

          return (
            <div className={classNames(gStyles.rowCentered)}>
              <p>{dateTxt}</p>
            </div>
          );
        } catch (e) {
          console.log(e);
          return null;
        }
      })()}
    </div>
  );
};

export default ChatMessage;
