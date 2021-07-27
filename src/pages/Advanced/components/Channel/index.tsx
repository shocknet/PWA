import React from "react";
import classNames from "classnames";

import Pad from "../../../../common/Pad";
import Line from "../../../../common/Line";
import { formatNumber } from "../../../../utils/Number";

import "./css/index.scoped.css";

export interface ChannelProps {
  active: boolean;
  address: string;
  ip: string | undefined;
  pendingStatus?: string;
  receivable: string;
  sendable: string;
}

const Channel: React.FC<ChannelProps> = ({
  address,
  ip,
  sendable,
  receivable,
  active,
  pendingStatus = ""
}) => {
  const formattedSendable = React.useMemo(() => formatNumber(sendable), [
    sendable
  ]);
  const formattedReceivable = React.useMemo(() => formatNumber(receivable), [
    receivable
  ]);
  return (
    <div className="advanced-channel-container">
      {/* <div className="advanced-channel-ip"></div> */}

      <div className="advanced-channel-name-container">
        <p style={{ marginLeft: "0.5rem" }}>{pendingStatus}</p>
      </div>

      <div className="address-and-status">
        <div
          className={classNames({
            "advanced-channel-status": true,
            "advanced-channel-status-offline": !active
          })}
        ></div>

        <Pad amt={12} insideRow />

        <p className="advanced-channel-address">
          {address + (!!ip && `@${ip}`)}
        </p>
      </div>

      <Pad amt={12} />

      <div className="advanced-channel-capacity-container">
        <div className="advanced-channel-capacity">
          Sendable: {formattedSendable} sats
        </div>

        <div className="line">
          <Line color="white" length={16} type="vertical" width={2} />
        </div>

        <div className="advanced-channel-capacity">
          Receivable: {formattedReceivable} sats
        </div>
      </div>
    </div>
  );
};

export default Channel;
