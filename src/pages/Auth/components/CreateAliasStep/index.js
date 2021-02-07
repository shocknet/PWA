import React from "react";

const CreateAliasStep = ({ onInputChange, hostIP }) => {
  return (
    <div className="auth-form-container">
      <p className="auth-form-container-title">Create new Wallet</p>
      <form className="auth-form">
        <input
          type="text"
          name="walletAlias"
          placeholder="New Wallet Alias"
          value={hostIP}
          onChange={onInputChange}
          className="input-field"
        />
        <input
          type="password"
          name="walletPassword"
          placeholder="New Wallet Password"
          value={hostIP}
          onChange={onInputChange}
          className="input-field"
        />
        <input
          type="password"
          name="confirmWalletPassword"
          placeholder="Confirm Wallet Password"
          value={hostIP}
          onChange={onInputChange}
          className="input-field"
        />
        <button className="submit-btn">Connect</button>
      </form>
    </div>
  );
};

export default CreateAliasStep;
