// @ts-check
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "../../../../common/Modal";
import ModalSubmit from "../../../../common/Modal/components/ModalSubmit";
import Loader from "../../../../common/Loader";
import "./css/index.scoped.css";
import { Http } from "../../../../utils";

const ShareModal = ({ shareData, toggleOpen }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitShare = useCallback(
    async e => {
      e.preventDefault();
      try {
        setLoading(true);
        const {postID:id,publicKey} = shareData
        const sharedPostRaw = {
          originalAuthor: publicKey,
          shareDate: Date.now(),
        }
        const {data} = await Http.post(`/api/gun/put`, {
          path: `$user>sharedPosts>${id}`,
          value: sharedPostRaw,
        })
        if(data.ok){
          setSuccess(true)
        } else {
          setError("Share operation failed")
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, shareData]
  );

  // Reset the modal's state
  useEffect(() => {
    if (!shareData) {
      setLoading(false);
      setError(null);
      setSuccess(false);
    }
  }, [shareData]);

  return (
    <Modal
      toggleModal={toggleOpen}
      modalOpen={!!shareData}
      modalTitle="Share post"
    >
      {success ? (
        <div className="tip-modal-success m-1">
          <i className="tip-success-icon fas fa-check-circle"></i>
          <p className="tip-success-title">Post shared successfully!</p>
        </div>
      ) : (
        <form className="modal-form tip-form m-1" onSubmit={submitShare}>
          {error ? <div className="form-error">{error}</div> : null}
          {loading ? <Loader overlay text="Sharing..." /> : null}
          <p className="tip-modal-desc m-1">
            This post will be shared on your profile
          </p>
          <ModalSubmit text="SHARE" onClick={submitShare} />
        </form>
      )}
    </Modal>
  );
};

export default ShareModal;
