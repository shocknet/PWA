import React from "react";

import Icon, { IconName } from "../Icon";
import Pad from "../../Pad";

import "./SettingOrData.scoped.css";

export interface SettingOrDataProps {
  onPress?(): void;
  subtitle?: string;
  title: string;
  rightSide?: IconName | "input";
  disabled?: boolean;
}

export default class SettingOrData extends React.PureComponent<SettingOrDataProps> {
  onPress = () => {
    const { disabled, onPress } = this.props;

    !disabled && onPress && onPress();
  };

  render() {
    const { subtitle, title, rightSide } = this.props;

    return (
      <div onClick={this.onPress}>
        <div style={styles.container}>
          <div style={styles.titleAndSubtitleContainer}>
            <span style={styles.title}>{title}</span>

            <Pad amt={8} />

            <span style={subtitle ? styles.subtitle : styles.subtitleHidden}>
              {subtitle || "Lorem ipsumDolor Lorem ipsumDolor"}
            </span>
          </div>

          {rightSide &&
            (() => {
              if (rightSide === "input") {
                return null;
              }

              return <Icon name={rightSide} />;
            })()}
        </div>
      </div>
    );
  }
}

const subtitleBase = {
  color: "var(--btn-blue-border)",
  fontFamily: "Montserrat-500",
  letterSpacing: 0.1,
  fontSize: 11,
  maxWidth: "90%"
};

const styles = {
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },

  titleAndSubtitleContainer: {
    alignItems: "flex-start",
    flexDirection: "column",
    flexShrink: 1 // prevent text from pushing stuff out of the screen
  },

  title: {
    color: "var(--btn-blue-border)",
    fontFamily: "Montserrat-700",
    fontSize: 16
  },

  subtitle: subtitleBase,

  subtitleHidden: {
    ...subtitleBase,
    color: "transparent"
  }
} as const;
