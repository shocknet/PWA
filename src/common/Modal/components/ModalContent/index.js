// @ts-check
import "./css/index.scoped.css";

const ModalContent = ({ children, style }) => (
  <div className="content" style={style}>
    {children}
  </div>
);

export default ModalContent;
