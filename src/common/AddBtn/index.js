import React from "react";
import classNames from "classnames";
import "./css/index.css";

const AddBtn = ({ label, icon, iconURL, onClick, large = false, style }) => (
  <div
    className={classNames({
      "add-btn-container": true,
      "add-btn-container-round": !label,
      "add-btn-container-extended": !!label,
      "add-btn-container-large": large
    })}
    onClick={onClick}
    style={style}
  >
    {iconURL ? (
      <img src={iconURL} className="add-btn-icon" />
    ) : (
      <i className={`fas fa-${icon ?? "plus"}`}></i>
    )}
    {label ? <p className="add-btn-label">{label}</p> : null}
  </div>
);

export default AddBtn;
