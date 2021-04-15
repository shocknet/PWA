// @ts-check
import { useEffect } from "react";
import classNames from "classnames";
import { DateTime } from "luxon";
import * as Common from "shock-common";
import { useInView } from "react-intersection-observer";
/**
 * @typedef {import('react-intersection-observer').IntersectionOptions} IntersectionOptions
 */

import Pad from "../../../../common/Pad";
import ShockAvatar from "../../../../common/ShockAvatar";
import * as gStyles from "../../../../styles";
import * as Utils from "../../../../utils";

import "./css/index.css";

/** @type {IntersectionOptions} */
const USE_IN_VIEW_OPTS = {
  threshold: 0.2
};

const ChatMessage = ({
  text = "",
  receivedMessage = false,
  publicKey = "",
  timestamp,
  onInView = Utils.EMPTY_FN,
  onOutView = Utils.EMPTY_FN,
  id
}) => {
  const { inView, ref } = useInView(USE_IN_VIEW_OPTS);

  useEffect(() => {
    if (inView) {
      onInView(id);
    } else {
      onOutView(id);
    }
  }, [id, inView, onInView, onOutView]);

  return (
    <div
      className={classNames({
        "chat-message": true,
        "chat-message-received": receivedMessage
      })}
      ref={ref}
    >
      {receivedMessage && (
        <>
          <ShockAvatar height={48} publicKey={publicKey} />

          <Pad amt={16} insideRow />
        </>
      )}

      <p className="chat-message-text">{text}</p>

      <Pad amt={8} insideRow />

      {(() => {
        try {
          const normalizedTimestamp = Common.normalizeTimestampToMs(timestamp);

          const dateTime = DateTime.fromMillis(normalizedTimestamp);

          const dateTxt = dateTime.toLocaleString(DateTime.TIME_SIMPLE);

          return (
            <div className={classNames(gStyles.rowCentered)}>
              <p className={gStyles.fontSize12}>{dateTxt}</p>
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
