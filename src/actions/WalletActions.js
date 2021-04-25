import Http from "axios";

export const ACTIONS = {
  LOAD_BALANCE: "wallet/balance/load",
  LOAD_USD_RATE: "wallet/usdRate/load",
  LOAD_TRANSACTIONS: "wallet/transactions/load",
  LOAD_MORE_TRANSACTIONS: "wallet/transactions/loadMore",
  LOAD_CHANNELS: "wallet/channels/load",
  LOAD_INVOICES: "wallet/invoices/load",
  LOAD_MORE_INVOICES: "wallet/invoices/loadMore",
  LOAD_PAYMENTS: "wallet/payments/load",
  LOAD_MORE_PAYMENTS: "wallet/payments/loadMore",
  LOAD_PEERS: "wallet/peers/load",
  ADD_PEER: "wallet/peers/add",
  REMOVE_PEER: "wallet/peers/remove",
  LOAD_RECENT_TRANSACTIONS: "wallet/recentTransactions/load",
  RESET_RECENT_TRANSACTIONS: "wallet/recentTransactions/reset"
};

export const fetchWalletBalance = () => async dispatch => {
  try {
    const { data } = await Http.get(`/api/lnd/balance`);

    dispatch({
      type: ACTIONS.LOAD_BALANCE,
      data: {
        channelBalance: data.channel_balance,
        confirmedBalance: data.confirmed_balance,
        pendingChannelBalance: data.pending_channel_balance
      }
    });
  } catch (e) {
    console.error(
      `When trying to fetch the balance for the wallet, an error ocurred:`,
      e
    );
  }
};

export const fetchUSDRate = () => async dispatch => {
  try {
    const { data } = await Http.get(
      "https://api.coinbase.com/v2/prices/spot?currency=USD"
    );
    const exchangeRate = data.data.amount.replace(/,/g, "");

    dispatch({
      type: ACTIONS.LOAD_USD_RATE,
      data: exchangeRate
    });
  } catch (e) {
    console.error(`An error happened when trying to fetch the USD rate:`, e);
  }
};

export const fetchTransactions = ({
  page,
  itemsPerPage = 10,
  reset = false
}) => async (dispatch, getState) => {
  try {
    const { transactions } = getState().wallet;

    if (
      (transactions.page >= page && !reset) ||
      transactions.totalPages < page
    ) {
      return;
    }

    const { data } = await Http.get("/api/lnd/transactions", {
      params: {
        page,
        itemsPerPage
      }
    });

    dispatch({
      type: reset ? ACTIONS.LOAD_TRANSACTIONS : ACTIONS.LOAD_MORE_TRANSACTIONS,
      data
    });
  } catch (e) {
    console.error(
      `An error ocurred when fetching transactions (fetchTransactions()):`,
      e
    );
  }
};

export const fetchChannels = () => async dispatch => {
  try {
    const { data } = await Http.get("/api/lnd/listchannels");

    dispatch({
      type: ACTIONS.LOAD_CHANNELS,
      data: data.channels
    });
  } catch (e) {
    console.error(
      `An ocurred ocurring when fetching channels (fetchChannels()):`,
      e
    );
  }
};

export const fetchPeers = () => async dispatch => {
  const { data } = await Http.get("/api/lnd/listpeers");

  dispatch({
    type: ACTIONS.LOAD_PEERS,
    data: data.peers
  });

  return data;
};

export const fetchInvoices = ({
  page,
  itemsPerPage = 10,
  reset = false
}) => async (dispatch, getState) => {
  const { invoices } = getState().wallet;

  if ((invoices.page >= page && !reset) || invoices.totalPages < page) {
    return;
  }

  const { data } = await Http.get("/api/lnd/invoices", {
    params: {
      page,
      itemsPerPage
    }
  });

  dispatch({
    type: reset ? ACTIONS.LOAD_INVOICES : ACTIONS.LOAD_MORE_INVOICES,
    data
  });

  return data;
};

export const fetchPayments = ({
  page,
  itemsPerPage = 10,
  reset = false
}) => async (dispatch, getState) => {
  const { payments } = getState().wallet;

  if ((payments.page >= page && !reset) || payments.totalPages < page) {
    return;
  }

  const { data } = await Http.get("/api/lnd/payments", {
    params: {
      page,
      itemsPerPage
    }
  });

  dispatch({
    type: reset ? ACTIONS.LOAD_PAYMENTS : ACTIONS.LOAD_MORE_PAYMENTS,
    data
  });

  return data;
};

export const fetchUnifiedTransactions = () => async dispatch => {
  const { data } = await Http.get("/api/lnd/unifiedTrx");

  dispatch({
    type: ACTIONS.LOAD_RECENT_TRANSACTIONS,
    data
  });

  return data;
};

export const connectPeer = ({ publicKey, host }) => async dispatch => {
  try {
    await Http.post("/api/lnd/connectpeer", {
      pubkey: publicKey,
      host: host
    });

    const newPeer = {
      pub_key: publicKey,
      address: host,
      bytes_sent: 0,
      bytes_recv: 0,
      sat_sent: 0,
      sat_recv: 0,
      inbound: false
    };

    dispatch({
      type: ACTIONS.ADD_PEER,
      data: newPeer
    });

    return newPeer;
  } catch (err) {
    console.error(err);
    throw err?.response?.data ?? err;
  }
};

export const openChannel = ({
  publicKey = "",
  channelCapacity = 0,
  pushAmount = 0
}) => async (dispatch, getState) => {
  try {
    const { feeRates, rate } = getState().fees;
    await Http.post("/api/lnd/openchannel", {
      pubkey: publicKey,
      channelCapacity: channelCapacity.toString(),
      channelPushAmount: pushAmount.toString(),
      satPerByte: feeRates[rate]
    });

    dispatch(fetchChannels());
  } catch (err) {
    console.error(err);
    throw err?.response?.data ?? err;
  }
};
