import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "../../../../common/Modal";
import ModalSubmit from "../../../../common/Modal/components/ModalSubmit";
import InputGroup from "../../../../common/InputGroup";
import { sendTipPost } from "../../../../actions/FeedActions";
import Loader from "../../../../common/Loader";
import "./css/index.css";

const SendTipModal = ({ tipData, toggleOpen }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [tipSuccess, setTipSuccess] = useState(false);

  const onInputChange = useCallback(e => {
    if (e.target.name === "amount") {
      setAmount(e.target.value);
    }
  }, []);

  const submitTip = useCallback(
    async e => {
      e.preventDefault();
      try {
        setLoading(true);
        await dispatch(
          sendTipPost({
            amount,
            publicKey: tipData.publicKey,
            postId: tipData.postID
          })
        );
        setTipSuccess(true);
      } catch (err) {
        console.error(err);
        if (tipData) {
          const errorMessage = err.message;
          const responseError = err.response?.data?.errorMessage;
          setError(responseError ?? errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [dispatch, amount, tipData]
  );

  // Reset the modal's state
  useEffect(() => {
    if (!tipData) {
      setLoading(false);
      setError(null);
      setTipSuccess(false);
    }
  }, [tipData]);

  return (
    <Modal toggleModal={toggleOpen} modalOpen={!!tipData} modalTitle="Send Tip">
      {tipSuccess ? (
        <div className="tip-modal-success">
          <i className="tip-success-icon fas fa-check-circle"></i>
          <p className="tip-success-title">Post tipped successfully!</p>
          <p className="tip-success-desc">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt
            ratione repudiandae voluptates debitis esse ea ut molestiae
            praesentium possimus quia
          </p>
        </div>
      ) : (
        <form className="modal-form tip-form" onSubmit={submitTip}>
          {error ? <div className="form-error">{error}</div> : null}
          {loading ? <Loader overlay text="Sending Tip..." /> : null}
          <p className="tip-modal-desc">
            Please specify the amount of sats you'd like to tip this user with
            below and we'll generate an invoice for you to scan.
          </p>
          <InputGroup
            name="amount"
            onChange={onInputChange}
            value={amount}
            inputMode="decimal"
            small
          />
          <ModalSubmit text="SEND TIP" onClick={submitTip} />
        </form>
      )}
    </Modal>
  );
};

export default SendTipModal;
