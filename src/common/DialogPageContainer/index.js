// @ts-check
import classNames from "classnames";
import DialogNav from "../../common/DialogNav";
import * as gStyles from "../../styles";
import * as Utils from "../../utils";

import "./css/index.scoped.css";

const DialogPageContainer = ({
  containerClassName = "",
  contentClassName = "",
  title,
  children,
  disableNav = false,
  onBack = Utils.EMPTY_FN,
  showBackBtn = false
}) => {
  return (
    <div
      className={`page-container dialog-page ${containerClassName} no-scrollbar`}
      style={
        disableNav
          ? {
              paddingTop: 0
            }
          : {}
      }
    >
      {showBackBtn && (
        <div className="back-btn" onClick={onBack}>
          <i
            className={classNames("icon icon-thin-back", gStyles.fontSize18)}
          />
        </div>
      )}

      {!disableNav ? (
        <DialogNav drawerVisible={false} pageTitle={title} />
      ) : null}
      <div className={`dialog-content-container ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default DialogPageContainer;
