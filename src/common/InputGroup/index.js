import React, { memo } from "react";
import classNames from "classnames";

import * as Utils from "../../utils";

import "./css/index.scoped.css";

const InputGroup = ({
  label = "",
  name = "",
  onChange,
  inputAction = Utils.EMPTY_FN,
  actionIcon = "",
  value,
  inputMode = /** @type {React.HTMLAttributes['inputMode']} */ ("text"),
  type = "text",
  element = "input",
  small = false,
  disabled = false
}) => {
  return (
    <div
      className={classNames({
        group: true,
        "group-disabled": disabled,
        "group-small": small
      })}
    >
      {label ? <p className="group-label">{label}</p> : null}
      <div
        className={classNames({
          "group-input-container": true,
          "group-input-textarea-container": element === "textarea"
        })}
      >
        {element === "textarea" ? (
          <textarea
            className="group-input group-input-textarea"
            name={name}
            onChange={onChange}
            inputMode={inputMode}
            value={value}
            disabled={disabled}
          />
        ) : (
          <input
            className="group-input"
            type={type}
            name={name}
            onChange={onChange}
            inputMode={inputMode}
            value={value}
            disabled={disabled}
          />
        )}
        {inputAction && actionIcon ? (
          <div className="group-input-action" onClick={inputAction}>
            <i
              className={classNames({
                "group-input-action-icon": true,
                fas: true,
                [actionIcon]: true
              })}
              onClick={inputAction}
            ></i>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default memo(InputGroup);
