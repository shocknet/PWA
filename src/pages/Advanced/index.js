import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import {
  fetchChannels,
  fetchInvoices,
  fetchPeers,
  fetchTransactions
} from "../../actions/WalletActions";
import { convertSatsToUSD, formatNumber } from "../../utils/Number";
import MainNav from "../../common/MainNav";
import AddBtn from "../../common/AddBtn";
import Invoice from "./components/Invoice";
import Transaction from "./components/Transaction";
import Channel from "./components/Channel";
import Peer from "./components/Peer";
import AddPeerModal from "./components/AddPeerModal";
import AddChannelModal from "./components/AddChannelModal";
import "./css/index.css";

const AdvancedPage = () => {
  const [selectedAccordion, setSelectedAccordion] = useState("transactions");
  const [page, setPage] = useState(1);
  const [addPeerOpen, setAddPeerOpen] = useState(false);
  const [addChannelOpen, setAddChannelOpen] = useState(false);

  const dispatch = useDispatch();
  const confirmedBalance = useSelector(({ wallet }) => wallet.confirmedBalance);
  const channelBalance = useSelector(({ wallet }) => wallet.channelBalance);
  const transactions = useSelector(({ wallet }) => wallet.transactions);
  const invoices = useSelector(({ wallet }) => wallet.invoices);
  const channels = useSelector(({ wallet }) => wallet.channels);
  const peers = useSelector(({ wallet }) => wallet.peers);
  const USDRate = useSelector(({ wallet }) => wallet.USDRate);

  useEffect(() => {
    const reset = page === 1;
    dispatch(fetchTransactions({ page, reset }));
    dispatch(fetchInvoices({ page, reset }));
    dispatch(fetchChannels());
    dispatch(fetchPeers());
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

  const toggleAddPeerOpen = useCallback(() => {
    setAddPeerOpen(!addPeerOpen);
  }, [addPeerOpen]);

  const toggleAddChannelOpen = useCallback(() => {
    setAddChannelOpen(!addChannelOpen);
  }, [addChannelOpen]);

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
          <div className="advanced-accordion-content-container">
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
          <div className="advanced-accordion-content-container">
            <div className="advanced-accordion-content">
              {peers.map(peer => (
                <Peer
                  address={peer.address}
                  publicKey={peer.pub_key}
                  sent={peer.sat_sent}
                  received={peer.sat_recv}
                />
              ))}
            </div>
            <AddBtn nestedMode>
              <AddBtn
                label="ADD PEER"
                small
                onClick={toggleAddPeerOpen}
                icon="link"
              />
            </AddBtn>
          </div>
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
          <div className="advanced-accordion-content-container">
            <div className="advanced-accordion-content">
              {invoices.content
                .slice()
                .reverse()
                .map(invoice => (
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
          <div className="advanced-accordion-content-container">
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
              <AddBtn nestedMode>
                <AddBtn
                  label="ADD CHANNEL"
                  small
                  onClick={toggleAddChannelOpen}
                  icon="exchange-alt"
                />
              </AddBtn>
            </div>
          </div>
        </div>
      </div>
      <AddPeerModal open={addPeerOpen} toggleModal={toggleAddPeerOpen} />
      <AddChannelModal
        open={addChannelOpen}
        toggleModal={toggleAddChannelOpen}
      />
    </div>
  );
};

export default AdvancedPage;
