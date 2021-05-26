import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import ChoiceMethod from "../ChoiceMethod";
import { setAuthMethod } from "../../../../actions/AuthActions";
import "./css/index.scoped.css";
import PayPalButton from "../PayPalButton";

const TiersStep = () => {
  const dispatch = useDispatch();
  const selectCloudChoice = useCallback(() => {
    dispatch(setAuthMethod("shockCloud"));
  }, [dispatch]);

  return (
    <div className="tiers-step-container">
      <p className="tiers-title">Node Up</p>
      <p className="tiers-desc">
        In a decentralized network, a node is like a personal server that works
        even as your mobile sleeps.
      </p>
      <div className="tiers-container">
        <div className="w-100 d-flex flex-align-center">
        <label className="switch">
          <input type="checkbox" disabled/>
          <span className="slider round"></span>
        </label>
        <h3 className="m-l-1">select BTC</h3>
        </div>
        <div className="d-flex flex-align-center m-b-1">
          <p className="usd-icon">$</p>
          <PayPalButton
            price="10"
            title="$10 a month"
            content="Support development of Shock Network and receive a hosted node including a 250k sat capacity channel."
            url="https://www.sandbox.paypal.com/webapps/billing/plans/subscribe?plan_id=P-41N341533B8111025MCV5KFQ"
          />
        </div>
        <div className="d-flex flex-align-center m-b-1">
          <p className="usd-icon">$</p>
          <PayPalButton
            price="15"
            title="$10 a month"
            content="Support development of Shock Network and receive a hosted node including a 250k sat capacity channel."
            url="https://www.sandbox.paypal.com/webapps/billing/plans/subscribe?plan_id=P-41N341533B8111025MCV5KFQ"
          />
        </div>
        <div className="d-flex flex-align-center m-b-1">
          <p className="usd-icon">$</p>
          <PayPalButton
            price="25"
            title="$10 a month"
            content="Support development of Shock Network and receive a hosted node including a 250k sat capacity channel."
            url="https://www.sandbox.paypal.com/webapps/billing/plans/subscribe?plan_id=P-41N341533B8111025MCV5KFQ"
          />
        </div>
        <div className="d-flex flex-align-center m-b-1">
          <p className="usd-icon">$</p>
          <PayPalButton
            price="50"
            title="$10 a month"
            content="Support development of Shock Network and receive a hosted node including a 250k sat capacity channel."
            url="https://www.sandbox.paypal.com/webapps/billing/plans/subscribe?plan_id=P-41N341533B8111025MCV5KFQ"
          />
        </div>
        <p className="inline-link" onClick={selectCloudChoice}>
          I have a guest invite
        </p>
      </div>
    </div>
  );
};

export default TiersStep;
