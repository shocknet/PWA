import React from "react";
import { connect } from "react-redux";

import { logger } from "../../utils";
import { State } from "../../reducers";
import DarkPage from "../../common/DarkPage";

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
      <DarkPage paddingBetweenChildren={48} scrolls>
        <span style={styles.feePreferenceText}>Fee Preference (Chain)</span>
        <div style={styles.feePreferenceContainer}>
          <div style={styles.feePreferenceOption}>
            <span style={styles.feePreferenceOptionTitle}>
              {feePreferenceOption[0].title}
            </span>
            <span style={styles.feePreferenceOptionInfo}>
              {feePreferenceOption[0].info} sats/byte
            </span>
          </div>
          <div style={styles.feePreferenceOption}>
            <span style={styles.feePreferenceOptionTitle}>
              {feePreferenceOption[1].title}
            </span>
            <span style={styles.feePreferenceOptionInfo}>
              {feePreferenceOption[1].info} sats/byte
            </span>
          </div>
          <div style={styles.feePreferenceOption}>
            <span style={styles.feePreferenceOptionTitle}>
              {feePreferenceOption[2].title}
            </span>
            <span style={styles.feePreferenceOptionInfo}>
              {feePreferenceOption[2].info} sats/byte
            </span>
          </div>
        </div>
        <div style={styles.feeSliderContainer}>
          <div
            style={styles.feeSlider}
            // thumbStyle={styles.feeSliderThumb}
            // maximumValue={2}
            // minimumValue={0}
            // step={1}
            // onSlidingComplete={this.handleSlider}
            // value={level}
            // thumbTintColor="#F5A623"
            // minimumTrackTintColor="#707070"
            // maximumTrackTintColor="#707070"
          />
        </div>
        <div style={styles.feeSourceContainer}>
          <div style={styles.feeSourceInputGroupContainer}>
            <input
              value={tmpSource}
              style={styles.feeSourceContainerInputGroup}
              onChange={e => this.updateTmpSource(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.balanceSettingContainer}>
          <span style={styles.balanceSettingTitle}>
            Routing Fee Limits (Lightning)
          </span>
          <div style={styles.balanceSetting}>
            <div style={styles.balanceSettingContent}>
              <span style={styles.balanceSettingContentTitle}>Base Fee</span>
              <span style={styles.balanceSettingContentDescription}>
                Fixed rate per payment measured in sats, allowed regardless of
                payment size
              </span>
            </div>
            <div style={styles.balanceSettingCheckBoxContainer}>
              <input
                onChange={e => this.updateTmpAbsoluteFee(e.target.value)}
                value={tmpAbsoluteFee}
                style={styles.inputDark}
              />
            </div>
          </div>
          <div style={styles.balanceSetting}>
            <div style={styles.balanceSettingContent}>
              <span style={styles.balanceSettingContentTitle}>
                Percentage Fee
              </span>
              <span style={styles.balanceSettingContentDescription}>
                Maximum fee as a percentage of payment (if higher than base fee)
              </span>
            </div>
            <div style={styles.balanceSettingCheckBoxContainer}>
              <input
                onChange={e => this.updateTmpRelativeFee(e.target.value)}
                value={relativeValue}
                style={styles.inputDark}
              />
            </div>
          </div>
        </div>
        <div style={styles.balanceSettingContainer}>
          <span style={styles.balanceSettingTitle}>Notifications Settings</span>
          <div style={styles.balanceSetting}>
            <div style={styles.balanceSettingContent}>
              <span style={styles.balanceSettingContentTitle}>
                Disconnect Alerts
              </span>
              <span style={styles.balanceSettingContentDescription}>
                Triggering a notification if wallet is unable to connect to the
                node
              </span>
            </div>
            <div style={styles.balanceSettingCheckBoxContainer}>
              <div
              // value={tmpNotifyDisconnect}
              // onValueChange={this.updateTmpNotifyDisconnect}
              // thumbColor="#4285b9"
              // trackColor={{
              //   true: "rgba(66,133,185,0.8)",
              //   false: "black"
              // }}
              />
            </div>
          </div>
        </div>

        {somethingChanged && (
          <div style={styles.actionButtonsDark}>
            <div style={styles.actionButtonDark1} onClick={this.goBack}>
              <span style={styles.actionButtonTextDark1}>Cancel</span>
            </div>
            <div
              style={styles.actionButtonDark2}
              onClick={this.submitSourceToStore}
            >
              <span style={styles.actionButtonTextDark2}>Save</span>
            </div>
          </div>
        )}
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
  feePreferenceContainer: {
    flexDirection: "row",
    marginTop: 10
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
  actionButtonsDark: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  actionButtonDark1: {
    width: "43%",
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#001220",
    borderColor: "#4285B9",
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5
  },
  actionButtonDark2: {
    width: "43%",
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#4285B9",
    borderColor: "white",
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5
  },
  actionButtonTextDark1: {
    color: "#4285B9",
    fontSize: 14
  },
  actionButtonTextDark2: {
    color: "#212937",
    fontSize: 14
  },
  inputDark: {
    flex: 1,
    // textAlignVertical: "center",
    verticalAlign: "center",
    textAlign: "center",
    fontSize: 12,
    // color: CSS.Colors.TEXT_WHITE,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    padding: `0px 2px`,
    //height: 5,
    //marginBottom: 5,
    backgroundColor: "#212937",
    borderWidth: 1,
    borderColor: "#4285B9",
    overflow: "hidden",
    opacity: 0.7
  }
} as const;
