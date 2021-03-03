import React from "react";
import "./css/index.css";

const ModalSubmit = ({ text = "Submit", onClick }) => {
  return (
    <div className="modal-submit-btn" onClick={onClick}>
      <p className="modal-submit-btn-text">{text}</p>
    </div>
  );
};

export default ModalSubmit;
