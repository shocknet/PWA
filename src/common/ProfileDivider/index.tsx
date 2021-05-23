import classNames from "classnames";

import * as gStyles from "../../styles";
import Line from "../Line";

import styles from "./css/ProfileDivider.module.css";

export interface ProfileDividerProps {
  onChange(newlySelected: "posts" | "services" | "content"): void;
  selected: "posts" | "services" | "content";
  showContentBtn?: boolean;
}

const ProfileDivider = ({
  onChange,
  selected,
  showContentBtn
}: ProfileDividerProps) => {
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

      <div
        className={classNames(
          gStyles.absolute,
          showContentBtn && styles["left-line"]
        )}
      >
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

      {showContentBtn && (
        <>
          <div className={classNames(gStyles.absolute, styles["right-line"])}>
            <Line color="white" length={16} type="vertical" width={2} />
          </div>

          <span
            className={classNames(
              gStyles.unselectable,
              selected === "content" ? styles.selected : styles.unselected
            )}
            onClick={() => {
              onChange("content");
            }}
          >
            Content
          </span>
        </>
      )}
    </div>
  );
};

export default ProfileDivider;
