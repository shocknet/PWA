import React from "react";
import shockLogo from "../../../../images/shocklogo-dark.png";
import "./css/index.scoped.css";

const LogoSection = () => (
  <div className="auth-logo-header">
    <img className="auth-logo" src={shockLogo} alt="Lightning.Page Logo" />
  </div>
);

export default LogoSection;
