import { memo, useCallback, useState } from "react";
import Modal from "../../../../common/Modal";
import InputGroup from "../../../../common/InputGroup";
import "./css/index.scoped.css";
import { openChannel } from "../../../../actions/WalletActions";
import { useDispatch } from "react-redux";
import Loader from "../../../../common/Loader";
import Pad from "../../../../common/Pad";
import { loadFeeRates } from "../../../../actions/FeesActions";

const AddChannelModal = ({ open = false, toggleModal }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [channelCapacity, setChannelCapacity] = useState("");
  const [pushAmount, setPushAmount] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState("");

  const onInputChange = useCallback(e => {
    const { name, value } = e.target;
    if (name === "publicKey") {
      setPublicKey(value);
    }

    if (name === "pushAmount") {
      setPushAmount(value);
    }

    if (name === "channelCapacity") {
      setChannelCapacity(value);
    }
  }, []);

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        await dispatch(loadFeeRates());
        await dispatch(openChannel({ publicKey, channelCapacity, pushAmount }));
        toggleModal();
      } catch (err) {
        setError(err?.errorMessage ?? err?.message);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, publicKey, channelCapacity, pushAmount, toggleModal]
  );

  return (
    <Modal
      toggleModal={toggleModal}
      modalOpen={open}
      modalTitle="OPEN CHANNEL"
      blueBtn={!loading && "OPEN"}
      onClickBlueBtn={onSubmit}
      noFullWidth
    >
      <form className="container m-1">
        {error ? <div className="form-error">{error}</div> : null}
        {loading ? <Loader overlay text="Adding Peer..." /> : null}
        <div className="inputs">
          <InputGroup
            onChange={onInputChange}
            name="publicKey"
            label="Node Public Key"
            value={publicKey}
            small
          />
          <Pad amt={16} />
          <InputGroup
            onChange={onInputChange}
            name="channelCapacity"
            label="Channel Capacity (sats)"
            value={channelCapacity}
            inputMode="number"
            small
          />
          <Pad amt={16} />
          <InputGroup
            onChange={onInputChange}
            name="pushAmount"
            label="Push Amount (sats)"
            value={pushAmount}
            inputMode="number"
            small
          />
          <Pad amt={16} />
        </div>
      </form>
    </Modal>
  );
};

export default memo(AddChannelModal);
