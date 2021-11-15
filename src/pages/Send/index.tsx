import  { useCallback, useState, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import Http from "../../utils/Http";
import SlidePay from "../../common/SlidePay";
import InputGroup from "../../common/InputGroup";
import ContactSearch from "../../common/ContactsSearch";
import DialogPageContainer from "../../common/DialogPageContainer";
import Suggestion from "../../common/ContactsSearch/components/Suggestion";
import Loader from "../../common/Loader";
import "./css/index.scoped.css";
import { isDesktop } from "../../utils/Platform";

interface properties {
  [key: string]: any;
}

interface LocationState {
  data?: {
    type: "btc" | "ln" | "keysend";
    address: string;
    amount: number;
    request: string;
  };
}

const SendPage = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();

  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("sats");
  const [contact, setContact] = useState<properties>({});
  const [error, setError] = useState("");
  const [, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const isDesktopDevice = useMemo(() => {
    return isDesktop();
  }, []);

  const onInputChange = useCallback(e => {
    if (e.target.name === "amount") {
      setAmount(e.target.value);
    }

    if (e.target.name === "description") {
      setDescription(e.target.value);
    }

    if (e.target.name === "unit") {
      setUnit(e.target.value);
    }
  }, []);

  const selectContact = useCallback(async contact => {
    console.log("selectContact:", contact);
    setLoading(true);
    setContact(contact);

    if (contact && contact.type === "invoice") {
      // Do invoice decoding
      const { data } = await Http.post("/api/lnd/decodePayReq", {
        payReq: contact.paymentRequest
      });

      const { decodedRequest } = data;

      setAmount(decodedRequest.num_satoshis);
      setUnit("sats");
      setDescription(decodedRequest.description);
    }

    setLoading(false);
  }, []);
  //effect for incoming redirects with data
  useEffect(() => {
    const { state: routerState } = location;

    // @ts-ignore
    if (routerState && routerState.data && routerState.data.type) {
      // @ts-ignore
      const { data } = routerState;
      switch (data.type) {
        case "btc": {
          selectContact({
            type: "btc",
            address: data.address
          });
          if (data.amount) {
            setAmount(data.amount);
          }
          break;
        }
        case "ln": {
          selectContact({
            type: "invoice",
            paymentRequest: data.request
          });
          break;
        }
        case "keysend": {
          selectContact({
            type: "keysend",
            dest: data.address
          });
          break;
        }
        default:
          break;
      }
      location.state = {};
    }
  }, [location, selectContact, setAmount]);
  const sendBTCPayment = useCallback(async () => {
    if (contact) {
      const { data: payment } = await Http.post("/api/lnd/sendcoins", {
        addr: contact.address,
        amount: amount
      });
      console.log(payment);
    }
  }, [amount, contact]);

  const sendLightningPayment = useCallback(async () => {
    if (contact) {
      const { data: payment } = await Http.post("/api/lnd/sendpayment", {
        dest: contact.dest,
        payreq: contact.paymentRequest,
        amt: contact.paymentRequest ? "0" : amount,
        feeLimit: amount * 0.006 + 10, // TODO: Hardcoded fees for now
        keysend: contact.type === "keysend"
      });
      console.log(payment);
    }
  }, [amount, contact]);

  const sendGunPayment = useCallback(async () => {
    if (contact) {
      await Http.post("/api/gun/sendpayment", {
        recipientPub: contact.pk,
        amount: Number(amount),
        feeLimit: amount * 0.006 + 10, // TODO: Hardcoded fees for now
        memo: description
      });
    }
  }, [amount, contact, description]);

  const onSubmit = useCallback(async () => {
    try {
      setError("");
      setPaymentLoading(true);

      if (contact?.type === "btc") {
        await sendBTCPayment();
      }

      if (["invoice", "keysend"].includes(contact?.type)) {
        await sendLightningPayment();
      }

      if (contact?.type === "contact") {
        await sendGunPayment();
      }
      history.push("/overview");
      setPaymentLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data.errorMessage ?? err.message);
      setPaymentLoading(false);
      throw err;
    }
  }, [contact, history, sendBTCPayment, sendGunPayment, sendLightningPayment]);

  return (
    <DialogPageContainer containerClassName="send-page" title="SEND">
      <div className="send-form-container">
        {paymentLoading ? (
          <Loader fullScreen overlay text="Processing Payment..." />
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        {!contact ? (
          <Link className="scan-qr-btn" to="/QRScanner">
            <i className="scan-qr-icon icon icon-solid-scan"></i>
            <p className="scan-qr-text">Scan QR</p>
          </Link>
        ) : null}
        {contact ? (
          <Suggestion
            selected
            contact={contact}
            selectContact={selectContact}
            style={undefined}
          />
        ) : (
          <ContactSearch
            selectContact={selectContact}
            features={["btc", "keysend", "contact", "invoice"]}
          />
        )}
        <div className="inputs-group">
          <InputGroup
            name="amount"
            label="Enter Amount"
            onChange={onInputChange}
            value={amount}
            disabled={contact?.type === "invoice"}
            inputMode="decimal"
          />
          <select
            name="unit"
            className="unit-dropdown"
            onChange={onInputChange}
            value={unit}
            disabled={contact?.type === "invoice"}
          >
            <option value="sats">sats</option>
            <option value="btc">BTC</option>
          </select>
        </div>
        <InputGroup
          name="description"
          label="Description"
          element="textarea"
          onChange={onInputChange}
          type="textarea"
          value={description}
          disabled={contact?.type === "invoice"}
        />
      </div>
      {isDesktopDevice && (
        <div className="w-100 flex-center m-b-3">
          <button
            disabled={!contact}
            onClick={onSubmit}
            className="shock-form-button-confirm"
          >
            SEND
          </button>
        </div>
      )}
      {!isDesktopDevice && (
        <SlidePay disabled={!contact} onSuccess={onSubmit} />
      )}
    </DialogPageContainer>
  );
};

export default SendPage;
