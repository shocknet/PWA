import React, { memo } from "react";

import "./ChatActionBar.scoped.css";

export interface ChatBottomBarProps {
  acceptLabel?: string;
  declineLabel?: string;
  onAccept?(): void;
  onReject?(): void;
  text?: string;
  title?: string;
}

const ChatBottomBar: React.FC<ChatBottomBarProps> = ({
  acceptLabel,
  declineLabel,
  onAccept,
  onReject,
  text,
  title
}) => {
  return (
    <div className="chat-permission-bar">
      {title && <p className="chat-permission-bar-title">{title}</p>}

      {text && <p className="chat-permission-bar-text unselectable">{text}</p>}

      {(onAccept || onReject) && (
        <div className="chat-permission-bar-actions unselectable">
          {onAccept && (
            <div
              className="chat-permission-bar-action chat-permission-bar-action-accept"
              onClick={onAccept}
            >
              {acceptLabel || "Accept"}
            </div>
          )}
          {onReject && (
            <div
              className="chat-permission-bar-action chat-permission-bar-action-decline"
              onClick={onReject}
            >
              {declineLabel || "Decline"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(ChatBottomBar);
