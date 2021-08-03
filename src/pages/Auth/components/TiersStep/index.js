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
      <p className="tiers-title">Hosted Nodes</p>
      <p className="tiers-desc">
        Support development of Lightning.Page and receive a hosted node,
        including a Lightning Channel from our highly connected router.
      </p>
      <div className="tiers-container">
        <div className="w-100 d-flex flex-align-center flex-justify-center">
          <h4 className="m-r-1">USD</h4>
          <label className="switch">
            <input type="checkbox" disabled />
            <span className="slider round"></span>
          </label>
          <h4 className="m-l-1">BTC</h4>
        </div>
        <div className="d-flex flex-align-center m-b-1">
          <p className="usd-icon">$</p>
          <PayPalButton
            price="15"
            title="Casual node including a 250k sat capacity channel."
            content="Ocassionally receive tips and small payments."
            url="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-1UN337076V329964EMCZ4UMQ"
          />
        </div>
        <div className="d-flex flex-align-center m-b-1">
          <p className="usd-icon">$</p>
          <PayPalButton
            price="20"
            title="Hustle node including a 615k sat capacity channel."
            content="Regularly receive tips and medium payments."
            url="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-64A57641L62950043MCZ4VVY"
          />
        </div>
        <div className="d-flex flex-align-center m-b-1">
          <p className="usd-icon">$</p>
          <PayPalButton
            price="25"
            title="Power node including a 1.0M sat capacity channel."
            content="Regularly receive medium payments or lots of tips."
            url="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-3C031681LU943680NMCZ46MY"
          />
        </div>
        <div className="d-flex flex-align-center m-b-1">
          <p className="usd-icon">$</p>
          <PayPalButton
            price="50"
            title="Baller node including a 2.1M sat capacity channel."
            content="Consistantly receive tips and significant payments."
            url="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-47A940565R4261602MCZ473Y"
          />
        </div>
        <div className="d-flex flex-align-center m-b-1">
          <p className="usd-icon">$</p>
          <PayPalButton
            price="75"
            title="Whale node including a 6.15M sat capacity channel."
            content="Receive tips and substantial payments in volume."
            url="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-9B5046250K1868737MCZ5AXQ"
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
