// @ts-check
import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextArea from "react-textarea-autosize";
import classNames from "classnames";
import debounce from "lodash/debounce";
import { DateTime } from "luxon";
import produce, { enableMapSet } from "immer";

import MainNav from "../../common/MainNav";
import ChatMessage from "./components/ChatMessage";
import {
  acceptHandshakeRequest,
  sendMessage,
  subscribeChatMessages
} from "../../actions/ChatActions";
import BitcoinLightning from "../../images/bitcoin-lightning.svg";
import "./css/index.css";
import * as Store from "../../store";
import { rifleCleanup } from "../../utils/WebSocket";
import { getContact } from "../../utils";
import * as gStyles from "../../styles";
/**
 * @typedef {import('../../schema').ReceivedRequest} ReceivedRequest
 */

enableMapSet();

/**
 * @typedef {object} ChatPageParams
 * @prop {string} publicKey
 */

const ChatPage = () => {
  const dispatch = useDispatch();
  const params = /** @type {ChatPageParams} */ (useParams());
  const { publicKey: recipientPublicKey } = params;
  const user = Store.useSelector(Store.selectUser(recipientPublicKey));
  const [message, setMessage] = useState("");
  /* ------------------------------------------------------------------------ */
  // Date Bubble
  const [shouldShowDateBubble, setShouldShowDateBubble] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(-1);
  const chatDateBubbleContainerStyle = useMemo(
    () => ({
      top: headerHeight + 8 + "px"
    }),
    [headerHeight]
  );

  const handleHeaderHeight = useCallback(
    (/** @type {number} */ height) => {
      setHeaderHeight(height);
    },
    [setHeaderHeight]
  );

  const handleScroll = debounce(() => {
    if (!shouldShowDateBubble) {
      setShouldShowDateBubble(true);
      setTimeout(() => {
        setShouldShowDateBubble(false);
      }, 1500);
    }
  });
  /* ------------------------------------------------------------------------ */

  const messages = Store.useSelector(
    ({ chat }) => chat.messages[recipientPublicKey]
  );
  const contact = Store.useSelector(({ chat }) =>
    getContact(chat.contacts, recipientPublicKey)
  );
  const sentRequest = Store.useSelector(({ chat }) =>
    getContact(chat.sentRequests, recipientPublicKey)
  );
  const receivedRequest = /** @type {ReceivedRequest} */ (Store.useSelector(
    ({ chat }) => getContact(chat.receivedRequests, recipientPublicKey)
  ));
  const gunPublicKey = Store.useSelector(({ node }) => node.publicKey);
  const pendingSentRequest = !contact && sentRequest;
  const pendingReceivedRequest = !contact && receivedRequest;

  const handleInputChange = useCallback(e => {
    setMessage(e.target.value);
  }, []);

  const acceptRequest = useCallback(() => {
    console.log(receivedRequest);
    if (receivedRequest) {
      acceptHandshakeRequest(receivedRequest.id)(dispatch);
    }
  }, [receivedRequest, dispatch]);

  const submitMessage = useCallback(
    e => {
      if (e.key === "Enter" && e.ctrlKey) {
        setMessage(message + "\r\n");
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        dispatch(
          sendMessage({
            message,
            publicKey: recipientPublicKey
          })
        );
        setMessage("");
        return;
      }
    },
    [message, recipientPublicKey, dispatch]
  );

  const subscribeIncomingMessages = useCallback(() => {
    const subscription = dispatch(
      subscribeChatMessages(gunPublicKey, recipientPublicKey)
    );

    return rifleCleanup(subscription);
  }, [dispatch, gunPublicKey, recipientPublicKey]);

  useEffect(() => {
    const unsubscribe = subscribeIncomingMessages();

    return unsubscribe;
  }, [subscribeIncomingMessages]);

  // ------------------------------------------------------------------------ //
  // Date bubble

  const [visibleMessages, setVisibleMessages] = useState(
    /** @type {Set<string>} */ (new Set())
  );

  const [newestTimestampInView, oldestTimestampInView] = useMemo(() => {
    if (visibleMessages.size === 0) {
      return [DateTime.now().valueOf(), Date.now().valueOf()];
    }
    const sorted = Array.from(visibleMessages)
      .map(id => messages.find(msg => msg.id === id))
      .filter(x => !!x)
      .sort((a, b) => b.timestamp - a.timestamp);
    /** @type {[number|null , number|null]} */
    const res = [sorted[0].timestamp, sorted[sorted.length - 1].timestamp];
    return res;
  }, [messages, visibleMessages]);

  const handleMessageInView = useCallback(
    id => {
      setVisibleMessages(
        produce(draft => {
          draft.add(id);
        })
      );
    },
    [setVisibleMessages]
  );
  const handleMessageOutView = useCallback(
    id => {
      setVisibleMessages(
        produce(draft => {
          draft.delete(id);
        })
      );
    },
    [setVisibleMessages]
  );

  // ------------------------------------------------------------------------ //

  const contactName = user.displayName;

  return (
    <div className="page-container">
      <MainNav
        solid
        pageTitle={contactName}
        enableBackButton
        onHeight={handleHeaderHeight}
      />

      <div className="chat-messages-container" onScroll={handleScroll}>
        {messages?.map(message => (
          <ChatMessage
            text={message.body}
            receivedMessage={!message.outgoing}
            publicKey={message.recipientPublicKey}
            timestamp={message.timestamp}
            onInView={handleMessageInView}
            onOutView={handleMessageOutView}
            id={message.id}
          />
        ))}
      </div>

      <div
        className={classNames(
          gStyles.horizontallyCenteredAbsolute,
          gStyles.absoluteStickToTop,
          gStyles.centerAlign,
          gStyles.centerJustify
        )}
        style={chatDateBubbleContainerStyle}
      >
        <span
          className={classNames(
            gStyles.fontSize12,
            "chat-date-bubble",
            shouldShowDateBubble
              ? gStyles.opacityThreeQuarters
              : gStyles.opacityNone
          )}
        >
          {(() => {
            const newest = DateTime.fromMillis(newestTimestampInView).startOf(
              "day"
            );
            const oldest = DateTime.fromMillis(oldestTimestampInView).startOf(
              "day"
            );
            const today = DateTime.now().startOf("day");
            const yesterday = DateTime.now()
              .minus({
                day: 1
              })
              .startOf("day");
            const allMessagesThisYear =
              newest.hasSame(today, "year") && oldest.hasSame(today, "year");

            const allMessagesSameDay = (newest || oldest).hasSame(
              oldest,
              "day"
            );
            if (allMessagesSameDay) {
              if (newest.hasSame(today, "day")) {
                return "Today";
              }
              if (newest.hasSame(yesterday, "day")) {
                return "Yesterday";
              }
              return allMessagesThisYear
                ? // August 13
                  newest.toFormat("LLLL d")
                : // August 13, 2017
                  newest.toLocaleString(DateTime.DATE_FULL);
            }

            const allMessagesSameMonth = newest.hasSame(oldest, "month");
            if (allMessagesSameMonth) {
              const firstDay = oldest.toFormat("d");
              const lastDay = newest.toFormat("d");
              const month = (newest || oldest).toFormat("LLLL");
              if (allMessagesThisYear) {
                // August 13 - 27
                return `${month} ${firstDay} - ${lastDay}`;
              }
              const year = newest.toFormat("y");
              // August 13 - 27, 2020
              return `${month} ${firstDay} - ${lastDay}, ${year}`;
            }

            if (allMessagesThisYear) {
              const firstDay = oldest.toFormat("d");
              const lastDay = newest.toFormat("d");
              const firstMonth = oldest.toFormat("LLLL");
              const lastMonth = newest.toFormat("LLLL");
              // January 12 - February 14
              return `${firstMonth} ${firstDay} - ${lastMonth} ${lastDay}`;
            }

            const firstDay = oldest.toFormat("d");
            const lastDay = newest.toFormat("d");
            const firstMonth = oldest.toFormat("LLLL");
            const lastMonth = newest.toFormat("LLLL");
            const firstYear = oldest.toFormat("y");
            const lastYear = newest.toFormat("y");
            // December 27, 2020 - January 2, 2021
            return `${firstMonth} ${firstDay}, ${firstYear} - ${lastMonth} ${lastDay}, ${lastYear}`;
          })()}
        </span>
      </div>

      {pendingReceivedRequest ? (
        <div className="chat-permission-bar">
          <p className="chat-permission-bar-title unselectable">
            {contactName} has sent you a chat request!
          </p>
          <p className="chat-permission-bar-text">
            Once you accept the request, you'll be able to chat and send
            invoices to {contactName}
          </p>
          <div className="chat-permission-bar-actions unselectable">
            <div
              className="chat-permission-bar-action chat-permission-bar-action-accept"
              onClick={acceptRequest}
            >
              Accept
            </div>
            <div className="chat-permission-bar-action chat-permission-bar-action-decline">
              Decline
            </div>
          </div>
        </div>
      ) : pendingSentRequest ? (
        <div className="chat-permission-bar">
          <p className="chat-permission-bar-title">
            Your request has been sent to {contactName} successfully
          </p>
          <p className="chat-permission-bar-text unselectable">
            Once {contactName} accepts the request, you'll be able to chat with
            them
          </p>
        </div>
      ) : (
        <div className="chat-bottom-bar">
          <div className="chat-input-container">
            <div className="chat-input-btn unselectable">
              <img src={BitcoinLightning} alt="Menu" />
            </div>
            <TextArea
              className="chat-input"
              // @ts-expect-error
              type="text"
              enterKeyHint="send"
              onKeyPress={submitMessage}
              onChange={handleInputChange}
              value={message}
              height={20}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
