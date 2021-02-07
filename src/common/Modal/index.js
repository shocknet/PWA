import React from "react";
import classNames from "classnames";
import ModalContent from "./components/ModalContent/index.js";
import ModalTitle from "./components/ModalTitle";
import "./css/index.css";

const Modal = ({
  modalOpen = false,
  toggleModal,
  modalTitle = "",
  children,
  contentStyle = {}
}) => (
  <div className={classNames({ modal: true, "modal-open": modalOpen })}>
    <div className="modal-backdrop" onClick={toggleModal} />
    <div className="modal-container">
      <ModalTitle title={modalTitle} toggleModal={toggleModal} />
      <ModalContent style={contentStyle}>{children}</ModalContent>
    </div>
  </div>
);

export default Modal;
