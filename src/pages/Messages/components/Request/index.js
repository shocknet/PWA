import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { subscribeChatMessages } from "../../../../actions/ChatActions";
import { processDisplayName } from "../../../../utils/String";
import "./css/index.css";

const Request = ({ publicKey = "", displayName = "", time, sent }) => (
  <Link to={`/chat/${publicKey}`} className="request-container">
    <div className="request-author-container">
      <div className="request-author-avatar"></div>
      <div className="request-author-details">
        <p className="request-author-username">
          {sent ? "Sent Request" : "Received Request"} -{" "}
          {processDisplayName(publicKey, displayName)}
        </p>
        <p className="request-author-text">Request pending acceptance...</p>
      </div>
    </div>
    <p className="request-timestamp">{time}</p>
  </Link>
);

export default Request;
