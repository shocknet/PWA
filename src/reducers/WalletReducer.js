// @ts-check
/**
 * @typedef {import('shock-common').Channel} Channel
 */

import Big from "big.js";
import { ACTIONS } from "../actions/WalletActions";

const INITIAL_STATE = {
  // Wallet Balance
  totalBalance: "0",
  channelBalance: "0",
  confirmedBalance: "0",
  pendingChannelBalance: "0",
  USDRate: null,

  transactions: { content: [], page: -1, totalPages: 0, totalItems: 0 },
  payments: { content: [], page: -1, totalPages: 0, totalItems: 0 },
  /**
   * @type {readonly Channel[]}
   */
  channels: [],
  invoices: { content: [], page: -1, totalPages: 0, totalItems: 0 },
  peers: [],
  // Includes transactions, payments and invoices combined with a unified schema
  // and sorted by date
  recentTransactions: []
};

const _getUnifiedTransactionDate = item =>
  parseInt(item.creation_date || item.settle_date || item.time_stamp, 10);

/**
 * @returns {typeof INITIAL_STATE}
 */
const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_BALANCE: {
      const {
        channelBalance,
        confirmedBalance,
        pendingChannelBalance
      } = action.data;
      const totalBalance = new Big(confirmedBalance)
        .add(channelBalance)
        .add(pendingChannelBalance)
        .toString();

      return {
        ...state,
        totalBalance,
        channelBalance,
        confirmedBalance,
        pendingChannelBalance
      };
    }
    case ACTIONS.LOAD_USD_RATE: {
      const { data } = action;

      return {
        ...state,
        USDRate: data
      };
    }
    case ACTIONS.LOAD_PEERS: {
      const { data } = action;

      return {
        ...state,
        peers: data
      };
    }
    case ACTIONS.ADD_PEER: {
      const { data } = action;

      return {
        ...state,
        peers: [data, ...state.peers]
      };
    }
    case ACTIONS.REMOVE_PEER: {
      const { data } = action;

      return {
        ...state,
        peers: state.peers.filter(peer => peer.pub_key !== data.publicKey)
      };
    }
    case ACTIONS.LOAD_CHANNELS: {
      const { data } = action;

      return {
        ...state,
        channels: data
      };
    }
    case ACTIONS.LOAD_TRANSACTIONS: {
      const { data } = action;

      return {
        ...state,
        transactions: data
      };
    }
    case ACTIONS.LOAD_MORE_TRANSACTIONS: {
      const { data } = action;

      return {
        ...state,
        transactions: {
          ...data,
          content: [...state.transactions.content, ...data.content]
        }
      };
    }
    case ACTIONS.LOAD_INVOICES: {
      const { data } = action;

      return {
        ...state,
        invoices: data
      };
    }
    case ACTIONS.LOAD_MORE_INVOICES: {
      const { data } = action;

      return {
        ...state,
        invoices: {
          ...data,
          content: [...state.invoices.content, ...data.content]
        }
      };
    }
    case ACTIONS.LOAD_PAYMENTS: {
      const { data } = action;

      return {
        ...state,
        payments: data
      };
    }
    case ACTIONS.LOAD_MORE_PAYMENTS: {
      const { data } = action;

      return {
        ...state,
        payments: {
          ...data,
          content: [...state.payments.content, ...data.content]
        }
      };
    }
    case ACTIONS.LOAD_RECENT_TRANSACTIONS: {
      const { transactions, payments, invoices } = action.data;
      const newRecentTransactions = [
        ...transactions.content,
        ...payments.content,
        ...invoices.content
      ]
        .sort((a, b) => {
          const aDate = _getUnifiedTransactionDate(a);
          const bDate = _getUnifiedTransactionDate(b);

          return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
        })
        .map(item => {
          const date = _getUnifiedTransactionDate(item);

          if (item.payment_hash) {
            return {
              type: "payment",
              hash: item.payment_hash,
              value: item.value,
              date
            };
          }

          if (item.payment_request) {
            return {
              type: "invoice",
              hash: item.payment_request,
              value: item.value,
              date,
              message: item.memo
            };
          }

          if (item.tx_hash) {
            return {
              type: "chain",
              hash: item.tx_hash,
              value: item.amount,
              date,
              message: item.label
            };
          }

          console.warn("Invalid transaction detected", item);
          return null;
        })
        .filter(item => item !== null);

      return {
        ...state,
        transactions,
        payments,
        invoices,
        recentTransactions: newRecentTransactions
      };
    }
    case ACTIONS.RESET_RECENT_TRANSACTIONS: {
      return {
        ...state,
        recentTransactions: []
      };
    }
    default:
      return state;
  }
};

export default wallet;
