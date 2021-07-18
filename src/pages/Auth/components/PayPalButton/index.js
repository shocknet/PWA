import React, { useCallback } from "react";
import ReactDOM from "react-dom"
import { useDispatch } from "react-redux";
import { setAuthMethod } from "../../../../actions/AuthActions";
import "./css/index.scoped.css";

const PayPalButton = ({ price,title,content,url }) => {
  const dispatch = useDispatch()
  const goToInvite = useCallback(()=>{
    dispatch(setAuthMethod("shockCloud"));
  },[dispatch])
  return (
    <a className="container" href={url} target="_blank" onClick={goToInvite}>
      <div className="info-container">
        <p>{price}</p>
      </div>
      <div className="vertical-flex">
        <div className="info">

        <p >{title}</p>
        <p >{content}</p>
        </div>
      </div>
    </a>
  );
};

export default PayPalButton;
