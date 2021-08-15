import classNames from "classnames";

import "./css/index.scoped.css";

const ModalContent = ({ children = null, style = {}, contentClass = "" }) => (
  <div className={classNames("content", contentClass)} style={style}>
    {children}
  </div>
);

export default ModalContent;
