import { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import "./css/index.css";

const AddBtn = ({
  label,
  icon,
  iconURL,
  onClick,
  nestedMode = false,
  large = false,
  small = false,
  relative = false,
  index = 0,
  children = null,
  style = {}
}) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const toggleOptionsOpen = useCallback(() => {
    if (nestedMode) {
      setOptionsOpen(!optionsOpen);
    }
  }, [optionsOpen, nestedMode]);

  const iconElement = useMemo(() => {
    if (iconURL) {
      return <img src={iconURL} className="add-btn-icon" alt="" />;
    }

    return <i className={`fas fa-${icon ?? "plus"}`}></i>;
  }, [icon, iconURL]);

  const labelElement = useMemo(() => {
    if (label) {
      return <p className="add-btn-label">{label}</p>;
    }

    return null;
  }, [label]);

  return (
    <div
      className={classNames({
        "add-btn-container": true,
        "add-btn-round-container": !label,
        "add-btn-large": large,
        "add-btn-small": small
      })}
    >
      <div
        className={classNames({
          "add-btn": true,
          "add-btn-round": !label,
          "add-btn-extended": !!label,
          "add-btn-relative": relative,
          "add-btn-open": optionsOpen,
          "add-btn-nested": nestedMode
        })}
        onClick={onClick ?? toggleOptionsOpen}
        style={style}
      >
        {iconElement}
        {labelElement}
      </div>

      {children ? (
        <div
          className={classNames({
            "add-btn-options": true,
            "add-btn-options-open": optionsOpen
          })}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default AddBtn;
