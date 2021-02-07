import Http from "axios";

export const ACTIONS = {
  LOAD_BALANCE: "wallet/balance/load",
  LOAD_USD_RATE: "wallet/usdRate/load",
  LOAD_TRANSACTIONS: "wallet/transactions/load",
  LOAD_MORE_TRANSACTIONS: "wallet/transactions/loadMore",
  LOAD_CHANNELS: "wallet/channels/load",
  LOAD_MORE_CHANNELS: "wallet/channels/loadMore",
  LOAD_INVOICES: "wallet/invoices/load",
  LOAD_MORE_INVOICES: "wallet/invoices/loadMore",
  LOAD_PAYMENTS: "wallet/payments/load",
  LOAD_MORE_PAYMENTS: "wallet/payments/loadMore",
  LOAD_RECENT_TRANSACTIONS: "wallet/recentTransactions/load",
  RESET_RECENT_TRANSACTIONS: "wallet/recentTransactions/reset"
};

export const fetchWalletBalance = () => async dispatch => {
  const { data } = await Http.get(`/api/lnd/balance`);

  dispatch({
    type: ACTIONS.LOAD_BALANCE,
    data: {
      channelBalance: data.channel_balance,
      confirmedBalance: data.confirmed_balance,
      pendingChannelBalance: data.pending_channel_balance
    }
  });

  return data;
};

export const fetchUSDRate = () => async dispatch => {
  const { data } = await Http.get(
    "https://api.coindesk.com/v1/bpi/currentprice.json"
  );
  console.log("Coindesk:", data, data.bpi.USD.rate_float);
  const exchangeRate = data.bpi.USD.rate.replace(/,/g, "");

  dispatch({
    type: ACTIONS.LOAD_USD_RATE,
    data: exchangeRate
  });

  return exchangeRate;
};

export const fetchTransactions = ({
  page,
  itemsPerPage = 10,
  reset = false
}) => async (dispatch, getState) => {
  const { transactions } = getState().wallet;

  if ((transactions.page >= page && !reset) || transactions.totalPages < page) {
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

  return data;
};

export const fetchChannels = () => async dispatch => {
  const { data } = await Http.get("/api/lnd/listchannels");

  dispatch({
    type: ACTIONS.LOAD_CHANNELS,
    data: data.channels
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
