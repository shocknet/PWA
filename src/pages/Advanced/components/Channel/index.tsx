import React from "react";
import classNames from "classnames";
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
        <div
          className={classNames({
            "advanced-channel-status": true,
            "advanced-channel-status-offline": !active
          })}
        ></div>

        <p style={{ marginLeft: "0.5rem" }}>{pendingStatus}</p>
      </div>

      <p className="advanced-channel-address">
        Address: {address + (!!ip && `@${ip}`)}
      </p>

      <div className="advanced-channel-capacity-container">
        <div className="advanced-channel-capacity">
          Sendable: {formattedSendable} sats
        </div>
        <div className="advanced-channel-capacity">
          Receivable: {formattedReceivable} sats
        </div>
      </div>
    </div>
  );
};

export default Channel;
