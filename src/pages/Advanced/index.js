// @ts-check
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
/**
 * @typedef {import('shock-common').Channel} Channel
 */
import {
  fetchChannels,
  fetchInvoices,
  fetchPeers,
  fetchTransactions
} from "../../actions/WalletActions";
import { convertSatsToUSD, formatNumber } from "../../utils/Number";
import MainNav from "../../common/MainNav";
import AddBtn from "../../common/AddBtn";
// import Invoice from "./components/Invoice";
import Transaction from "./components/Transaction";
import Channel from "./components/Channel";
import Peer from "./components/Peer";
import AddPeerModal from "./components/AddPeerModal";
import AddChannelModal from "./components/AddChannelModal";
import InfoModal from "./components/InfoModal";
import * as Utils from "../../utils";
import Http from "../../utils/Http";
import * as Store from "../../store";
import "./css/index.scoped.css";

/**
 * @typedef {Channel & { pendingStatus: string , ip: string }} PendingChannel
 */

const AdvancedPage = () => {
  const [selectedAccordion, setSelectedAccordion] = useState("transactions");
  const [page] = useState(1);
  const [addPeerOpen, setAddPeerOpen] = useState(false);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [infoModalOpen, toggleInfoModal] = Utils.useBooleanState(false);

  const [pendingChannels, setPendingChannels] = useState(
    /** @type {readonly PendingChannel[]} */ ([])
  );

  const dispatch = useDispatch();
  const confirmedBalance = Store.useSelector(
    ({ wallet }) => wallet.confirmedBalance
  );
  const channelBalance = Store.useSelector(
    ({ wallet }) => wallet.channelBalance
  );
  const transactions = Store.useSelector(({ wallet }) => wallet.transactions);
  // const invoices = Store.useSelector(({ wallet }) => wallet.invoices);
  const channels = Store.useSelector(({ wallet }) => wallet.channels);
  const peers = Store.useSelector(({ wallet }) => wallet.peers);
  const USDRate = Store.useSelector(({ wallet }) => wallet.USDRate);

  useEffect(() => {
    const reset = page === 1;
    dispatch(fetchTransactions({ page, reset }));
    dispatch(fetchInvoices({ page, reset }));
    dispatch(fetchChannels());
    dispatch(fetchPeers());
  }, [page, dispatch]);

  //effect to load pending channels, no need to keep them in redux
  useEffect(() => {
    Http.get("/api/lnd/pendingchannels").then(({ data }) => {
      console.log("pending channels:");
      console.log(data);
      const makeChanObj = (ch, pendingStatus) => ({
        remote_pubkey: ch.remote_node_pub,
        remote_balance: ch.remote_balance,
        local_balance: ch.local_balance,
        ip: "",
        active: false,
        pendingStatus
      });
      const pending = [];
      data.pending_open_channels.forEach(chan => {
        const { channel } = chan;
        pending.push(makeChanObj(channel, "Pending Open"));
      });
      data.waiting_close_channels.forEach(chan => {
        const { channel } = chan;
        pending.push(makeChanObj(channel, "Pending Close"));
      });
      data.pending_force_closing_channels.forEach(chan => {
        const { channel } = chan;
        pending.push(makeChanObj(channel, "Pending Force Close"));
      });
      setPendingChannels(pending);
    });
  }, []);

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

  // const openInvoicesAccordion = useCallback(() => {
  //   openAccordion("invoices");
  // }, [openAccordion]);

  const openChannelsAccordion = useCallback(() => {
    openAccordion("channels");
  }, [openAccordion]);

  return (
    <div className="page-container advanced-page">
      <div className="advanced-header">
        <MainNav absolute pageTitle="ADVANCED" enableBackButton={false} />
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
        <span className="open-info-btn" onClick={toggleInfoModal}>
          Node Info <i className="fas fa-info-circle" />
        </span>
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
                  unconfirmed={transaction.num_confirmations === 0}
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
                  key={peer.address + peer.pub_key}
                />
              ))}
            </div>
            <AddBtn nestedMode relative>
              <AddBtn
                label="ADD PEER"
                onClick={toggleAddPeerOpen}
                icon="link"
              />
            </AddBtn>
          </div>
        </div>
        {/* <div
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
        </div> */}
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
                  active={channel.active}
                  key={channel.chan_id}
                />
              ))}
              {pendingChannels.map(channel => (
                <Channel
                  address={channel.remote_pubkey}
                  receivable={channel.remote_balance}
                  sendable={channel.local_balance}
                  active={channel.active}
                  key={channel.chan_id}
                  pendingStatus={channel.pendingStatus}
                />
              ))}
              <AddBtn nestedMode relative>
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
      <InfoModal modalOpen={infoModalOpen} toggleModal={toggleInfoModal} />
    </div>
  );
};

export default AdvancedPage;
