// @ts-check
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextArea from "react-textarea-autosize";
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
import { getContact } from "../../utils";
/**
 * @typedef {import('../../schema').ReceivedRequest} ReceivedRequest
 */

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

    return async () => {
      const resolvedSubscription = await subscription;
      // @ts-expect-error Until thunks are better typed and also dispatch is
      // this will throw
      resolvedSubscription?.close();
    };
  }, [dispatch, gunPublicKey, recipientPublicKey]);

  useEffect(() => {
    const unsubscribe = subscribeIncomingMessages();

    return () => {
      unsubscribe();
    };
  }, [subscribeIncomingMessages]);

  const contactName = user.displayName;

  return (
    <div className="page-container chat-page">
      <MainNav solid pageTitle={contactName} enableBackButton />
      <div className="chat-messages-container">
        {messages?.map(message => (
          <ChatMessage
            text={message.body}
            receivedMessage={!message.outgoing}
            publicKey={message.recipientPublicKey}
            timestamp={message.timestamp}
          />
        ))}
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
