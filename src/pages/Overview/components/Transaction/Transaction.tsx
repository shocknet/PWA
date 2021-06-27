import React from "react";
import * as Common from "shock-common";

import * as Store from "../../../../store";
import * as Utils from "../../../../utils";
import * as Schema from "../../../../schema";
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
        data.message = `Bought Post`;

        if (coordinate.metadata) {
          const metadata = Utils.safeParseJson(coordinate.metadata);
          if (metadata) {
            const author = coordinate.toGunPub;

            const postID = (() => {
              if (coordinate.inbound) {
                return (metadata as Schema.ContentRevealCoordinateMetadataInbound)
                  .ackInfo;
              }

              const {
                response
              } = metadata as Schema.ContentRevealCoordinateMetadataOutbound;

              return response && response.ackInfo;
            })();

            // Cast: only can purchase normal posts not shared posts.
            const post = Store.selectSinglePost(
              author,
              postID
            )(state) as Schema.Post;

            if (post) {
              const paragraphs = Object.values(post.contentItems).filter(
                ci => ci.type === "text/paragraph"
              ) as Common.Paragraph[];
              const text = paragraphs.map(p => p.text).join(" ");
              // Poor man's ellipsis
              if (text.length >= 18) {
                data.message = `Bought "${text.slice(0, 18)}..."`;
              } else {
                // Looks good on iPhone 5
                data.message = `Bought "${text}"`;
              }
            }
          }
        }
        break;
      case "invoice":
        if (coordinate.inbound) {
          data.message = "Sent you money";
        } else {
          Utils.logger.warn(`Outbound invoice??`);
          data.message = "You sent money";
        }
        break;
      case "other":
        data.message = "Other";
        break;
      case "payment":
        if (coordinate.inbound) {
          Utils.logger.warn(`Inbound payment??`);
          data.message = "Payment Received";
        } else {
          data.message = "Payment Sent";
        }
        break;
      case "product":
        data.message = "Product";
        break;
      case "service":
        data.message = "Service";
        break;
      case "spontaneousPayment":
        data.message = coordinate.inbound ? "Payment Received" : "Payment Sent";
        break;
      case "streamSeed":
        data.message = "Seed Service";
        break;
      case "tip":
        data.message = coordinate.inbound ? "You were Tipped" : "You Tipped";
        break;
      case "torrentSeed":
        data.message = "Seed Service";
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
