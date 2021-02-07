import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import QRCode from "qrcode.react";
import Loader from "../../../../common/Loader";
import SlidePay from "../../../../common/SlidePay";
import Http from "../../../../utils/Http";
import "./css/index.css";
import Suggestion from "../../../../common/ContactsSearch/components/Suggestion";
import ContactsSearch from "../../../../common/ContactsSearch";

const InvoiceStep = ({
  amount = 0,
  description = "N/A",
  unit = "",
  prevStep
}) => {
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
        await Http.post(`/api/gun/requests`, {
          publicKey: contact.pk,
          initialMsg: "$$__SHOCKWALLET__INVOICE__" + paymentRequest
        });
      } catch (err) {
        setError(
          err?.response?.data.errorMessage ??
            err?.message ??
            "An unknown error has occurred"
        );
      } finally {
        setLoading(false);
      }
    }
  }, [contact, paymentRequest]);

  return (
    <div className="request-form-container">
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
            features={["contacts"]}
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
            "qr-code-mode": true,
            "lightning-active": lightningMode
          })}
          onClick={toggleLightningMode}
        >
          <p className="qr-code-switch-name qr-code-on-chain-switch">
            On-Chain
          </p>
          <div className="qr-code-switch">
            <div className="qr-code-switch-handle" />
          </div>
          <p className="qr-code-switch-name qr-code-lightning-switch">
            Lightning
          </p>
        </div>
      </div>
      <div className="copy-clipboard-btn" onClick={copyClipboard}>
        <i className="fas fa-copy"></i>
        <p className="copy-clipboard-btn-text">Copy to Clipboard</p>
      </div>
      <div className="invoice-details">
        <p className="invoice-details-change" onClick={prevStep}>
          Change
        </p>
        <div className="invoice-detail">
          <p className="invoice-detail-title">Amount</p>
          <p className="invoice-detail-value">
            {amount} {unit.toUpperCase()}
          </p>
        </div>
        <div className="invoice-detail">
          <p className="invoice-detail-title">Description</p>
          <p className="invoice-detail-value">{description}</p>
        </div>
      </div>
      {lightningMode ? (
        <SlidePay
          wrapperStyle={{
            padding: 0,
            marginTop: 23
          }}
          slideText="SLIDE TO SEND"
          onSuccess={sendInvoice}
          disabled={!contact}
        />
      ) : null}
    </div>
  );
};

export default InvoiceStep;
