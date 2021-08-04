import * as Utils from "../../../../utils";

import "./css/index.scoped.css";

const ModalTitle = ({
  title = "",
  toggleModal = Utils.EMPTY_FN,
  forceRenderTitleBar = false,
  hideXBtn = false
}) =>
  title || forceRenderTitleBar ? (
    <div className="head">
      <p className="head-title">{title}</p>
      {!hideXBtn && (
        <div className="head-close" onClick={toggleModal}>
          <i className="fas fa-times"></i>
        </div>
      )}
    </div>
  ) : null;

export default ModalTitle;
