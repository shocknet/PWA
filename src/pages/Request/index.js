import React, { useCallback, useState } from "react";
import classNames from "classnames";
import DialogPageContainer from "../../common/DialogPageContainer";
import "./css/index.css";
import FormStep from "./components/FormStep";
import InvoiceStep from "./components/InvoiceStep";

const MAX_STEPS = 2;

const RequestPage = () => {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [unit, setUnit] = useState("sats");

  const onInputChange = useCallback(e => {
    if (e.target.name === "amount") {
      setAmount(e.target.value);
    }

    if (e.target.name === "description") {
      setDescription(e.target.value);
    }

    if (e.target.name === "unit") {
      setUnit(e.target.value);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (activeStep < MAX_STEPS - 1) {
      setActiveStep(activeStep + 1);
    }
  }, [activeStep]);

  const prevStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  const renderStep = useCallback(() => {
    if (activeStep === 0) {
      return (
        <FormStep
          amount={amount}
          description={description}
          onInputChange={onInputChange}
        />
      );
    }

    if (activeStep === 1) {
      return (
        <InvoiceStep
          amount={amount}
          description={description}
          unit={unit}
          prevStep={prevStep}
        />
      );
    }
  }, [activeStep, amount, description, onInputChange, prevStep, unit]);

  const lastStep = activeStep === MAX_STEPS - 1;
  const steps = Array.from({ length: MAX_STEPS });

  return (
    <DialogPageContainer
      containerClassName="request-page"
      contentClassName="request-page-content"
      title="REQUEST"
    >
      {renderStep()}
      <div className="request-page-footer">
        {!lastStep ? (
          <div className="request-page-controls">
            <div className="request-page-control" onClick={nextStep}>
              Skip
            </div>
            <div
              className="request-page-control request-page-next"
              onClick={nextStep}
            >
              Next
            </div>
          </div>
        ) : null}
        <div className="request-page-indicators">
          {steps.map((step, key) => (
            <div
              className={classNames({
                "request-page-indicator": true,
                "request-page-indicator-active": key === activeStep
              })}
            ></div>
          ))}
        </div>
      </div>
    </DialogPageContainer>
  );
};

export default RequestPage;
