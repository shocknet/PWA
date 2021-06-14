import React from "react";

import "./Icon.scoped.css";

export type IconName =
  | "checkbox-active"
  | "checkbox-passive"
  | "check-mark"
  | "hourglass"
  | "copy";

interface IconProps {
  name: IconName;
}

const Icon: React.FC<IconProps> = ({ name }) => {
  if (name === "checkbox-active") {
    return <i className="settings-icon orange far fa-check-square" />;
  }

  if (name === "checkbox-passive") {
    return <i className="settings-icon orange far fa-square" />;
  }

  if (name === "check-mark") {
    return <i className="settings-icon cyan fas fa-check" />;
  }

  if (name === "hourglass") {
    return <i className="settings-icon orange fas fa-hourglass-half" />;
  }

  if (name === "copy") {
    return <i className="settings-icon cyan far fa-copy" />;
  }

  throw new Error(`<Settings.Icon />: wrong icon name supplied.`);
};

export default Icon;
