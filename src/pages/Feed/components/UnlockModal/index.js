import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "../../../../common/Modal";
import ModalSubmit from "../../../../common/Modal/components/ModalSubmit";
import { unlockContent } from "../../../../actions/ContentActions";
import Loader from "../../../../common/Loader";
import "./css/index.css";

const UnlockModal = ({ unlockData, toggleOpen }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  const submitUnlock = useCallback(
    async e => {
      e.preventDefault();
      try {
        setLoading(true);
        await unlockContent(
          100,
          unlockData.publicKey,
          unlockData.postID
        )(dispatch);
        setUnlockSuccess(true);
      } catch (err) {
        console.error(err);
        if (unlockData) {
          const errorMessage = err.message;
          const responseError = err.response?.data?.errorMessage;
          setError(responseError ?? errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [dispatch, unlockData]
  );

  // Reset the modal's state
  useEffect(() => {
    if (!unlockData) {
      setLoading(false);
      setError(null);
      setUnlockSuccess(false);
    }
  }, [unlockData]);

  return (
    <Modal
      toggleModal={toggleOpen}
      modalOpen={!!unlockData}
      modalTitle="Unlock content"
    >
      {unlockSuccess ? (
        <div className="tip-modal-success">
          <i className="tip-success-icon fas fa-check-circle"></i>
          <p className="tip-success-title">Content unlocked successfully!</p>
          {/*<p className="tip-success-desc">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt
            ratione repudiandae voluptates debitis esse ea ut molestiae
            praesentium possimus quia
          </p>*/}
        </div>
      ) : (
        <form className="modal-form tip-form" onSubmit={submitUnlock}>
          {error ? <div className="form-error">{error}</div> : null}
          {loading ? <Loader overlay text="Sending Tip..." /> : null}
          <p className="tip-modal-desc">
            100 sats will be sent to the owner of the post to unlock the content
          </p>
          <ModalSubmit text="UNLOCK" onClick={submitUnlock} />
        </form>
      )}
    </Modal>
  );
};

export default UnlockModal;
