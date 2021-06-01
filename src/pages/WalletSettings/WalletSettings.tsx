import React from "react";
import { connect } from "react-redux";
import c from "classnames";

import * as Settings from "../../common/Settings";
import { logger } from "../../utils";
import { State } from "../../reducers";
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

interface FeesVal {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
}

interface WalletSettingsState {
  fetchedFees: FeesVal;
  tmpSource: string;
  tmpAbsoluteFee: string;
  tmpRelativeFee: string;

  somethingChanged: boolean;
}

const {
  updateSelectedFee,
  updateFeesSource,
  updateRoutingFeeAbsolute,
  updateRoutingFeeRelative
} = {
  updateSelectedFee() {},
  updateFeesSource() {},
  updateRoutingFeeAbsolute() {},
  updateRoutingFeeRelative() {}
};

class WalletSettings extends React.PureComponent<
  WalletSettingsProps,
  WalletSettingsState,
  never
> {
  state: WalletSettingsState = {
    fetchedFees: {
      fastestFee: 0,
      halfHourFee: 0,
      hourFee: 0
    },
    tmpSource: this.props.fees.feesSource,
    tmpAbsoluteFee: this.props.fees.absoluteFee,
    tmpRelativeFee: this.props.fees.relativeFee,

    somethingChanged: false
  };

  goBack = () => {
    this.setState({
      fetchedFees: {
        fastestFee: 0,
        halfHourFee: 0,
        hourFee: 0
      },
      tmpSource: this.props.fees.feesSource,
      tmpAbsoluteFee: this.props.fees.absoluteFee,
      tmpRelativeFee: this.props.fees.relativeFee,

      somethingChanged: false
    });
    // this.props.navigation.goBack();
  };

  componentDidMount() {
    const { fees } = this.props;

    fetch(fees.feesSource)
      .then(res => res.json())
      /**@param {feesVal} j*/
      .then(j =>
        this.setState({
          fetchedFees: j
        })
      )
      .catch(e => logger.log(e));
  }

  updateTmpSource = (s: string) => {
    this.setState({ tmpSource: s });
    this.somethingChanged();
  };

  updateTmpAbsoluteFee = (val: string) => {
    this.setState({ tmpAbsoluteFee: parseInt(val, 10).toString() });
    this.somethingChanged();
  };

  updateTmpRelativeFee = (val: string) => {
    const fee = val.slice(1);
    let nextVal = "0";
    if (fee[fee.length - 1] !== "." && parseFloat(fee) !== 0) {
      nextVal = (parseFloat(fee) / 100).toString();
    } else {
      nextVal = fee;
    }
    this.setState({ tmpRelativeFee: nextVal });
    this.somethingChanged();
  };

  submitRoutingFees = () => {
    const { updateRoutingFeeAbsolute, updateRoutingFeeRelative } = this.props;
    const { tmpAbsoluteFee, tmpRelativeFee } = this.state;
    updateRoutingFeeAbsolute(tmpAbsoluteFee);
    updateRoutingFeeRelative(tmpRelativeFee);
  };

  submitSourceToStore = () => {
    const { updateFeesSource } = this.props;
    const { tmpSource } = this.state;
    updateFeesSource(tmpSource);
    this.submitRoutingFees();

    // ToastAndroid.show("Settings Updated", 800);
    this.goBack();
  };

  setMID = () => {
    this.props.updateSelectedFee("MID");
  };

  setMAX = () => {
    this.props.updateSelectedFee("MAX");
  };

  setMIN = () => {
    this.props.updateSelectedFee("MIN");
  };

  /**
   * @param {number} n
   */
  handleSlider = n => {
    let level: "MAX" | "MID" | "MIN" = "MID" as const;
    switch (n) {
      case 0: {
        level = "MIN";
        break;
      }
      case 1: {
        level = "MID";
        break;
      }
      case 2: {
        level = "MAX";
        break;
      }
    }
    this.props.updateSelectedFee(level);
  };

  somethingChanged = () => {
    this.setState({ somethingChanged: true });
  };

  render() {
    const { fees } = this.props;
    const {
      fetchedFees,
      tmpSource,
      tmpAbsoluteFee = "100",
      tmpRelativeFee = "100",
      somethingChanged
    } = this.state;
    let level = 1;
    switch (fees.feesLevel) {
      case "MIN": {
        level = 0;
        break;
      }
      case "MID": {
        level = 1;
        break;
      }
      case "MAX": {
        level = 2;
        break;
      }
    }
    //const theme = 'dark'
    const feePreferenceOption = [
      {
        title: "> 1 Hour",
        info: fetchedFees.hourFee
      },
      {
        title: "< 1 Hour",
        info: fetchedFees.halfHourFee
      },
      {
        title: "ASAP",
        info: fetchedFees.fastestFee
      }
    ];

    let relativeValue = "%0";
    const parsed = parseFloat(tmpRelativeFee);
    if (tmpRelativeFee[tmpRelativeFee.length - 1] !== "." && parsed !== 0) {
      const fixed = ((parsed ? parsed : 0) * 100).toFixed(2);
      relativeValue = "%" + parseFloat(fixed).toString();
    } else {
      relativeValue = "%" + tmpRelativeFee;
    }

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
              false && "fee-preference-selected"
            )}
            style={styles.resetInputStyle}
          >
            {`> 1 hour`}
          </div>

          <div
            className={c(
              "input-field",
              "fee-preference",
              true && "fee-preference-selected"
            )}
            style={styles.resetInputStyle}
          >
            {`< 1 hour`}
          </div>

          <div
            className={c(
              "input-field",
              "fee-preference",
              false && "fee-preference-selected"
            )}
            style={styles.resetInputStyle}
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
    //}
  }
}

