// @ts-check
import { useCallback } from "react";
import classNames from "classnames";
import "./css/index.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/AuthActions";
import { closeDrawer } from "../../actions/DrawerActions";
import * as Store from "../../store";

const Drawer = () => {
  const dispatch = useDispatch();
  const open = Store.useSelector(({ drawer }) => drawer.open);
  const close = useCallback(() => {
    dispatch(closeDrawer());
  }, [dispatch]);
  const onClickLogout = useCallback(() => {
    if (window.confirm("Are you sure you wish to log out?")) {
      dispatch(logout());
      dispatch(closeDrawer());
    }
  }, [dispatch]);

  const onClickScan = useCallback(() => {}, []);

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
          {/* <div className="drawer-item">
            <div className="drawer-item-icon">
              <i className="icon-solid-wallet"></i>
            </div>
            <p className="drawer-item-title unselectable">Spending Rules</p>
          </div> */}
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

        <div className="drawer-logout-and-scan">
          <i
            onClick={onClickScan}
            className="icon-solid-scan"
            style={{ color: "var(--main-blue)" }}
          ></i>

          <i
            onClick={onClickLogout}
            className="fas fa-power-off"
            style={{ color: "var(--main-blue)" }}
          ></i>
        </div>
      </div>
    </>
  );
};

export default Drawer;
