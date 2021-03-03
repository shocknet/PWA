import React, { useCallback, useState } from "react";
import Modal from "../../../../common/Modal";
import InputGroup from "../../../../common/InputGroup";
import "./css/index.css";
import { connectPeer } from "../../../../actions/WalletActions";
import { useDispatch } from "react-redux";
import Loader from "../../../../common/Loader";

const AddPeerModal = ({ open = false, toggleModal }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [host, setHost] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState("");

  const onInputChange = useCallback(e => {
    const { name, value } = e.target;
    if (name === "publicKey") {
      setPublicKey(value);
    }

    if (name === "host") {
      setHost(value);
    }
  }, []);

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        await dispatch(connectPeer({ publicKey, host }));
        toggleModal();
      } catch (err) {
        setError(err?.errorMessage ?? err?.message);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, publicKey, host, toggleModal]
  );

  return (
    <Modal toggleModal={toggleModal} modalOpen={open} modalTitle="ADD PEER">
      <form className="modal-form" onSubmit={onSubmit}>
        {error ? <div className="form-error">{error}</div> : null}
        {loading ? <Loader overlay text="Adding Peer..." /> : null}
        <InputGroup
          onChange={onInputChange}
          name="publicKey"
          label="Public Key"
          value={publicKey}
          small
        />
        <InputGroup
          onChange={onInputChange}
          name="host"
          label="Host IP"
          value={host}
          small
        />
        <div className="modal-submit-container">
          <button className="modal-submit-btn" type="submit">
            ADD PEER
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPeerModal;