const mapStateToProps = ({ fees }: State) => ({ fees, settings: {} });

const mapDispatchToProps = {
  updateSelectedFee,
  updateFeesSource,
  updateRoutingFeeAbsolute,
  updateRoutingFeeRelative
};

// @ts-expect-error
export default connect(mapStateToProps, mapDispatchToProps)(WalletSettings);

const styles = {
  flexCenterDark: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#16191C"
  },
  feePreferenceText: {
    color: "#EBEBEB",
    fontWeight: 700,
    textAlign: "left"
  },
  balanceSettingTitle: {
    fontSize: 15,
    color: "#EBEBEB",
    fontWeight: 700
  },
  feePreferenceOption: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },

  feePreferenceOptionTitle: {
    color: "#4285B9",

    fontSize: 15,
    textAlign: "center"
  },
  feePreferenceOptionInfo: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    paddingTop: 3
  },
  mainContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flex: 1,
    width: "100%"
  },
  feeSlider: {
    width: "80%",
    flex: 1
  },
  feeSliderContainer: {
    flexDirection: "row",
    marginTop: 2,
    marginBottom: 2
  },
  feeSliderThumb: {
    borderWidth: 1,
    borderColor: "white",
    width: 22,
    height: 22
  },
  feeSourceContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 5
  },
  feeSourceLabel: {
    fontSize: 15,
    color: "#EBEBEB",
    fontWeight: 700
  },
  balanceSettingContainer: {
    width: "100%",
    marginBottom: 10
  },
  balanceSetting: {
    flexDirection: "row",
    marginTop: 5
  },
  balanceSettingCheckBoxContainer: {
    height: 30,
    width: 50,
    marginTop: 25
    // marginTop: -15,
  },
  balanceSettingContent: {
    flex: 1
  },
  balanceSettingContentTitle: {
    fontSize: 14,
    color: "#4285B9"
  },
  balanceSettingContentDescription: {
    color: "#EBEBEB",
    fontSize: 11,
    marginTop: 5
  },
  feeSourceContainerInputGroup: {
    marginBottom: 0
  },
  feeSourceInputGroupContainer: {
    flexDirection: "row"
  },
  resetInputStyle: {
    width: "unset",
    padding: "8px 0px",
    margin: 0
  }
} as const;
