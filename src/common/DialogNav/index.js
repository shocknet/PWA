import { useCallback } from "react";
import classNames from "classnames";
import "./css/index.css";

const DialogNav = ({ pageTitle, drawerVisible = false }) => {
  const goBack = useCallback(() => {
    window.history.back();
  }, []);
  return (
    <div className="dialog-nav-container">
      <div className="dialog-nav-back" onClick={goBack}>
        <i className="icon icon-thin-back"></i>
      </div>
      <p className="dialog-nav-title">{pageTitle}</p>
      <div
        className={classNames({
          "dialog-nav-menu-btn": true,
          "dialog-nav-hidden": !drawerVisible
        })}
      >
        <div className="dialog-nav-menu-dash" />
        <div className="dialog-nav-menu-dash" />
        <div className="dialog-nav-menu-dash" />
      </div>
    </div>
  );
};

export default DialogNav;
