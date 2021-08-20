import { useCallback, useEffect, useState } from "react";
import Modal from "../../../../common/Modal";
import Loader from "../../../../common/Loader";
import "./css/index.scoped.css";
import { Http } from "../../../../utils";

const ShareModal = ({ shareData, toggleOpen }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitShare = useCallback(
    async e => {
      e.preventDefault();
      if(loading){
        return
      }
      try {
        setLoading(true);
        const { postID: id, publicKey } = shareData;
        const sharedPostRaw = {
          originalAuthor: publicKey,
          shareDate: Date.now()
        };
        const { data } = await Http.post(`/api/gun/put`, {
          path: `$user>sharedPosts>${id}`,
          value: sharedPostRaw
        });
        if (data.ok) {
          setSuccess(true);
        } else {
          setError("Share operation failed");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [shareData,loading]
  );

  const close = useCallback(() => {
    toggleOpen(null);
  }, [toggleOpen]);

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
      blueBtn={
        (!loading && !error && !success && "SHARE") ||
        ((success || error) && "OK")
      }
      disableBlueBtn={loading}
      onClickBlueBtn={success || error ? close : submitShare}
      hideXBtn={success}
      noFullWidth
    >
      {success ? (
        <div className="tip-modal-success m-1">
          <i className="tip-success-icon fas fa-check-circle"></i>
          <p className="tip-success-title">Post shared successfully!</p>
        </div>
      ) : (
        <form className="modal-form tip-form m-1" onSubmit={submitShare}>
          {error ? <p className="form-error">{error}</p> : null}
          {error && <p className="tip-modal-desc m-1">You can try again.</p>}
          {loading ? <Loader text="Sharing..." /> : null}
          {!error && !loading && (
            <p className="tip-modal-desc m-1">
              This post will be shared on your profile
            </p>
          )}
        </form>
      )}
    </Modal>
  );
};

export default ShareModal;
