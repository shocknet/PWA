import c from "classnames";

import * as Settings from "../../common/Settings";
import DarkPage from "../../common/DarkPage";
import Pad from "../../common/Pad";
import * as gStyles from "../../styles";

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
  updateSelectedFee(val: "MAX" | "MID" | "MIN"): void;
}

const WalletSettings = () => {
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
            false && "fee-preference-selected"
          )}
        >
          {`> 1 hour`}
        </div>

        <div
          className={c(
            "input-field",
            "fee-preference",
            "reset-input-style",
            true && "fee-preference-selected"
          )}
        >
          {`< 1 hour`}
        </div>

        <div
          className={c(
            "input-field",
            "fee-preference",
            "reset-input-style",
            false && "fee-preference-selected"
          )}
        >
          ASAP
        </div>
      </div>

      <Settings.SectionTitle>Fee Source</Settings.SectionTitle>

      <input className="input-field" size={1} />

      <Settings.SectionTitle>
        Routing Fee Limits (Lightning)
      </Settings.SectionTitle>

      <Settings.SettingOrData
        subtitle="Fixed rate per payment measured in sats, allowed regardless of payment size."
        title="Base Fee"
        rightSide="input"
      />

      <Settings.SettingOrData
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
        subtitle="Establish channels with recommended routers."
        title="Automatic Channels"
        rightSide="checkbox-active"
      />

      <Settings.SettingOrData
        subtitle="Push channel balances outward to make on-chain payments via the swap provider."
        title="Automatic Swaps"
        rightSide="checkbox-active"
      />

      <Pad amt={80} />
    </DarkPage>
  );
};

export default WalletSettings;
