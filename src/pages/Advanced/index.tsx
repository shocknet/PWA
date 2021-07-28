import React from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { Channel as IChannel } from "shock-common";

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

type PendingChannel = IChannel & {
  pendingStatus: string;
  ip: string;
};

const AdvancedPage: React.FC = () => {
  const [selectedAccordion, setSelectedAccordion] = React.useState(
    "transactions"
  );
  const [page] = React.useState(1);
  const [addPeerOpen, setAddPeerOpen] = React.useState(false);
  const [addChannelOpen, setAddChannelOpen] = React.useState(false);
  const [infoModalOpen, toggleInfoModal] = Utils.useBooleanState(false);

  const [pendingChannels, setPendingChannels] = React.useState<
    PendingChannel[]
  >([]);

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

  React.useEffect(() => {
    const reset = page === 1;
    dispatch(fetchTransactions({ page, reset }));
    dispatch(fetchInvoices({ page, reset }));
    dispatch(fetchChannels());
    dispatch(fetchPeers());
  }, [page, dispatch]);

  //effect to load pending channels, no need to keep them in redux
  React.useEffect(() => {
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

  const confirmedBalanceUSD = React.useMemo(
    () => formatNumber(convertSatsToUSD(confirmedBalance, USDRate).toFixed(2)),
    [USDRate, confirmedBalance]
  );
  const channelBalanceUSD = React.useMemo(
    () => formatNumber(convertSatsToUSD(channelBalance, USDRate).toFixed(2)),
    [USDRate, channelBalance]
  );

  const openAccordion = React.useCallback(accordion => {
    setSelectedAccordion(accordion);
  }, []);

  const toggleAddPeerOpen = React.useCallback(() => {
    setAddPeerOpen(!addPeerOpen);
  }, [addPeerOpen]);

  const toggleAddChannelOpen = React.useCallback(() => {
    setAddChannelOpen(!addChannelOpen);
  }, [addChannelOpen]);

  const openTransactionsAccordion = React.useCallback(() => {
    openAccordion("transactions");
  }, [openAccordion]);

  const openPeersAccordion = React.useCallback(() => {
    openAccordion("peers");
  }, [openAccordion]);

  // const openInvoicesAccordion = useCallback(() => {
  //   openAccordion("invoices");
  // }, [openAccordion]);

  const openChannelsAccordion = React.useCallback(() => {
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
              {peers.map((peer, i) => {
                return (
                  <Peer
                    address={peer.address}
                    publicKey={peer.pub_key}
                    sent={peer.sat_sent}
                    received={peer.sat_recv}
                    key={peer.address + peer.pub_key}
                    renderDivider={peers.length > 1 && i !== peers.length - 1}
                  />
                );
              })}
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
              {channels.map((channel, i) => {
                const ip = peers.find(p => p.pub_key)?.address;
                const thereIsMoreThanOneChannel = channels.length > 1;
                const isLastChannel = i === channels.length - 1;
                const thereArePendingChannels = pendingChannels.length > 0;
                const renderDivider =
                  (thereIsMoreThanOneChannel && !isLastChannel) ||
                  thereArePendingChannels;

                return (
                  <Channel
                    publicKey={channel.remote_pubkey}
                    ip={ip}
                    receivable={channel.remote_balance}
                    sendable={channel.local_balance}
                    active={channel.active}
                    key={channel.chan_id}
                    renderDivider={renderDivider}
                  />
                );
              })}
              {pendingChannels.map((channel, i) => {
                const ip = peers.find(p => p.pub_key)?.address;

                return (
                  <Channel
                    publicKey={channel.remote_pubkey}
                    ip={ip}
                    receivable={channel.remote_balance}
                    sendable={channel.local_balance}
                    active={channel.active}
                    key={channel.chan_id}
                    pendingStatus={channel.pendingStatus}
                    renderDivider={
                      pendingChannels.length > 1 &&
                      i !== pendingChannels.length - 1
                    }
                  />
                );
              })}
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
