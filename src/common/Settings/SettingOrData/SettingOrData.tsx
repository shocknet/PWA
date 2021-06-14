import React from "react";

import Icon, { IconName } from "../Icon";
import Pad from "../../Pad";
import * as gStyles from "../../../styles";

import "./SettingOrData.scoped.css";

export interface SettingOrDataProps {
  onPress?(): void;
  subtitle?: string;
  title: string;
  rightSide?: IconName | "input" | "input-%";
  disabled?: boolean;
  handleInputTextChange?(text: string): void;
  inputValue?: string;
}

export default class SettingOrData extends React.PureComponent<SettingOrDataProps> {
  onPress = () => {
    const { disabled, onPress } = this.props;

    !disabled && onPress && onPress();
  };

  handleInputChange = (e: { target: { value: string } }) => {
    const { handleInputTextChange } = this.props;
    handleInputTextChange(e.target.value);
  };

  render() {
    const { disabled, subtitle, title, rightSide } = this.props;

    return (
      <div
        onClick={this.onPress}
        style={disabled ? styles.containerDisabled : styles.container}
      >
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
              return (
                <div className={gStyles.rowCentered}>
                  <input
                    className="input-field"
                    onChange={this.handleInputChange}
                    size={4}
                    style={styles.input}
                  />

                  <Pad amt={8} insideRow />

                  <span className={gStyles.opacityNone}>%</span>
                </div>
              );
            }

            if (rightSide === "input-%") {
              return (
                <div className={gStyles.rowCentered}>
                  <input
                    className="input-field"
                    onChange={this.handleInputChange}
                    size={4}
                    style={styles.input}
                  />

                  <Pad amt={8} insideRow />

                  <span>%</span>
                </div>
              );
            }

            return <Icon name={rightSide} />;
          })()}

        {!rightSide && <div />}
      </div>
    );
  }
}

const subtitleBase = {
  color: "var(--btn-blue-border)",
  letterSpacing: 0.1,
  fontSize: 11,
  textAlign: "left"
} as const;

const containerBase = {
  alignItems: "center",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between"
} as const;

const styles = {
  container: containerBase,

  containerDisabled: {
    ...containerBase,
    opacity: 0.3
  },

  input: {
    width: "unset",
    padding: "8px 0px",
    margin: 0
  },

  titleAndSubtitleContainer: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    flexShrink: 1 // prevent text from pushing stuff out of the screen
  },

  title: {
    color: "#4285B9",
    fontSize: 16
  },

  subtitle: subtitleBase,

  subtitleHidden: {
    ...subtitleBase,
    color: "transparent"
  }
} as const;
