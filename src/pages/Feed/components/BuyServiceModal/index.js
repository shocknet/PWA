import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "../../../../common/Modal";
import ModalSubmit from "../../../../common/Modal/components/ModalSubmit";
import { buyService } from "../../../../actions/OrdersActions";
import {
  addAvailableToken,
  addStreamToken
} from "../../../../actions/ContentActions";
import Loader from "../../../../common/Loader";
import "./css/index.scoped.css";

const BuyServiceModal = ({ service, toggleOpen }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [buySuccess, setBuySuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  const submitBuy = useCallback(
    async e => {
      e.preventDefault();
      try {
        const { servicePrice, owner, serviceID, serviceType } = service;
        if (!owner || !serviceID || typeof Number(servicePrice) !== "number") {
          console.error("invalid service provided");
          console.error(service);
          return;
        }
        setLoading(true);
        const revealRes = await buyService(
          owner,
          serviceID,
          servicePrice
        )(dispatch);
        console.log(revealRes);
        setBuySuccess(revealRes);
        if (serviceType === "torrentSeed") {
          addAvailableToken(revealRes.seedUrl, revealRes.tokens[0])(dispatch);
        }
        if (serviceType === "streamSeed") {
          addStreamToken(revealRes.seedUrl, revealRes.tokens[0])(dispatch);
        }
      } catch (err) {
        console.error(err);
        if (service) {
          const errorMessage = err.message;
          const responseError = err.response?.data?.errorMessage;
          setError(responseError ?? errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [dispatch, service]
  );

  // Reset the modal's state
  useEffect(() => {
    if (!service) {
      setLoading(false);
      setError(null);
      setBuySuccess(null);
    }
  }, [buySuccess]);
  const copyRes = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(buySuccess));
    setCopied(true);
  }, [buySuccess, setCopied]);
  return (
    <Modal
      toggleModal={toggleOpen}
      modalOpen={!!service}
      modalTitle="Buy Service"
    >
      {buySuccess ? (
        <div className="tip-modal-success">
          <i className="tip-success-icon fas fa-check-circle"></i>
          <p className="tip-success-title">
            You successfully bought this service!
          </p>
          <p>{JSON.stringify(buySuccess)}</p>
          <button onClick={copyRes}>COPY TO CLIPBOARD</button>
          {copied && <p>Copied!</p>}
          {/*<p className="tip-success-desc">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt
            ratione repudiandae voluptates debitis esse ea ut molestiae
            praesentium possimus quia
          </p>*/}
        </div>
      ) : (
        <form className="modal-form tip-form" onSubmit={submitBuy}>
          {error ? <div className="form-error">{error}</div> : null}
          {loading ? <Loader overlay text="Sending Tip..." /> : null}
          <p className="tip-modal-desc">
            {service && service.servicePrice} sats will be sent to the owner of
            the service provider
          </p>
          <ModalSubmit text="BUY" onClick={submitBuy} />
        </form>
      )}
    </Modal>
  );
};

export default BuyServiceModal;
