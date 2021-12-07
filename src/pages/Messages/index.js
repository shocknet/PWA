import React, { memo, useCallback, useEffect, useState } from "react";

import {
  sendHandshakeRequest,
  subCurrentHandshakeAddress,
  subHandshakeNode,
  subConvos
} from "../../actions/ChatActions";
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
import QRCodeScanner from "../../common/QRCodeScanner";
import * as Utils from "../../utils";

const MessagesPage = () => {
  const dispatch = Utils.useDispatch();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendRequestLoading, setSendRequestLoading] = useState(false);
  const convos = Store.useSelector(Store.selectConvos);
  const sentRequests = Utils.EMPTY_ARR;
  const receivedRequests = Store.useSelector(Store.selectReceivedRequests);
  const [scanQR, setScanQR] = useState(false);
  const currentHandshakeAddress = Store.useSelector(
    Store.selectCurrentHandshakeAddress
  );

  useEffect(() => {
    const sub = dispatch(subCurrentHandshakeAddress());

    return () => {
      sub.then(sub => sub.off());
    };
  }, [dispatch]);

  useEffect(() => {
    const sub = dispatch(subHandshakeNode(currentHandshakeAddress));

    return () => {
      sub.then(sub => sub.off());
    };
  }, [currentHandshakeAddress, dispatch]);

  useEffect(() => {
    const subscription = dispatch(subConvos());

    return () => {
      subscription.then(sub => sub.off());
    };
  });

  useEffect(() => {
    const subscriptions = convos.map(convo =>
      dispatch(subscribeUserProfile(convo.with))
    );

    subscriptions.push(
      ...receivedRequests.map(req => dispatch(subscribeUserProfile(req.from)))
    );

    return () => {
      subscriptions.map(unsubscribe => unsubscribe());
    };
  }, [convos, dispatch, receivedRequests]);

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
    async input => {
      if (!input) {
        return;
      }
      try {
        let shockUser = input;
        if (input.startsWith("https://")) {
          const splitted = input.split("/");
          shockUser = splitted[splitted.length - 1];
        }
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

  const openQR = useCallback(() => {
    setScanQR(true);
  }, [setScanQR]);

  const closeQR = useCallback(() => {
    setScanQR(false);
  }, [setScanQR]);

  const scanErr = useCallback(
    e => {
      console.log(e);
      setSendError(e.message);
    },
    [setSendError]
  );

  const scanDone = useCallback(
    content => {
      if (!content || !content.text) {
        return;
      }
      sendRequest(content.text);
      setScanQR(false);
      console.log(content.text);
    },
    [sendRequest, setScanQR]
  );

  if (scanQR) {
    return (
      <div>
        <QRCodeScanner
          mode="invoice"
          onClose={closeQR}
          onError={scanErr}
          onScan={scanDone}
        />
      </div>
    );
  }
  console.log(sendError);
  return (
    <div className="page-container messages-page">
      <MainNav solid pageTitle="MESSAGES" />
      <div className="messages-container">
        <div className="message-list-container no-scrollbar">
          {sentRequests.length > 0 ? (
            <p className="messages-section-title">Sent Requests</p>
          ) : null}
          {sentRequests.map(request => (
            <Request
              publicKey={request.pk}
              sent
              key={request.id}
              time={undefined}
              id={request.id}
            />
          ))}
          {receivedRequests.length > 0 ? (
            <p className="messages-section-title">Received Requests</p>
          ) : null}
          {receivedRequests.map(request => (
            <Request
              publicKey={request.from}
              key={request.id}
              sent={false}
              time={undefined}
              id={request.id}
            />
          ))}
          {convos.length > 0 ? (
            <p className="messages-section-title">Messages</p>
          ) : null}
          {convos.map(convo => {
            return <Message key={convo.id} id={convo.id} />;
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
            <div className="send-request-card" onClick={openQR}>
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

export default memo(MessagesPage);
