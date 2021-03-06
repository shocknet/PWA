import React from "react";
import { NavLink } from "react-router-dom";

const BottomBar = () => (
  <div className="bottom-nav-container">
    <NavLink
      className="bottom-nav-btn"
      to="/overview"
      activeClassName="active-nav-btn"
    >
      <i className="bottom-nav-btn-icon icon-thin-wallet"></i>
    </NavLink>
    <NavLink
      className="bottom-nav-btn"
      to="/chat"
      activeClassName="active-nav-btn"
    >
      <i className="bottom-nav-btn-icon icon-thin-chat"></i>
    </NavLink>
    <NavLink
      className="bottom-nav-btn"
      to="/profile"
      activeClassName="active-nav-btn"
    >
      <i className="bottom-nav-btn-icon icon-thin-profile"></i>
    </NavLink>
    <NavLink
      className="bottom-nav-btn"
      to="/feed"
      activeClassName="active-nav-btn"
    >
      <i className="bottom-nav-btn-icon icon-thin-feed"></i>
    </NavLink>
  </div>
);

export default BottomBar;
