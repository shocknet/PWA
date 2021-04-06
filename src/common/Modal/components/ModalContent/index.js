// @ts-check
import "./css/index.css";

const ModalContent = ({ children, style }) => (
  <div className="modal-content" style={style}>
    {children}
  </div>
);

export default ModalContent;
