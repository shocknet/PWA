import InputGroup from "../../../../common/InputGroup";

const FormStep = ({ onInputChange, amount, description }) => (
  <div className="request-form-container">
    <div className="inputs-group">
      <InputGroup
        name="amount"
        label="Enter Amount"
        onChange={onInputChange}
        value={amount}
        inputMode="decimal"
      />
      <select name="unit" className="unit-dropdown" onChange={onInputChange}>
        <option value="sats">Sats</option>
        <option value="msats">mSats</option>
        <option value="btc">BTC</option>
      </select>
    </div>
    <InputGroup
      name="description"
      label="Description"
      element="textarea"
      onChange={onInputChange}
      value={description}
    />
  </div>
);

export default FormStep;
