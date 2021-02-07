import React, { useCallback } from "react";
import classNames from "classnames";
import "./css/index.css";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "../../actions/DrawerActions";

const Drawer = () => {
  const dispatch = useDispatch();
  const open = useSelector(({ drawer }) => drawer.open);
  const close = useCallback(() => {
    dispatch(closeDrawer());
  }, [dispatch]);

  return (
    <>
      <div
        className={classNames({
          "drawer-overlay": true,
          "drawer-overlay-open": open
        })}
        onClick={close}
      ></div>
      <div
        className={classNames({
          "drawer-container": true,
          "drawer-container-open": open
        })}
      >
        <div className="drawer-top-section">
          <div className="drawer-item">
            <div className="drawer-item-icon">
              <i className="icon-solid-wallet"></i>
            </div>
            <p className="drawer-item-title unselectable">Spending Rules</p>
          </div>
          {/* <div className="drawer-item">
        <div className="drawer-item-icon">
          <i className="icon-solid-spending-rule"></i>
        </div>
        <p className="drawer-item-title unselectable">Spending Rules</p>
      </div> */}
          <NavLink className="drawer-item" to="/advanced" onClick={close}>
            <div className="drawer-item-icon">
              <i className="icon-solid-spending-rule"></i>
            </div>
            <p className="drawer-item-title unselectable">Advanced Lightning</p>
          </NavLink>
          <div className="drawer-item">
            <div className="drawer-item-icon">
              <i className="icon-solid-key"></i>
            </div>
            <p className="drawer-item-title unselectable">Seed Backup</p>
          </div>
        </div>
        <div className="drawer-bottom-section">
          <div className="drawer-item">
            <div className="drawer-item-icon">
              <i className="icon-solid-help"></i>
            </div>
            <p className="drawer-item-title unselectable">Buy Bitcoins</p>
          </div>
          <div className="drawer-item">
            <div className="drawer-item-icon">
              <i className="icon-solid-help"></i>
            </div>
            <p className="drawer-item-title unselectable">Help</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
