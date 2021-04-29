import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAuthMethod } from "../../../../actions/AuthActions";
import "./css/index.scoped.css";

const ChoiceMethod = ({ icon, details, method }) => {
  const dispatch = useDispatch();
  const chooseMethod = useCallback(() => {
    dispatch(setAuthMethod(method));
  }, [dispatch, method]);

  return (
    <div className="container" onClick={chooseMethod}>
      <div className="icon-container">
        <i className={`icon fas fa-${icon}`} />
      </div>
      <p className="info">{details}</p>
    </div>
  );
};

export default ChoiceMethod;
