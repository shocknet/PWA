import React from "react";
import * as Common from "shock-common";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";

import * as Store from "../../../../store";
import ShockAvatar from "../../../../common/ShockAvatar";
import { AVATAR_CONTAINER_STYLE, AVATAR_SIZE } from "../common";
import { processDisplayName } from "../../../../utils/String";

import "./css/index.scoped.css";

/**
 * @typedef {object} Props
 * @prop {string} id
 */

/**
 * @type {React.FC<Props>}
 */
const Message = ({ id }) => {
  const convo = Store.useSelector(Store.selectSingleConvo(id));
  const convoMessages = Store.useSelector(Store.selectConvoMessages(id));
  /** @type {import('../../../../schema').ConvoMsg | undefined} */
  const latestMsg = convoMessages
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)[convoMessages.length - 1];
  const user = Store.useSelector(Store.selectUser(convo.with));
  const subtitle = (() => {
    if (convoMessages.length === 0 || latestMsg?.body === Common.INITIAL_MSG) {
      return "No messages yet";
    }
    if (latestMsg?.state === "received") {
      return "> " + latestMsg.body;
    }
    return latestMsg.body;
  })();
  const time = DateTime.fromMillis(
    latestMsg?.timestamp || Date.now()
  ).toRelative();

  return (
    <Link to={`/chat/${id}`} className="container">
      <div className="author-container">
        <div className="author-avatar" style={AVATAR_CONTAINER_STYLE}>
          <ShockAvatar publicKey={convo.with} height={AVATAR_SIZE} />
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
