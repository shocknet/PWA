import c from "classnames";

import * as R from "react";

import DialogNav, { DIALOG_NAV_MIN_HEIGHT_PX } from "../DialogNav";

import Pad from "../Pad";

import styles from "./css/DarkPage.module.css";

export interface DarkPageProps {
  pageTitle?: string;
  scrolls?: boolean;
}

const DarkPage: R.FC<DarkPageProps> = ({ children, pageTitle, scrolls }) => {
  //#region controller
  const [headerHeight, setHeaderHeight] = R.useState(DIALOG_NAV_MIN_HEIGHT_PX);
  //#endregion controller

  return (
    <div
      className={c(styles.container, scrolls && styles["container-scrolls"])}
    >
      <DialogNav pageTitle={pageTitle || ""} onHeight={setHeaderHeight} />

      <Pad amt={headerHeight} />

      {children}
    </div>
  );
};

export default DarkPage;
