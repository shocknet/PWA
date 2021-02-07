import React from "react";
import "./css/index.css";

const ModalTitle = ({ title, toggleModal }) =>
  title ? (
    <div className="modal-head">
      <p className="modal-head-title">{title}</p>
      <div className="modal-head-close" onClick={toggleModal}>
        <i className="fas fa-times"></i>
      </div>
    </div>
  ) : null;

export default ModalTitle;
