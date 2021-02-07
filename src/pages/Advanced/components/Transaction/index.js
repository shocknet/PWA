import { DateTime } from "luxon";
import React from "react";
import { useSelector } from "react-redux";
import { convertSatsToUSD, formatNumber } from "../../../../utils/Number";
import "./css/index.css";

const Transaction = ({ hash, value, date }) => {
  const USDRate = useSelector(({ wallet }) => wallet.USDRate ?? "0");
  const sanitizedValue = value.replace(/,/g, "");
  const USDValue = formatNumber(
    convertSatsToUSD(sanitizedValue, USDRate).toFixed(2)
  );
  const formattedDate = date
    ? DateTime.fromSeconds(parseInt(date, 10)).toRelative()
    : "unknown";

  return (
    <div className="advanced-transaction-container">
      <div className="advanced-transaction-info">
        <div className="advanced-transaction-avatar"></div>
        <div className="advanced-transaction-author">
          <p className="advanced-transaction-author-name">{hash}</p>
          <p className="advanced-transaction-type">Payment</p>
        </div>
      </div>
      <div className="advanced-transaction-value-container">
        <p className="advanced-transaction-time">{formattedDate}</p>
        <p className="advanced-transaction-value">{value}</p>
        <p className="advanced-transaction-usd">{USDValue} USD</p>
      </div>
    </div>
  );
};

export default Transaction;
