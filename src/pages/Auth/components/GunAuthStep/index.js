import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAuthMethod, setAuthStep } from "../../../../actions/AuthActions";

const GunAuthStep = ({ onInputChange, hostIP }) => {
  const dispatch = useDispatch();
  const chooseAnotherMethod = useCallback(() => {
    dispatch(setAuthMethod(null));
    dispatch(setAuthStep(null));
  }, [dispatch]);

  return (
    <div className="auth-form-container">
      <p className="auth-form-container-title">Login</p>
      <form className="auth-form">
        <input
          type="text"
          name="gunUsername"
          placeholder="Wallet Alias"
          value={hostIP}
          onChange={onInputChange}
          className="input-field"
        />
        <input
          type="password"
          name="gunPassword"
          placeholder="Wallet Password"
          value={hostIP}
          onChange={onInputChange}
          className="input-field"
        />
        <button className="submit-btn">Login</button>
        <p className="inline-link" onClick={chooseAnotherMethod}>
          Choose another method
        </p>
      </form>
    </div>
  );
};

export default GunAuthStep;
