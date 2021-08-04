import "../../css/index.scoped.css";

const ModalSubmit = ({ text = "Submit", onClick }) => {
  return (
    <div className="submit-btn" onClick={onClick}>
      <p className="submit-btn-text">{text}</p>
    </div>
  );
};

export default ModalSubmit;
