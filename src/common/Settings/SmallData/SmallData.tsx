import React, { memo } from "react";

import Pad from "../../Pad";

import Icon, { IconName } from "../Icon";

export interface SmallDataProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
}

/**
 * For use inside a row container
 */
const SmallData: React.FC<SmallDataProps> = ({ title, subtitle, icon }) => {
  return (
    <div style={styles.feePreferenceOption}>
      <span style={styles.feePreferenceOptionTitle}>{title}</span>

      <Pad amt={8} />

      {subtitle && (
        <span style={styles.feePreferenceOptionInfo}>{subtitle}</span>
      )}
      {icon && <Icon name={icon} />}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  feePreferenceOption: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  feePreferenceOptionTitle: {
    color: "#4285B9",
    fontSize: 15,
    textAlign: "center"
  },
  feePreferenceOptionInfo: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    paddingTop: 5
  }
};

export default memo(SmallData);
