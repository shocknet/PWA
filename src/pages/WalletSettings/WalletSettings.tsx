import React from "react";
import c from "classnames";
import debounce from "lodash/debounce";

import * as Settings from "../../common/Settings";
import * as gStyles from "../../styles";
import * as Store from "../../store";

import * as FeesActions from "../../actions/FeesActions";
import DarkPage from "../../common/DarkPage";
import Pad from "../../common/Pad";

import "./WalletSettings.scoped.css";

export interface WalletSettingsProps {
  fees: {
    feesSource: string;
    absoluteFee: string;
    relativeFee: string;
    feesLevel: string;
  };

  updateNotifyDisconnect(val: boolean): void;
  updateNotifyDisconnectAfter(val: number): void;
  updateRoutingFeeAbsolute(val: string): void;
  updateRoutingFeeRelative(val: string): void;
  updateFeesSource(val: string): void;
}

const WalletSettings = () => {
  const dispatch = Store.useDispatch();
  const { rate, source } = Store.useSelector(state => state.fees);
  const [newSource, setNewSource] = React.useState(source);

  const submitNewSource = debounce(
    (newSource: string) => {
      dispatch(FeesActions.setSource(newSource));
    },
    500,
    {
      leading: false,
      trailing: true
    }
  );

  React.useEffect(() => {
    dispatch(FeesActions.loadFeeRates());
  }, [dispatch, source /* implicit */]);

  return (
    <DarkPage
      padding
      paddingBetweenChildren={48}
      pageTitle="Wallet Settings"
      scrolls
    >
      <Settings.SectionTitle>Fee Preference (Chain)</Settings.SectionTitle>

      <div className={gStyles.rowCentered}>
        <div
          className={c(
            "input-field",
            "fee-preference",
            "reset-input-style",
            rate === "hourFee" && "fee-preference-selected"
          )}
          onClick={() => {
            dispatch(FeesActions.setRate("hourFee"));
          }}
        >
          {`> 1 hour`}
        </div>

        <div
          className={c(
            "input-field",
            "fee-preference",
            "reset-input-style",
            rate === "halfHourFee" && "fee-preference-selected"
          )}
          onClick={() => {
            dispatch(FeesActions.setRate("halfHourFee"));
          }}
        >
          {`< 1 hour`}
        </div>

        <div
          className={c(
            "input-field",
            "fee-preference",
            "reset-input-style",
            rate === "fastestFee" && "fee-preference-selected"
          )}
          onClick={() => {
            dispatch(FeesActions.setRate("fastestFee"));
          }}
        >
          ASAP
        </div>
      </div>

      <Settings.SectionTitle>Fee Source</Settings.SectionTitle>

      <input
        className="input-field"
        size={1}
        onChange={e => {
          setNewSource(e.target.value);
          submitNewSource(e.target.value);
        }}
        value={newSource}
      />

      <Settings.SectionTitle>
        Routing Fee Limits (Lightning)
      </Settings.SectionTitle>

      <Settings.SettingOrData
        disabled
        subtitle="Fixed rate per payment measured in sats, allowed regardless of payment size."
        title="Base Fee"
        rightSide="input"
      />

      <Settings.SettingOrData
        disabled
        subtitle="Maximum fee as a percentage of payment (if higher than the base fee)."
        title="Percentage Fee"
        rightSide="input-%"
      />

      <Settings.SectionTitle>Balance Management</Settings.SectionTitle>

      <Settings.SettingOrData
        subtitle="Fallback to buddy system until sufficient channels are established."
        title="Bootstrap Wallet"
        rightSide="checkbox-active"
        disabled
      />

      <Settings.SettingOrData
        disabled
        subtitle="Establish channels with recommended routers."
        title="Automatic Channels"
        rightSide="checkbox-active"
      />

      <Settings.SettingOrData
        disabled
        subtitle="Push channel balances outward to make on-chain payments via the swap provider."
        title="Automatic Swaps"
        rightSide="checkbox-active"
      />

      <Pad amt={80} />
    </DarkPage>
  );
};

export default WalletSettings;
