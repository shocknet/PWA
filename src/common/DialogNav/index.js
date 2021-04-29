// @ts-check
import { useCallback } from "react";
import classNames from "classnames";
/**
 * @typedef {import('react').RefCallback<HTMLElement>} DivRefCallback
 */

import * as Utils from "../../utils";

import "./css/index.scoped.css";

export const DIALOG_NAV_MIN_HEIGHT_PX = 73;
/** @type {import('react').CSSProperties} */
const CONTAINER_STYLE = {
  minHeight: DIALOG_NAV_MIN_HEIGHT_PX
};

const DialogNav = ({
  pageTitle,
  drawerVisible = false,
  onHeight = Utils.EMPTY_FN
}) => {
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  /** @type {DivRefCallback} */
  const divRefCb = useCallback(
    el => {
      // https://www.pluralsight.com/tech-blog/getting-size-and-position-of-an-element-in-react/
      if (!el) return;
      try {
        onHeight(el.getBoundingClientRect().height);
      } catch (e) {
        console.log(`Error inside onHeight mechanism in DialogNav:`);
        console.log(e);
      }
    },
    [onHeight]
  );

  return (
    <div
      className="dialog-nav-container"
      ref={divRefCb}
      style={CONTAINER_STYLE}
    >
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
