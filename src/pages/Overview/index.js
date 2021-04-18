import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { DateTime } from "luxon";

import {
  fetchWalletBalance,
  fetchUSDRate,
  fetchUnifiedTransactions
} from "../../actions/WalletActions";
import { convertSatsToUSD, formatNumber } from "../../utils/Number";
import { capitalizeText } from "../../utils/String";
import BottomBar from "../../common/BottomBar";
import Loader from "../../common/Loader";
import MainNav from "../../common/MainNav";
import Transaction from "./components/Transaction";
import "./css/index.css";
import { Http } from "../../utils";
import { setSeedInfo, setSeedProviderPub } from "../../actions/ContentActions";

const OverviewPage = () => {
  const dispatch = useDispatch();
  const totalBalance = useSelector(({ wallet }) => wallet.totalBalance ?? "0");
  const USDRate = useSelector(({ wallet }) => wallet.USDRate ?? "0");
  const publicKey = useSelector(({ node }) => node.publicKey);
  const recentTransactions = useSelector(
    ({ wallet }) => wallet.recentTransactions
  );

  useEffect(() => {
    fetchWalletBalance()(dispatch);
    fetchUSDRate()(dispatch);
    fetchWalletBalance()(dispatch);
    fetchUnifiedTransactions()(dispatch);
  }, [dispatch]);

  //load info about content provider stored into gun
  const loadContentInfo = useCallback(async () => {
    try {
      const { data: serviceProvider } = await Http.get(
        `/api/gun/user/load/seedServiceProviderPubKey`,
        {
          headers: {
            "public-key-for-decryption": publicKey
          }
        }
      );
      if (
        serviceProvider &&
        typeof serviceProvider.data === "string" &&
        serviceProvider.data !== ""
      ) {
        setSeedProviderPub(serviceProvider.data)(dispatch);
      }
      const { data: seedData } = await Http.get(
        `/api/gun/user/load/seedServiceSeedData`,
        {
          headers: {
            "public-key-for-decryption": publicKey
          }
        }
      );
      if (
        seedData &&
        typeof seedData.data === "string" &&
        seedData.data !== ""
      ) {
        const JObject = JSON.parse(seedData.data);
        if (JObject && JObject.seedUrl && JObject.seedToken) {
          setSeedInfo(JObject.seedUrl, JObject.seedToken)(dispatch);
        }
      }
    } catch (err) {
      //if something goes wrong just log the error, no need to do anything else
      console.log(err);
    }
  }, []);
  useEffect(() => {
    loadContentInfo();
  }, []);

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
        <MainNav absolute />
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
          {recentTransactions.map(transaction => (
            <Transaction
              time={
                transaction.date
                  ? DateTime.fromSeconds(
                      parseInt(transaction.date, 10)
                    ).toRelative()
                  : "unknown"
              }
              message={
                transaction.message ||
                `${capitalizeText(transaction.type)} Transaction`
              }
              username={capitalizeText(transaction.type)}
              value={formatNumber(transaction.value)}
              key={transaction.hash}
            />
          ))}
        </PullToRefresh>
      </div>
      <BottomBar />
    </div>
  );
};

export default OverviewPage;
