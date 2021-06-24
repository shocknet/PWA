import React from "react";

import * as Store from "../../../../store";
import * as Utils from "../../../../utils";
import ShockAvatar from "../../../../common/ShockAvatar";
import { convertSatsToUSD, formatNumber } from "../../../../utils/Number";
import { subscribeUserProfile } from "../../../../actions/UserProfilesActions";
import { subscribeUserPosts } from "../../../../actions/FeedActions";

import "./css/index.scoped.css";

export interface TransactionProps {
  coordinateSHA256: string;
}

const Transaction = ({ coordinateSHA256 }: TransactionProps) => {
  const dispatch = Store.useDispatch();
  const coordinate = Store.useSelector(
    Store.selectSingleCoordinate(coordinateSHA256)
  );

  const { username, message, publicKey } = Store.useSelector(state => {
    const data = { username: "", message: "", publicKey: null };

    const publicKey = coordinate.inbound
      ? coordinate.fromGunPub
      : coordinate.toGunPub;

    const user = Store.selectUser(publicKey)(state);

    data.publicKey = publicKey;
    data.username = user.displayName;

    switch (coordinate.type) {
      case "chainTx":
        data.username = "On-Chain";
        break;
      case "contentReveal":
        break;
      case "invoice":
        break;
      case "other":
        break;
      case "payment":
        break;
      case "product":
        break;
      case "service":
        break;
      case "spontaneousPayment":
        break;
      case "streamSeed":
        break;
      case "tip":
        data.message = "Tipped";
        break;
      case "torrentSeed":
        break;

      default:
        data.message = `Unknown type of coordinate: ${coordinate.type}`;
        break;
    }

    return data;
  });

  React.useEffect(() => {
    if (publicKey) {
      return dispatch(subscribeUserProfile(publicKey));
    } else {
      return Utils.EMPTY_FN;
    }
  }, [dispatch, publicKey]);

  React.useEffect(() => {
    if (publicKey) {
      const subscription = dispatch(subscribeUserPosts(publicKey));
      return () => {
        subscription.then(sub => sub.off());
      };
    } else {
      return Utils.EMPTY_FN;
    }
  }, [dispatch, publicKey]);

  const USDRate = Store.useSelector(({ wallet }) => wallet.USDRate ?? "0");
  const sanitizedValue = coordinate.amount.toString().replace(/,/g, "");

  const symbol = coordinate.inbound ? "+" : "-";

  const USDValue = formatNumber(
    convertSatsToUSD(sanitizedValue, USDRate).toFixed(2)
  );

  return (
    <div className="transaction-container">
      <div className="transaction-author-container">
        <div className="transaction-avatar">
          {publicKey && <ShockAvatar height={60} publicKey={publicKey} />}
        </div>
        <div className="transaction-type" />
        <div className="transaction-author-details">
          <p className="transaction-author-username">{username}</p>
          <p className="transaction-author-text">{message}</p>
        </div>
      </div>
      <div className="transaction-value-container">
        <p className="transaction-timestamp">
          {Utils.formatTimestamp(coordinate.timestamp) || "unknown"}
        </p>
        <p className="transaction-value-btc">
          {symbol} {sanitizedValue.replace(symbol, "")}
        </p>
        <p className="transaction-value-usd">{USDValue} USD</p>
      </div>
    </div>
  );
};

export default Transaction;
