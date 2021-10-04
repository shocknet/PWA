import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../../store";
import Modal from "../../../../common/Modal";
import ModalSubmit from "../../../../common/Modal/components/ModalSubmit";
import InputGroup from "../../../../common/InputGroup";
import { sendTipPost } from "../../../../actions/FeedActions";
import Loader from "../../../../common/Loader";
import "./css/index.scoped.css";

const SendTipModal = ({ tipData, toggleOpen }) => {
  const dispatch = useDispatch();
  const authenticated = useSelector(({ auth }) => auth.authenticated);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [tipSuccess, setTipSuccess] = useState(false);

  const onInputChange = useCallback(e => {
    if (e.target.name === "amount") {
      setAmount(e.target.value);
    }
  }, []);

  const submitTip = useCallback(
    async e => {
      e.preventDefault();
      if (loading) {
        return;
      }
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
    [dispatch, amount, loading, tipData]
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
    <Modal
      toggleModal={toggleOpen}
      modalOpen={tipData && authenticated}
      modalTitle="Send Tip"
      noFullWidth
    >
      {tipSuccess ? (
        <div className="tip-modal-success m-1">
          <i className="tip-success-icon fas fa-check-circle"></i>
          <p className="tip-success-title">Post tipped successfully!</p>
          <p className="tip-success-desc"></p>
        </div>
      ) : (
        <form className="modal-form tip-form m-1" onSubmit={submitTip}>
          {error ? <div className="form-error">{error}</div> : null}
          {loading ? <Loader overlay text="Sending Tip..." /> : null}
          <p className="tip-modal-desc m-1">
            Please specify the amount of sats you'd like to tip this user with
            below.
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
