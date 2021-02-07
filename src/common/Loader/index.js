import React from "react";
import classNames from "classnames";
import "./css/index.css";

const Loader = ({
  text = "Loading...",
  fullScreen = false,
  small = false,
  overlay = false,
  overlayBackground = "rgba(44, 51, 58, 0.95)",
  style = {}
}) => {
  const fullScreenStyles = fullScreen
    ? { height: "100vh", marginBottom: 0 }
    : {};
  const overlayStyles = overlay
    ? {
        backgroundColor: overlayBackground
      }
    : {};
  return (
    <div
      className={classNames({
        "loading-wall": true,
        "loading-small": small,
        "loading-overlay": overlay
      })}
      style={{
        ...fullScreenStyles,
        ...overlayStyles,
        ...style
      }}
    >
      <div className="loading-wall-icon">
        <span className="loading-circle loading-circle-1"></span>
        <span className="loading-circle loading-circle-2"></span>
        <span className="loading-circle loading-circle-3"></span>
        {!small ? (
          <>
            <span className="loading-circle loading-circle-4"></span>
            <span className="loading-circle loading-circle-5"></span>
          </>
        ) : null}
      </div>
      {text ? <div className="loading-wall-text">{text}</div> : null}
    </div>
  );
};

export default Loader;
