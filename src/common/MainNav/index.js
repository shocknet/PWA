// @ts-check
import { useCallback } from "react";
/**
 * @typedef {import('react').RefCallback<HTMLElement>} DivRefCallback
 */
import classNames from "classnames";
import "./css/index.css";
import { useDispatch } from "react-redux";

import * as Utils from "../../utils";
import { openDrawer } from "../../actions/DrawerActions";
import ShockAvatar from "../ShockAvatar";
import { useSelector } from "../../store";

const MainNav = ({
  pageTitle,
  absolute = false,
  solid = false,
  enableBackButton = false,
  onHeight = Utils.EMPTY_FN
}) => {
  const dispatch = useDispatch();
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const open = useCallback(() => {
    dispatch(openDrawer());
  }, [dispatch]);

  const gunPublicKey = useSelector(({ node }) => node.publicKey);

  /** @type {DivRefCallback} */
  const divRefCb = useCallback(
    el => {
      // https://www.pluralsight.com/tech-blog/getting-size-and-position-of-an-element-in-react/
      if (!el) return;
      try {
        onHeight(el.getBoundingClientRect().height);
      } catch (e) {
        console.log(`Error inside onHeight mechanism in MainNav:`);
        console.log(e);
      }
    },
    [onHeight]
  );

  return (
    <div
      className={classNames({
        "main-nav-container": true,
        "main-nav-absolute": absolute,
        "main-nav-solid": solid
      })}
      ref={divRefCb}
    >
      {enableBackButton ? (
        <div className="main-nav-back" onClick={goBack}>
          <i className="icon icon-thin-back"></i>
        </div>
      ) : (
        <ShockAvatar height={40} publicKey={gunPublicKey} />
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
