import React from "react";
import shockLogo from "../../../../images/shocklogo-dark.png";
import "./css/index.css";

const LogoSection = () => (
  <div className="auth-logo-header">
    <img className="auth-logo" src={shockLogo} alt="ShockWallet Logo" />
  </div>
);

export default LogoSection;
