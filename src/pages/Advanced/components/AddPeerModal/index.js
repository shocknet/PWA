import React, { useCallback, useState } from "react";
import Modal from "../../../../common/Modal";
import InputGroup from "../../../../common/InputGroup";
import "./css/index.scoped.css";
import { connectPeer } from "../../../../actions/WalletActions";
import { useDispatch } from "react-redux";
import Pad from "../../../../common/Pad";

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

  React.useEffect(() => {
    setHost("");
    setLoading(false);
    setError("");
  }, [open]);

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      setError("");
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
    <Modal
      toggleModal={toggleModal}
      modalOpen={open}
      modalTitle="ADD PEER"
      blueBtn="Add Peer"
      onClickBlueBtn={onSubmit}
      noFullWidth
      error={error}
      contentClass="p-1"
      textIfLoading={loading && "Adding Peer..."}
    >
      <InputGroup
        onChange={onInputChange}
        name="publicKey"
        label="Public Key"
        value={publicKey}
        small
      />

      <Pad amt={16} />

      <InputGroup
        onChange={onInputChange}
        name="host"
        label="Host IP"
        value={host}
        small
      />
    </Modal>
  );
};

export default AddPeerModal;
