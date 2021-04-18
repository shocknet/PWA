import React from "react";
import { useSelector } from "react-redux";
import { convertSatsToUSD, formatNumber } from "../../../../utils/Number";
import "./css/index.css";

const Transaction = ({
  username = "John Smith",
  message = "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  time,
  value = "0"
}) => {
  const USDRate = useSelector(({ wallet }) => wallet.USDRate ?? "0");
  const sanitizedValue = value.replace(/,/g, "");
  const parsedValue = parseFloat(sanitizedValue);
  const symbol = parsedValue < 0 ? "-" : parsedValue > 0 ? "+" : "";
  const USDValue = formatNumber(
    convertSatsToUSD(sanitizedValue, USDRate).toFixed(2)
  );
  return (
    <div className="transaction-container">
      <div className="transaction-author-container">
        <div className="transaction-avatar" />
        <div className="transaction-type" />
        <div className="transaction-author-details">
          <p className="transaction-author-username">{username}</p>
          <p className="transaction-author-text">{message}</p>
        </div>
      </div>
      <div className="transaction-value-container">
        <p className="transaction-timestamp">{time}</p>
        <p className="transaction-value-btc">
          {symbol} {value.replace(symbol, "")}
        </p>
        <p className="transaction-value-usd">{USDValue} USD</p>
      </div>
    </div>
  );
};

export default Transaction;
