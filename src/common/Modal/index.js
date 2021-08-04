import { useCallback } from "react";
import classNames from "classnames";

import * as Utils from "../../utils";

import ModalContent from "./components/ModalContent";
import ModalTitle from "./components/ModalTitle";
import "./css/index.scoped.css";

const Modal = ({
  modalOpen = false,
  toggleModal,
  modalTitle = "",
  children,
  contentStyle = {},
  disableBackdropClose = false,
  forceRenderTitleBar = false,
  hideXBtn = false,
  noFullWidth = false,
  blueBtn = "",
  disableBlueBtn = false,
  onClickBlueBtn = Utils.EMPTY_FN
}) => {
  const closeModal = useCallback(() => {
    toggleModal();
  }, [toggleModal]);
  const handleBackdropClick = useCallback(() => {
    if (!disableBackdropClose) {
      toggleModal();
    }
  }, [disableBackdropClose, toggleModal]);
  return (
    <div className={classNames({ modal: true, open: modalOpen })}>
      <div className="backdrop" onClick={handleBackdropClick} />
      <div
        className={classNames({
          container: true,
          "container-no-full-width": noFullWidth
        })}
      >
        <ModalTitle
          title={modalTitle}
          toggleModal={closeModal}
          forceRenderTitleBar={forceRenderTitleBar}
          hideXBtn={hideXBtn}
        />
        <ModalContent style={contentStyle}>{children}</ModalContent>

        {blueBtn && (
          <button
            disabled={disableBlueBtn}
            className="submit-btn"
            onClick={onClickBlueBtn}
          >
            {blueBtn}
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
