// @ts-check
import DialogNav from "../../common/DialogNav";
import "./css/index.css";

const DialogPageContainer = ({
  containerClassName = "",
  contentClassName = "",
  title,
  children,
  disableNav = false
}) => {
  return (
    <div
      className={`page-container dialog-page ${containerClassName}`}
      style={
        disableNav
          ? {
              paddingTop: 0
            }
          : {}
      }
    >
      {!disableNav ? <DialogNav pageTitle={title} /> : null}
      <div className={`dialog-content-container ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default DialogPageContainer;
