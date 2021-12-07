import React, { memo } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";

import * as Utils from "../../../../utils";
import Pad from "../../../../common/Pad";
import Line from "../../../../common/Line";
import { formatNumber } from "../../../../utils/Number";

import "./css/index.scoped.css";

export interface PeerProps {
  address: string;
  publicKey: string;
  received: string;
  sent: string;
  renderDivider: boolean;
}

const Peer: React.FC<PeerProps> = ({
  sent,
  received,
  address,
  publicKey,
  renderDivider
}) => {
  const formattedSent = formatNumber(sent.toString());
  const formattedReceived = formatNumber(received.toString());

  const onClick = React.useCallback(() => {
    if (!navigator.clipboard) {
      toast.dark(
        `Could not copy to clipboard, enable clipboard access or use HTTPs.`
      );
      return;
    }
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast.dark("Copied to clipboard");
      })
      .catch(e => {
        Utils.logger.error(`Error inside <Peer />.onClick -> `, e);
        toast.dark(`Could not copy to clipboard: ${e.message}`);
      });
  }, [address]);

  return (
    <div
      className={classNames("peer-container", {
        "has-divider": renderDivider
      })}
      onClick={onClick}
    >
      <h5 className="margin-0 padding-0">{address}</h5>

      <Pad amt={12} />

      <p className="advanced-peer-public-key">
        <span>{publicKey ?? "Unknown public key"}</span>
      </p>

      <Pad amt={12} />

      <div className="sent-and-received">
        <p className="advanced-peer-value">
          <span>
            <span className="peer-value-title">Sent:</span> {formattedSent}
          </span>
        </p>

        <div className="line">
          <Line color="white" length={16} type="vertical" width={2} />
        </div>

        <p className="advanced-peer-value">
          <span>
            <span className="peer-value-title">Received:</span>{" "}
            {formattedReceived}
          </span>
        </p>
      </div>
    </div>
  );
};

export default memo(Peer);
