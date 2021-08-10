import { useCallback } from "react";
import classNames from "classnames";

import * as Utils from "../../utils";
import Loader from "../../common/Loader";

import ModalContent from "./components/ModalContent";
import ModalTitle from "./components/ModalTitle";

import "./css/index.scoped.css";

const Modal = ({
  modalOpen = false,
  toggleModal,
  modalTitle = "",
  children,
  contentStyle = Utils.EMPTY_OBJ,
  disableBackdropClose = false,
  forceRenderTitleBar = false,
  hideXBtn = false,
  noFullWidth = false,
  blueBtn = "",
  disableBlueBtn = false,
  onClickBlueBtn = Utils.EMPTY_FN,
  redBtn = "",
  disableRedBtn = false,
  onClickRedBtn = Utils.EMPTY_FN,
  contentClass = "",
  error = "",
  textIfLoading = ""
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
        {textIfLoading && (
          <Loader overlay style={OVERLAY_STYLE} text={textIfLoading} />
        )}

        <ModalTitle
          title={modalTitle}
          toggleModal={closeModal}
          forceRenderTitleBar={forceRenderTitleBar}
          hideXBtn={hideXBtn}
        />

        {error && <div className={"form-error form-error-margin"}>{error}</div>}

        <ModalContent style={contentStyle} contentClass={contentClass}>
          {typeof children === "string" ? (
            <p className="text-align-center">{children}</p>
          ) : (
            children
          )}
        </ModalContent>

        <div className="color-buttons">
          {blueBtn && (
            <button
              disabled={disableBlueBtn}
              className={classNames("color-btn", "blue-btn")}
              onClick={onClickBlueBtn}
            >
              {blueBtn}
            </button>
          )}

          {redBtn && (
            <button
              disabled={disableRedBtn}
              className={classNames("color-btn", "red-btn")}
              onClick={onClickRedBtn}
            >
              {redBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OVERLAY_STYLE = {
  borderRadius: "15px"
};

export default Modal;
