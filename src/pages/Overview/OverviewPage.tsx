// @ts-check
import React, { memo, useEffect, useMemo, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";

import * as Utils from "../../utils";
import {
  fetchWalletBalance,
  fetchUSDRate,
  fetchUnifiedTransactions,
  FetchLightningInfo
} from "../../actions/WalletActions";
import { subCoordinates } from "../../actions/CoordinateActions";
import { set } from "../../actions/SettingsActions";
import { convertSatsToUSD, formatNumber } from "../../utils/Number";
import BottomBar from "../../common/BottomBar";
import Loader from "../../common/Loader";
import MainNav from "../../common/MainNav";
import Modal from "../../common/Modal";
import Transaction from "./components/Transaction";
import "./css/index.scoped.css";

import * as Store from "../../store";

const OverviewPage = () => {
  const dispatch = Store.useDispatch();
  const { forceUpdate } = Utils.useForceUpdate();
  const totalBalance = Store.useSelector(
    ({ wallet }) => wallet.totalBalance ?? "0"
  );
  const USDRate = Store.useSelector(({ wallet }) => wallet.USDRate ?? "0");
  const recentTransactions = Store.useSelector(
    Store.selectAllCoordinatesNewestToOldest
  );

  const [deploymentType, setDeploymentType] = useState<
    "hosting" | "default" | "unknown"
  >("unknown");
  const [
    fetchingDeploymentType,
    toggleFetchingDeploymentType
  ] = Utils.useBooleanState(true);
  const introDismissed = Store.useSelector(
    ({ settings }) => settings.introDismissed
  );
  const [introParagraphsIfError, setIntroParagraphsIfError] = useState<
    string[]
  >(["There was an error fetching the deployment type of your ShockApi."]);

  useEffect(() => {
    Utils.Http.get(`/healthz`)
      .then(res => {
        setDeploymentType(res.data.deploymentType);
      })
      .catch(e => {
        Utils.logger.error(`Error when fetching deployment type -> `, e);
        setIntroParagraphsIfError([
          "There was an error fetching the deployment type of your ShockApi:",
          e.message
        ]);
      })
      .finally(toggleFetchingDeploymentType);
  }, [toggleFetchingDeploymentType]);

  const dismissIntro = useCallback(() => {
    if (deploymentType === "unknown") {
      sessionStorage.setItem("introDismissed", "true");
      forceUpdate(); // else the change to session storage won't be reflected
    } else {
      dispatch(
        set({
          key: "introDismissed",
          value: true
        })
      );
    }
  }, [deploymentType, dispatch, forceUpdate]);

  useEffect(() => {
    fetchWalletBalance()(dispatch);
    fetchUSDRate()(dispatch);
    fetchWalletBalance()(dispatch);
    fetchUnifiedTransactions()(dispatch);
    FetchLightningInfo()(dispatch);
  }, [dispatch]);

  useEffect(() => dispatch(subCoordinates()), [dispatch]);

  const totalBalanceUSD = useMemo(
    () => formatNumber(convertSatsToUSD(totalBalance, USDRate).toFixed(2)),
    [USDRate, totalBalance]
  );

  const formattedBalance = useMemo(() => formatNumber(totalBalance), [
    totalBalance
  ]);

  return (
    <div className="page-container overview-page">
      <div className="overview-header">
        <MainNav absolute pageTitle={undefined} />
        <div className="overview-balance-container">
          <p className="overview-balance-btc">
            {formattedBalance}{" "}
            <span className="overview-balance-unit">Sats</span>
          </p>
          <p className="overview-balance-usd">{totalBalanceUSD} USD</p>
        </div>
        <div className="overview-actions">
          <Link to="/send" className="overview-action overview-action-send">
            <p className="overview-action-text">Send</p>
          </Link>
          <Link
            to="/request"
            className="overview-action overview-action-request"
          >
            <p className="overview-action-text">Request</p>
          </Link>
        </div>

        <p className="recent-activity-title">Recent Activity</p>
      </div>
      <div className="recent-activity-container">
        <PullToRefresh
          className="recent-activity-entries"
          pullingContent={
            <div className="pull-refresh-text">
              <i className="fas fa-arrow-down"></i> Pull down to refresh{" "}
              <i className="fas fa-arrow-down"></i>
            </div>
          }
          refreshingContent={<Loader small text="" />}
          pullDownThreshold={75}
          onRefresh={() => {
            return fetchUnifiedTransactions()(dispatch);
          }}
        >
          <>
            {recentTransactions.map(transaction => (
              <Transaction
                coordinateSHA256={transaction.coordinateSHA256}
                key={transaction.coordinateSHA256}
              />
            ))}
          </>
        </PullToRefresh>
      </div>
      <BottomBar />

      <Modal
        modalOpen={
          !fetchingDeploymentType &&
          !(introDismissed || sessionStorage.getItem("introDismissed"))
        }
        toggleModal={dismissIntro}
        contentStyle={INTRO_MODAL_STYLE}
        disableBackdropClose
        noFullWidth
        blueBtn="Let's Go"
        onClickBlueBtn={dismissIntro}
      >
        {(() => {
          let paragraphs: string[] = [];
          if (deploymentType === "hosting") {
            paragraphs = REACT_APP_INTRO_PARAGRAPHS_HOSTING;
          }
          if (deploymentType === "default") {
            paragraphs = REACT_APP_INTRO_PARAGRAPHS_DEFAULT;
          }
          if (deploymentType === "unknown") {
            paragraphs = introParagraphsIfError;
          }
          return paragraphs.map((paragraph, i) => (
            <React.Fragment key={paragraph + i}>
              <p
                className="intro-paragraph"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />

              <br />
            </React.Fragment>
          ));
        })()}
      </Modal>
    </div>
  );
};

/** @type {React.CSSProperties} */
const INTRO_MODAL_STYLE = {
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 24
};

const REACT_APP_INTRO_PARAGRAPHS_HOSTING = [
  "If you bought a node and didn't get a channel please email us or contact us through telegram",
  'Telegram: <a href="https://t.me/LightningPage">click here</a>',
  'email: <a href="mailto:fake@email.com">fake@email.com</a>'
];
const REACT_APP_INTRO_PARAGRAPHS_DEFAULT = ["Welcome to Shocknet"];

export default memo(OverviewPage);
