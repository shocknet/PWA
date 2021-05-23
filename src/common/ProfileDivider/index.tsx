import classNames from "classnames";

import * as gStyles from "../../styles";
import Line from "../Line";

import styles from "./css/ProfileDivider.module.css";

export interface ProfileDividerProps {
  onChange(newlySelected: "posts" | "services"): void;
  selected: "posts" | "services";
}

const ProfileDivider = ({ onChange, selected }: ProfileDividerProps) => {
  return (
    <div
      className={classNames(
        gStyles.width100,
        gStyles.rowCentered,
        gStyles.spaceAround,
        gStyles.padding12,
        styles.container
      )}
    >
      <span
        className={classNames(
          gStyles.unselectable,
          selected === "posts" ? styles.selected : styles.unselected
        )}
        onClick={() => {
          onChange("posts");
        }}
      >
        Posts
      </span>

      <div className={gStyles.absolute /* centers it, keeps texts in place */}>
        <Line color="white" length={16} type="vertical" width={2} />
      </div>

      <span
        className={classNames(
          gStyles.unselectable,
          selected === "services" ? styles.selected : styles.unselected
        )}
        onClick={() => {
          onChange("services");
        }}
      >
        Services
      </span>
    </div>
  );
};

export default ProfileDivider;
