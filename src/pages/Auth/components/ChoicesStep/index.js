import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import ChoiceMethod from "../ChoiceMethod";
import { setAuthMethod } from "../../../../actions/AuthActions";
import "./css/index.scoped.css";

const ChoicesStep = () => {
  const dispatch = useDispatch();
  const selectCloudChoice = useCallback(() => {
    dispatch(setAuthMethod("shockCloud"));
  }, [dispatch]);

  return (
    <div className="choices-step-container">
      <p className="choices-title">Node Up</p>
      <p className="choices-desc">
        In a decentralized network, a node is like a personal server that works
        even as your mobile sleeps.
      </p>
      <div className="choices-container">
        <ChoiceMethod
          icon="code-branch"
          details="I already have a node, and want to enter a network address"
          method="manual"
        />
        <ChoiceMethod
          icon="qrcode"
          details="I'll install the ShockNode Wizard app on a computer"
          method="shockWizard"
        />
        <ChoiceMethod
          icon="cloud"
          details="I'd like a personal cloud node provided as a service"
          method="shockCloud"
        />
        <p className="inline-link" onClick={selectCloudChoice}>
          I have a guest invite
        </p>
      </div>
    </div>
  );
};

export default ChoicesStep;
