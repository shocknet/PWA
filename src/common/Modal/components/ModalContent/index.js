import c from "classnames";

import "./css/index.scoped.css";

const ModalContent = ({ children = null, style = {}, contentClass = "" }) => (
  <div className={c("content", contentClass)} style={style}>
    {children}
  </div>
);

export default ModalContent;
