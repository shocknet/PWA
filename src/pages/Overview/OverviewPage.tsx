// @ts-check
import { useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";

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
  const totalBalance = Store.useSelector(
    ({ wallet }) => wallet.totalBalance ?? "0"
  );
  const USDRate = Store.useSelector(({ wallet }) => wallet.USDRate ?? "0");
  const recentTransactions = Store.useSelector(
    Store.selectAllCoordinatesNewestToOldest
  );
  const introDismissed = Store.useSelector(
    ({ settings }) => settings.introDismissed
  );
  const dismissIntro = useCallback(() => {
    dispatch(
      set({
        key: "introDismissed",
        value: true
      })
    );
  }, [dispatch]);

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
      </div>
      <div className="recent-activity-container">
        <p className="recent-activity-title">Recent Activity</p>
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
        modalOpen={!introDismissed && !!INTRO_PARAGRAPHS.length}
        modalTitle="Welcome"
        toggleModal={dismissIntro}
        contentStyle={INTRO_MODAL_STYLE}
      >
        {PARAGRAPHS_NODE}
      </Modal>
    </div>
  );
};

/**
 * @type {Array<string> | null}
 */
const INTRO_PARAGRAPHS = JSON.parse(
  process.env.REACT_APP_INTRO_PARAGRAPHS || "[]"
);

const PARAGRAPHS_NODE = INTRO_PARAGRAPHS.map(p => (
  <>
    <p className="intro-paragraph" dangerouslySetInnerHTML={{ __html: p }}></p>

    <br />
  </>
));

/** @type {React.CSSProperties} */
const INTRO_MODAL_STYLE = {
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 24
};

export default OverviewPage;
