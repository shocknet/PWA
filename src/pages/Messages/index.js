// @ts-check
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DateTime } from "luxon";

import { loadChatData, sendHandshakeRequest } from "../../actions/ChatActions";
import { subscribeUserProfile } from "../../actions/UserProfilesActions";
import BottomBar from "../../common/BottomBar";
import Message from "./components/Message";
import Request from "./components/Request";
import MainNav from "../../common/MainNav";
import AddBtn from "../../common/AddBtn";
import Loader from "../../common/Loader";
import FieldError from "../../utils/FieldError";
import "./css/index.scoped.css";
import Modal from "../../common/Modal";
import * as Store from "../../store";

const MessagesPage = () => {
  const dispatch = useDispatch();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendRequestLoading, setSendRequestLoading] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const contacts = Store.useSelector(({ chat }) => chat.contacts);
  const messages = Store.useSelector(({ chat }) => chat.messages);
  const sentRequests = Store.useSelector(({ chat }) => chat.sentRequests);
  const receivedRequests = Store.useSelector(
    ({ chat }) => chat.receivedRequests
  );

  const loadChat = useCallback(async () => {
    await dispatch(loadChatData());
    setChatLoaded(true);
  }, [dispatch]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  useEffect(() => {
    const subscriptions = [
      ...contacts,
      ...sentRequests,
      ...receivedRequests
    ].map(entry => dispatch(subscribeUserProfile(entry.pk)));

    return () => {
      // @ts-ignore
      subscriptions.map(unsubscribe => unsubscribe());
    };
  }, [contacts, sentRequests, receivedRequests, dispatch]);

  const toggleModal = useCallback(() => {
    setAddModalOpen(!addModalOpen);
  }, [addModalOpen]);

  const sanitizePublicKey = publicKey => {
    if (publicKey.startsWith("http")) {
      const parts = publicKey.split("/");
      return parts.slice(-1)[0];
    }

    return publicKey;
  };

  const sendRequest = useCallback(
    async shockUser => {
      try {
        setSendError(null);
        setSendRequestLoading(true);
        const pk = sanitizePublicKey(shockUser);

        if (!pk?.length) {
          throw new FieldError({
            field: "publicKey",
            message: "Please specify a public key"
          });
        }

        if (!/^[0-9A-Za-z\-_.+/]+[=]{0,3}/.test(pk)) {
          throw new FieldError({
            field: "publicKey",
            message: "Invalid public key format specified"
          });
        }

        await dispatch(sendHandshakeRequest(shockUser));

        setAddModalOpen(false);
      } catch (err) {
        const errMsg =
          err instanceof FieldError
            ? err.message
            : "An unknown error has occurred";

        console.error(err);

        setSendError(errMsg);
      } finally {
        setSendRequestLoading(false);
      }
    },
    [dispatch]
  );

  const sendRequestClipboard = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      return sendRequest(clipboardText);
    } catch (e) {
      alert(e.message);
    }
  }, [sendRequest]);

  return (
    <div className="page-container messages-page">
      <MainNav solid pageTitle="MESSAGES" />
      <div className="messages-container">
        <div className="message-list-container">
          {sentRequests.length > 0 ? (
            <p className="messages-section-title">Sent Requests</p>
          ) : null}
          {sentRequests.map(request => (
            <Request
              publicKey={request.pk}
              sent
              key={request.pk}
              time={undefined}
            />
          ))}
          {receivedRequests.length > 0 ? (
            <p className="messages-section-title">Received Requests</p>
          ) : null}
          {receivedRequests.map(request => (
            <Request
              publicKey={request.pk}
              key={request.pk}
              sent={false}
              time={undefined}
            />
          ))}
          {contacts.length > 0 ? (
            <p className="messages-section-title">Messages</p>
          ) : null}
          {contacts.map(contact => {
            const contactMessages = messages[contact.pk] ?? [];
            const lastMessage = contactMessages[0] ?? {
              body: "Unable to preview last message...",
              timestamp: Date.now()
            };

            return (
              <Message
                key={contact.pk}
                publicKey={contact.pk}
                subtitle={lastMessage.body}
                time={DateTime.fromMillis(lastMessage.timestamp).toRelative()}
                chatLoaded={chatLoaded}
              />
            );
          })}
        </div>
        <AddBtn onClick={toggleModal} label="REQUEST" />
        {/* TODO: Extract to a separate component */}
        <Modal
          modalTitle="SEND REQUEST"
          toggleModal={toggleModal}
          modalOpen={addModalOpen}
        >
          {sendRequestLoading ? (
            <Loader
              text="Sending Request..."
              overlay
              style={{
                borderRadius: "0 0 15px 15px"
              }}
            />
          ) : null}
          {sendError ? (
            <div className="send-request-error">{sendError}</div>
          ) : null}
          <div className="send-request-cards">
            <div className="send-request-card" onClick={sendRequest}>
              <i className="send-request-card-icon fas fa-qrcode" />
              <p className="send-request-card-title">SCAN QR</p>
              <p className="send-request-card-desc">
                Scan another users QR to send a message request.
              </p>
            </div>
            <div className="send-request-card" onClick={sendRequestClipboard}>
              <i className="send-request-card-icon fas fa-clipboard" />
              <p className="send-request-card-title">PASTE CLIPBOARD</p>
              <p className="send-request-card-desc">
                Paste another users Public Key to send a message request.
              </p>
            </div>
          </div>
        </Modal>
      </div>
      <BottomBar />
    </div>
  );
};

export default MessagesPage;
