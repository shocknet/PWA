import React, { useCallback } from "react";
import classNames from "classnames";
import "./css/index.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openDrawer } from "../../actions/DrawerActions";

const MainNav = ({
  pageTitle,
  avatar,
  absolute = false,
  solid = false,
  enableBackButton = false
}) => {
  const dispatch = useDispatch();
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const open = useCallback(() => {
    dispatch(openDrawer());
  }, [dispatch]);

  return (
    <div
      className={classNames({
        "main-nav-container": true,
        "main-nav-absolute": absolute,
        "main-nav-solid": solid
      })}
    >
      {enableBackButton ? (
        <div className="main-nav-back" onClick={goBack}>
          <i className="icon icon-thin-back"></i>
        </div>
      ) : (
        <Link
          to="/"
          className="main-nav-avatar"
          style={{
            backgroundImage: avatar ? `url(${avatar})` : null
          }}
        />
      )}
      <p className="main-nav-title unselectable">{pageTitle}</p>
      <div className="main-nav-menu-btn" onClick={open}>
        <div className="main-nav-menu-dash" />
        <div className="main-nav-menu-dash" />
        <div className="main-nav-menu-dash" />
      </div>
    </div>
  );
};

export default MainNav;
