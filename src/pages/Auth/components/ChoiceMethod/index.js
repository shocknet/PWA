import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAuthMethod } from "../../../../actions/AuthActions";
import "./css/index.css";

const ChoiceMethod = ({ icon, details, method }) => {
  const dispatch = useDispatch();
  const chooseMethod = useCallback(() => {
    dispatch(setAuthMethod(method));
  }, [dispatch, method]);

  return (
    <div className="choice-container" onClick={chooseMethod}>
      <div className="choice-icon-container">
        <i className={`choice-icon fas fa-${icon}`} />
      </div>
      <p className="choice-info">{details}</p>
    </div>
  );
};

export default ChoiceMethod;
