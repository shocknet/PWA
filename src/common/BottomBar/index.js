import { memo } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "../../store";

const BottomBar = () => {
  const authenticated = useSelector(({ node }) => node.authToken);

  if (!authenticated) {
    return null;
  }

  return (
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
};

export default memo(BottomBar);
