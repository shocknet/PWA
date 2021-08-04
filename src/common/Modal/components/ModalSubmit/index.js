import "./ModalSubmit.scoped.css";

const ModalSubmit = ({ text = "Submit", onClick }) => {
  return (
    <div className="submit-btn" onClick={onClick}>
      <p>{text}</p>
    </div>
  );
};

export default ModalSubmit;
