import { useCallback, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
import classNames from "classnames";
import QRCode from "qrcode.react";
import { useDispatch } from "react-redux";

import * as Utils from "../../../../utils";

import Loader from "../../../../common/Loader";
import SlidePay from "../../../../common/SlidePay";
import Http from "../../../../utils/Http";
import Suggestion from "../../../../common/ContactsSearch/components/Suggestion";
import ContactsSearch from "../../../../common/ContactsSearch";
import { sendMessage } from "../../../../actions/ChatActions";
import * as gStyles from "../../../../styles";

import "./css/index.css";

const InvoiceStep = ({
  amount = 0,
  description = "N/A",
  unit = "",
  prevStep
}) => {
  const isMounted = Utils.useIsMounted();
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

      if (isMounted.current) {
        setPaymentRequest(invoice.payment_request);
      }
    } catch (err) {
      setError(
        err?.response?.data.errorMessage ?? "An unknown error has occurred"
      );
    } finally {
      if (isMounted.current) {
        setQRLoading(false);
      }
    }
  }, [amount, description, isMounted]);

  const generateAddress = useCallback(async () => {
    try {
      setQRLoading(true);
      const { data } = await Http.post("/api/lnd/newaddress", {
        type: "p2wkh"
      });

      if (isMounted.current) {
        setAddress(data.address);
      }
    } catch (err) {
      setError(
        err?.response?.data.errorMessage ?? "An unknown error has occurred"
      );
    } finally {
      if (isMounted.current) {
        setQRLoading(false);
      }
    }
  }, [isMounted]);

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

  /** @type {import('react').MutableRefObject<HTMLInputElement|null>} */
  const placeholderInputRef = useRef();

  const copyClipboard = useCallback(() => {
    try {
      const txtToCopy = lightningMode ? paymentRequest : address;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(txtToCopy);
      } else {
        const { current: el } = placeholderInputRef;
        if (!el) {
          throw new ReferenceError(
            `When trying to access the ref for the placeholder input to copy, the ref was null.`
          );
        }

        el.style.display = "block";
        el.select();
        document.execCommand("copy");
        el.blur();
        el.style.display = "none";
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
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
  }, [contact, paymentRequest, dispatch, history]);

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

      {navigator.clipboard && (
        <input
          className={gStyles.hiddenInput}
          readOnly
          ref={placeholderInputRef}
          type="text"
          value={lightningMode ? paymentRequest : address}
        />
      )}

      {error ? (
        <>
          <span>{error}</span>

          <br />

          <span className="inline-link" onClick={setError.bind(null, "")}>
            Dismiss
          </span>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default InvoiceStep;
