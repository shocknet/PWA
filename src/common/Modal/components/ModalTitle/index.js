import React from "react";
import "./css/index.scoped.css";

const ModalTitle = ({ title, toggleModal }) =>
  title ? (
    <div className="head">
      <p className="head-title">{title}</p>
      <div className="head-close" onClick={toggleModal}>
        <i className="fas fa-times"></i>
      </div>
    </div>
  ) : null;

export default ModalTitle;
