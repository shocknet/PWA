// @ts-check
import { useCallback } from "react";
import classNames from "classnames";
import "./css/index.css";
import { useDispatch } from "react-redux";
import { openDrawer } from "../../actions/DrawerActions";
import ShockAvatar from "../ShockAvatar";
import { useSelector } from "../../store";

const MainNav = ({
  pageTitle,
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

  const gunPublicKey = useSelector(({ node }) => node.publicKey);

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
        <ShockAvatar disableOnlineRing height={40} publicKey={gunPublicKey} />
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
