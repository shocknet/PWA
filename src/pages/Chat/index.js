// @ts-check
import { useCallback, useEffect, useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import TextArea from "react-textarea-autosize";
import classNames from "classnames";
import { DateTime } from "luxon";
import produce, { enableMapSet } from "immer";
import * as Common from "shock-common";

import MainNav from "../../common/MainNav";
import WithHeight from "../../common/WithHeight";
import ChatMessage from "./components/ChatMessage";
import Loader from "../../common/Loader";
import {
  acceptHandshakeRequest,
  sendMessage,
  subConvoMessages,
  subConvos
} from "../../actions/ChatActions";
import BitcoinLightning from "../../images/bitcoin-lightning.svg";
import "./css/index.scoped.css";
import * as Store from "../../store";
import * as Utils from "../../utils";
import * as gStyles from "../../styles";
import * as Schema from "../../schema";
/**
 * @typedef {import('../../schema').ReceivedRequest} ReceivedRequest
 * @typedef {import('../../schema').Contact} Contact
 */

import ChatBottomBar from "./components/ChatActionBar";

enableMapSet();

/**
 * @typedef {object} ChatPageParams
 * @prop {string} convoOrReqID
 */

const ChatPage = () => {
  const history = useHistory();
  const dispatch = Utils.useDispatch();
  const params = /** @type {ChatPageParams} */ (useParams());
  const { convoOrReqID } = params;
  const convoOrReq = Store.useSelector(Store.selectCommunication(convoOrReqID));
  const isConvo = Schema.isConvo(convoOrReq);
  const isReq = Schema.isHandshakeReqNew(convoOrReq);
  const selfPublicKey = Store.useSelector(Store.selectSelfPublicKey);
  const [isAccepting, toggleIsAccepting] = Utils.useBooleanState(false);
  const otherPublicKey = (() => {
    if (Schema.isConvo(convoOrReq)) {
      return convoOrReq.with;
    }
    if (Schema.isHandshakeReqNew(convoOrReq)) {
      return convoOrReq.from;
    }
    return ""; // was deleted
  })();
  const convos = Store.useSelector(Store.selectConvos);
  useEffect(() => {
    if (!convoOrReq) {
      history.replace("/chat");
    }
  }, [convoOrReq, history]);
  useEffect(() => {
    const subscription = dispatch(subConvos());

    return () => {
      subscription.then(sub => sub.off());
    };
  }, [dispatch]);
  useEffect(() => {
    if (Schema.isHandshakeReqNew(convoOrReq)) {
      const convoExists = convos.find(
        convo => convo.id === convoOrReq.receiverConvoID
      );
      if (convoExists) {
        history.replace(`/chat/${convoOrReq.receiverConvoID}`);
      }
    }
  }, [convoOrReq, convos, history]);
  const user = Store.useSelector(Store.selectUser(otherPublicKey));
  const { publicKey: recipientPublicKey } = user;
  const [message, setMessage] = useState("");
  const [bottomBarHeight, setBottomBarHeight] = useState(20);

  /* ------------------------------------------------------------------------ */
  //#region dateBubble
  const [shouldShowDateBubble, setShouldShowDateBubble] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(-1);
  const chatDateBubbleContainerStyle = useMemo(
    () => ({
      top: headerHeight + 8 + "px"
    }),
    [headerHeight]
  );

  const handleHeaderHeight = useCallback((/** @type {number} */ height) => {
    setHeaderHeight(height);
  }, []);

  const handleScroll = useCallback(() => {
    if (!shouldShowDateBubble) {
      setShouldShowDateBubble(true);
      setTimeout(() => {
        setShouldShowDateBubble(false);
      }, 1500);
    }
  }, [shouldShowDateBubble]);
  //#endregion dateBubble
  /* ------------------------------------------------------------------------ */
  //#region actionMenu
  const [actionMenuOpen, toggleActionMenu] = Utils.useBooleanState(false);

  const actionMenuStyle = useMemo(
    () => ({
      bottom: bottomBarHeight
    }),
    [bottomBarHeight]
  );

  const [isDisconnecting, toggleIsDisconnecting] = Utils.useBooleanState(false);
  const handleDisconnect = useCallback(() => {
    toggleActionMenu();
    toggleIsDisconnecting();
    Utils.Http.delete(`/api/gun/chats/${recipientPublicKey}`)
      .then(() => {
        history.goBack();
      })
      .catch(e => {
        Utils.logger.error(`Error when trying to disconnect public key:`, e);
        alert(e.message);
      })
      .finally(toggleIsDisconnecting);
  }, [history, recipientPublicKey, toggleActionMenu, toggleIsDisconnecting]);
  //#endregion actionMenu
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (isConvo) {
      return dispatch(subConvoMessages(convoOrReqID));
    }
    return Utils.EMPTY_FN;
  }, [convoOrReqID, dispatch, isConvo]);
  const messages = Store.useSelector(state => {
    if (isConvo) {
      return Store.selectConvoMessages(convoOrReqID)(state);
    }
    return [];
  });
  const messagesWithoutInitial = useMemo(
    () => messages.filter(msg => msg.body !== Common.INITIAL_MSG),
    [messages]
  );
  // At least the initial message should be there.
  const otherUserAccepted = useMemo(
    () => messages.some(msg => msg.state === "received"),
    [messages]
  );

  const receivedRequest = Store.useSelector(({ chat }) =>
    Object.values(chat.receivedRequests).find(
      req => req.from === recipientPublicKey
    )
  );

  const handleInputChange = useCallback(e => {
    setMessage(e.target.value);
  }, []);

  const acceptRequest = useCallback(() => {
    console.log(receivedRequest);
    if (receivedRequest) {
      toggleIsAccepting();
      dispatch(acceptHandshakeRequest(receivedRequest.id))
        .catch(e => {
          Utils.logger.error(`Could not accept request -> `, e);
          alert(`Could not accept request: ${e.message}`);
        })
        .finally(toggleIsAccepting);
    }
  }, [receivedRequest, toggleIsAccepting, dispatch]);

  const submitMessage = useCallback(
    e => {
      if (e.key === "Enter" && e.ctrlKey) {
        setMessage(message + "\r\n");
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        dispatch(sendMessage(convoOrReqID, message));
        setMessage("");
        return;
      }
    },
    [message, dispatch, convoOrReqID]
  );

  // useEffect(() => {
  //   const subscription = dispatch(
  //     subscribeChatMessages(gunPublicKey, recipientPublicKey)
  //   );

  //   return () => {
  //     subscription.then(sub => sub.off());
  //   };
  // }, [dispatch, gunPublicKey, recipientPublicKey]);

  // ------------------------------------------------------------------------ //
  // Date bubble

  const [visibleMessages, setVisibleMessages] = useState(
    /** @type {Set<string>} */ (new Set())
  );

  const [newestTimestampInView, oldestTimestampInView] = useMemo(() => {
    const sorted = Array.from(visibleMessages)
      .map(id => messages.find(msg => msg.id === id))
      .filter(x => !!x)
      .sort((a, b) => b.timestamp - a.timestamp);

    if (sorted.length === 0) {
      return [DateTime.now().valueOf(), Date.now().valueOf()];
    }
    if (sorted.length === 1) {
      const [msg] = sorted;
      return [msg.timestamp, msg.timestamp];
    }

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

      <div
        className="chat-messages-container no-scrollbar"
        onClick={actionMenuOpen ? toggleActionMenu : undefined}
        onScroll={handleScroll}
      >
        {messagesWithoutInitial.map(message => (
          <ChatMessage
            text={message.body}
            receivedMessage={message.state === "received"}
            publicKey={
              message.state === "received" ? recipientPublicKey : selfPublicKey
            }
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

      {isAccepting && <Loader text="Accepting request..." />}

      {isReq && !isAccepting && (
        <ChatBottomBar
          text={`Once you accept the request, you'll be able to chat and send
         invoices to ${contactName}`}
          title={`${contactName} has sent you a chat request!`}
          onAccept={acceptRequest}
        />
      )}

      {isConvo && !otherUserAccepted && (
        <ChatBottomBar
          text={`Once ${contactName} accepts the request, you'll be able to chat with
        them`}
          title={`Your request has been sent to ${contactName} successfully`}
        />
      )}

      {/* {isContact &&
        userToIncoming[recipientPublicKey] === Schema.DID_DISCONNECT && (
          <ChatBottomBar
            acceptLabel="Delete"
            text="Delete this chat?"
            title="Other user disconnected"
            onAccept={handleDisconnect}
          />
        )} */}

      {isConvo && (
        <WithHeight
          className="chat-bottom-bar"
          onHeight={setBottomBarHeight}
          onClick={actionMenuOpen ? toggleActionMenu : undefined}
        >
          <div className="chat-input-container">
            <div
              className="chat-input-btn unselectable"
              onClick={toggleActionMenu}
            >
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
        </WithHeight>
      )}

      <div
        className={classNames("action-menu", {
          [gStyles.displayNone]: !actionMenuOpen
        })}
        style={actionMenuStyle}
      >
        <span
          className={classNames("action", gStyles.unselectable)}
          onClick={handleDisconnect}
        >
          Disconnect
        </span>
      </div>

      {isDisconnecting && <Loader overlay fullScreen text="Disconnecting..." />}
    </div>
  );
};

export default ChatPage;
