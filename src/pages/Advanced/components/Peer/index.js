import React from "react";
import { formatNumber } from "../../../../utils/Number";
import "./css/index.css";

const Peer = ({ sent, received, address, publicKey }) => {
  const formattedSent = formatNumber(sent.toString());
  const formattedReceived = formatNumber(received.toString());

  return (
    <div className="advanced-transaction-container">
      <div className="advanced-transaction-info">
        <div className="advanced-transaction-avatar"></div>
        <div className="advanced-transaction-author">
          <p className="advanced-peer-address">{address}</p>
          <p className="advanced-peer-public-key">
            {publicKey ?? "Unknown public key"}
          </p>
        </div>
      </div>
      <div className="advanced-peer-value-container">
        <p className="advanced-peer-value">
          <span className="peer-value-title">Sent:</span> {formattedSent}
        </p>
        <p className="advanced-peer-value">
          <span className="peer-value-title">Received:</span>{" "}
          {formattedReceived}
        </p>
      </div>
    </div>
  );
};

export default Peer;