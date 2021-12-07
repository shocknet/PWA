// @ts-check
import { memo, useEffect, useMemo } from "react";
import classNames from "classnames";
import { DateTime } from "luxon";
import * as Common from "shock-common";
import { useInView } from "react-intersection-observer";
/**
 * @typedef {import('react-intersection-observer').IntersectionOptions} IntersectionOptions
 */

import Pad from "../../../../common/Pad";
import ShockAvatar from "../../../../common/ShockAvatar";
import * as Utils from "../../../../utils";

import "./css/index.scoped.css";

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

  const parsedTimestamp = useMemo(() => {
    try {
      const normalizedTimestamp = Common.normalizeTimestampToMs(timestamp);
      const dateTime = DateTime.fromMillis(normalizedTimestamp);
      const dateTxt = dateTime.toLocaleString(DateTime.TIME_SIMPLE);

      return dateTxt;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [timestamp]);

  return (
    <div
      className={classNames({
        message: true,
        "message-received": receivedMessage
      })}
      ref={ref}
    >
      {receivedMessage && (
        <>
          <ShockAvatar height={48} publicKey={publicKey} />

          <Pad amt={16} insideRow />
        </>
      )}

      <div className="message-content">
        <p className="message-text">{text}</p>
        <div className="timestamp">
          <p className="timestamp-text">{parsedTimestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatMessage);
