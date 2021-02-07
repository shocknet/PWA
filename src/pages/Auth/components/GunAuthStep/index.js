import React from "react";

const GunAuthStep = ({ onInputChange, hostIP }) => {
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
      </form>
    </div>
  );
};

export default GunAuthStep;
