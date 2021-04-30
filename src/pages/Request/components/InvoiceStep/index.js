import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import QRCode from "qrcode.react";
import { useDispatch } from "react-redux";
import Loader from "../../../../common/Loader";
import SlidePay from "../../../../common/SlidePay";
import Http from "../../../../utils/Http";
import "./css/index.scoped.css";
import Suggestion from "../../../../common/ContactsSearch/components/Suggestion";
import ContactsSearch from "../../../../common/ContactsSearch";
import { sendMessage } from "../../../../actions/ChatActions";
import { useHistory } from "react-router";

const InvoiceStep = ({
  amount = 0,
  description = "N/A",
  unit = "",
  prevStep
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [paymentRequest, setPaymentRequest] = useState("");
  const [address, setAddress] = useState("");
  const [QRLoading, setQRLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState();
  const [error, setError] = useState("");
  const [lightningMode, setLightningMode] = useState(false);

  const addInvoice = useCallback(async () => {
    try {
      setQRLoading(true);
      const { data: invoice } = await Http.post("/api/lnd/addinvoice", {
        value: amount,
        memo: description,
        expiry: 100
      });

      setPaymentRequest(invoice.payment_request);
    } catch (err) {
      setError(
        err?.response?.data.errorMessage ?? "An unknown error has occurred"
      );
    } finally {
      setQRLoading(false);
    }
  }, [amount, description]);

  const generateAddress = useCallback(async () => {
    try {
      setQRLoading(true);
      const { data } = await Http.post("/api/lnd/newaddress", {
        type: "p2wkh"
      });

      setAddress(data.address);
    } catch (err) {
      setError(
        err?.response?.data.errorMessage ?? "An unknown error has occurred"
      );
    } finally {
      setQRLoading(false);
    }
  }, []);

  const selectContact = useCallback(async contact => {
    setContact(contact);
  }, []);

  useEffect(() => {
    if (lightningMode) {
      addInvoice();
      return;
    }

    generateAddress();
  }, [addInvoice, generateAddress, lightningMode]);

  const toggleLightningMode = useCallback(() => {
    setLightningMode(!lightningMode);
  }, [lightningMode]);

  const copyClipboard = useCallback(() => {
    if (lightningMode) {
      navigator.clipboard.writeText(paymentRequest);
      return;
    }

    navigator.clipboard.writeText(address);
  }, [lightningMode, paymentRequest, address]);

  const sendInvoice = useCallback(async () => {
    if (contact) {
      try {
        setLoading(true);
        await sendMessage({
          publicKey: contact.pk,
          message: "$$__SHOCKWALLET__INVOICE__" + paymentRequest
        })(dispatch);
        setLoading(false);
        history.push("/overview");
      } catch (err) {
        setError(
          err?.response?.data.errorMessage ??
            err?.message ??
            "An unknown error has occurred"
        );
        setLoading(false);
      }
    }
  }, [contact, paymentRequest, history]);

  return (
    <div className="container">
      {loading ? <Loader overlay text="Sending Invoice..." /> : null}
      {lightningMode ? (
        contact ? (
          <Suggestion
            selected
            contact={contact}
            selectContact={selectContact}
          />
        ) : (
          <ContactsSearch
            selectContact={selectContact}
            features={["contact"]}
          />
        )
      ) : null}
      <div className="qr-code-container">
        <div className="qr-code">
          {QRLoading ? (
            <Loader overlay small text="" />
          ) : (
            <QRCode
              value={lightningMode ? paymentRequest : address}
              size={180}
              fgColor={lightningMode ? "#f5a623" : "#4285b9"}
              bgColor="#001220"
            />
          )}
        </div>
        <div
          className={classNames({
            mode: true,
            "lightning-active": lightningMode
          })}
          onClick={toggleLightningMode}
        >
          <p className="switch-name on-chain-switch">On-Chain</p>
          <div className="switch">
            <div className="switch-handle" />
          </div>
          <p className="switch-name lightning-switch">Lightning</p>
        </div>
      </div>
      <div className="copy-clipboard-btn" onClick={copyClipboard}>
        <i className="fas fa-copy"></i>
        <p className="copy-clipboard-btn-text">Copy to Clipboard</p>
      </div>
      <div className="details">
        <p className="details-change" onClick={prevStep}>
          Change
        </p>
        <div className="detail">
          <p className="detail-title">Amount</p>
          <p className="detail-value">
            {amount} {unit.toUpperCase()}
          </p>
        </div>
        <div className="detail">
          <p className="detail-title">Description</p>
          <p className="detail-value">{description}</p>
        </div>
      </div>
      {lightningMode && contact ? (
        <SlidePay
          wrapperStyle={{
            padding: 0,
            marginTop: 23
          }}
          slideText="SLIDE TO SEND"
          onSuccess={sendInvoice}
        />
      ) : null}
    </div>
  );
};

export default InvoiceStep;
