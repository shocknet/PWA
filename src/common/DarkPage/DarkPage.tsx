import * as R from "react";
import c from "classnames";

import DialogNav, { DIALOG_NAV_MIN_HEIGHT_PX } from "../DialogNav";
import Pad from "../Pad";
import * as gStyles from "../../styles";

import styles from "./css/DarkPage.module.css";

export interface DarkPageProps {
  justify?: "start" | "center";
  padding?: boolean;
  pageTitle?: string;
  scrolls?: boolean;
}

const DarkPage: R.FC<DarkPageProps> = ({
  children,
  justify,
  padding,
  pageTitle,
  scrolls
}) => {
  if (scrolls && !!justify) {
    throw new Error(`Can not both set "scrolls" and "justify" at <DarkPage />`);
  }
  //#region controller
  const [headerHeight, setHeaderHeight] = R.useState(DIALOG_NAV_MIN_HEIGHT_PX);
  //#endregion controller

  return (
    <div
      className={c(styles.container, {
        [styles["container-scrolls"]]: !!scrolls,
        [gStyles.col]: !!justify,
        [gStyles.centerJustify]: justify === "center",
        [gStyles.commonPaddingH]: !!padding
      })}
    >
      <DialogNav pageTitle={pageTitle || ""} onHeight={setHeaderHeight} />

      <Pad amt={headerHeight} />

      {children}
    </div>
  );
};

export default DarkPage;
