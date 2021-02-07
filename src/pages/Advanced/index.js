import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import Big from "big.js";
import MainNav from "../../common/MainNav";
import Invoice from "./components/Invoice";
import Transaction from "./components/Transaction";
import Channel from "./components/Channel";
import "./css/index.css";
import { useDispatch, useSelector } from "react-redux";
import { convertSatsToUSD, formatNumber } from "../../utils/Number";
import {
  fetchChannels,
  fetchInvoices,
  fetchTransactions
} from "../../actions/WalletActions";

const AdvancedPage = () => {
  const [selectedAccordion, setSelectedAccordion] = useState("transactions");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const confirmedBalance = useSelector(({ wallet }) => wallet.confirmedBalance);
  const channelBalance = useSelector(({ wallet }) => wallet.channelBalance);
  const transactions = useSelector(({ wallet }) => wallet.transactions);
  const invoices = useSelector(({ wallet }) => wallet.invoices);
  const channels = useSelector(({ wallet }) => wallet.channels);
  const USDRate = useSelector(({ wallet }) => wallet.USDRate);

  useEffect(() => {
    const reset = page === 1;
    dispatch(fetchTransactions({ page, reset }));
    dispatch(fetchChannels({ page, reset }));
    dispatch(fetchInvoices({ page, reset }));
  }, [page, dispatch]);

  const confirmedBalanceUSD = useMemo(
    () => formatNumber(convertSatsToUSD(confirmedBalance, USDRate).toFixed(2)),
    [USDRate, confirmedBalance]
  );
  const channelBalanceUSD = useMemo(
    () => formatNumber(convertSatsToUSD(channelBalance, USDRate).toFixed(2)),
    [USDRate, channelBalance]
  );

  const openAccordion = useCallback(accordion => {
    setSelectedAccordion(accordion);
  }, []);

  const openTransactionsAccordion = useCallback(() => {
    openAccordion("transactions");
  }, [openAccordion]);

  const openPeersAccordion = useCallback(() => {
    openAccordion("peers");
  }, [openAccordion]);

  const openInvoicesAccordion = useCallback(() => {
    openAccordion("invoices");
  }, [openAccordion]);

  const openChannelsAccordion = useCallback(() => {
    openAccordion("channels");
  }, [openAccordion]);

  return (
    <div className="page-container advanced-page">
      <div className="advanced-header">
        <MainNav absolute pageTitle="ADVANCED" />
        <div className="advanced-balance-container">
          <div className="advanced-balance-icon-container">
            <i className="advanced-balance-icon fas fa-link"></i>
          </div>
          <div className="advanced-balance-btc-container">
            <p className="advanced-balance-btc">
              {formatNumber(confirmedBalance)}
            </p>
            <p className="advanced-balance-usd">{confirmedBalanceUSD} USD</p>
          </div>
        </div>
        <div
          className="advanced-balance-container"
          style={{ paddingBottom: 25 }}
        >
          <div className="advanced-balance-icon-container">
            <i className="advanced-balance-icon fas fa-bolt"></i>
          </div>
          <div className="advanced-balance-btc-container">
            <p className="advanced-balance-btc">
              {formatNumber(channelBalance)}
            </p>
            <p className="advanced-balance-usd">{channelBalanceUSD} USD</p>
          </div>
        </div>
      </div>
      <div className="advanced-accordions-container">
        <div
          className={classNames({
            "advanced-accordion-container": true,
            "accordion-open": selectedAccordion === "transactions"
          })}
        >
          <div
            className="advanced-accordion-header"
            onClick={openTransactionsAccordion}
          >
            <p className="advanced-accordion-title">Transactions</p>
          </div>
          <div className="advanced-accordion-content">
            {transactions.content.map(transaction => (
              <Transaction
                date={transaction.time_stamp}
                hash={transaction.tx_hash}
                value={formatNumber(transaction.amount)}
                key={transaction.tx_hash}
              />
            ))}
          </div>
        </div>
        <div
          className={classNames({
            "advanced-accordion-container": true,
            "accordion-open": selectedAccordion === "peers"
          })}
        >
          <div
            className="advanced-accordion-header"
            onClick={openPeersAccordion}
          >
            <p className="advanced-accordion-title">Peers</p>
          </div>
          <div className="advanced-accordion-content"></div>
        </div>
        <div
          className={classNames({
            "advanced-accordion-container": true,
            "accordion-open": selectedAccordion === "invoices"
          })}
        >
          <div
            className="advanced-accordion-header"
            onClick={openInvoicesAccordion}
          >
            <p className="advanced-accordion-title">Invoices</p>
          </div>
          <div className="advanced-accordion-content">
            {invoices.content.map(invoice => (
              <Invoice
                paymentRequest={invoice.payment_request}
                date={invoice.creation_date}
                value={formatNumber(invoice.value)}
                message={invoice.memo}
                key={invoice.payment_request}
              />
            ))}
          </div>
        </div>
        <div
          className={classNames({
            "advanced-accordion-container": true,
            "accordion-open": selectedAccordion === "channels"
          })}
        >
          <div
            className="advanced-accordion-header"
            onClick={openChannelsAccordion}
          >
            <p className="advanced-accordion-title">Channels</p>
          </div>
          <div className="advanced-accordion-content">
            {channels.map(channel => (
              <Channel
                address={channel.remote_pubkey}
                receivable={channel.remote_balance}
                sendable={channel.local_balance}
                ip={channel.ip}
                active={channel.active}
                key={channel.chan_id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPage;
