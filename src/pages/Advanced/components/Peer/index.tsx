import React from "react";

import Pad from "../../../../common/Pad";
import { formatNumber } from "../../../../utils/Number";

import "./css/index.scoped.css";

export interface PeerProps {
  address: string;
  publicKey: string;
  received: string;
  sent: string;
}

const Peer: React.FC<PeerProps> = ({ sent, received, address, publicKey }) => {
  const formattedSent = formatNumber(sent.toString());
  const formattedReceived = formatNumber(received.toString());

  return (
    <div className="peer-container">
      <h4 className="margin-0 padding-0">{address}</h4>

      <Pad amt={12} />

      <p className="advanced-peer-public-key">
        <span>{publicKey ?? "Unknown public key"}</span>
      </p>

      <Pad amt={12} />

      <p className="advanced-peer-value">
        <span>
          <span className="peer-value-title">Sent:</span> {formattedSent}
        </span>
      </p>

      <Pad amt={4} />

      <p className="advanced-peer-value">
        <span>
          <span className="peer-value-title">Received:</span>{" "}
          {formattedReceived}
        </span>
      </p>
    </div>
  );
};

export default Peer;
