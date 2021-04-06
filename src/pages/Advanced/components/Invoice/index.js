// @ts-check
import { DateTime } from "luxon";
import { convertSatsToUSD, formatNumber } from "../../../../utils/Number";
import * as Store from "../../../../store";
import "./css/index.css";

const Invoice = ({ value, date, paymentRequest, message }) => {
  const USDRate = Store.useSelector(({ wallet }) => wallet.USDRate ?? "0");
  const sanitizedValue = value.replace(/,/g, "");
  const USDValue = formatNumber(
    convertSatsToUSD(sanitizedValue, USDRate).toFixed(2)
  );
  const formattedDate = date
    ? DateTime.fromSeconds(parseInt(date, 10)).toRelative()
    : "unknown";

  return (
    <div className="advanced-invoice-container">
      <div className="advanced-invoice-info">
        <div className="advanced-invoice-avatar"></div>
        <div className="advanced-invoice-author">
          <p className="advanced-invoice-author-name">{paymentRequest}</p>
          <p className="advanced-invoice-type">{message ?? "Invoice"}</p>
        </div>
      </div>
      <div className="advanced-invoice-value-container">
        <p className="advanced-invoice-time">{formattedDate}</p>
        <p className="advanced-invoice-value">{value}</p>
        <p className="advanced-invoice-usd">{USDValue} USD</p>
      </div>
    </div>
  );
};

export default Invoice;
