import { ACTIONS } from "../actions/FeesActions";

const INITIAL_STATE = {
  source: "https://mempool.space/api/v1/fees/recommended",
  rate: "halfHourFee",
  feeRates: {
    fastestFee: 0,
    halfHourFee: 0,
    hourFee: 0
  }
};

const fees = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.RESET_FEES: {
      return INITIAL_STATE;
    }
    case ACTIONS.LOAD_FEE_RATES: {
      const feeRates = action.data;
      return {
        ...state,
        feeRates
      };
    }
    case ACTIONS.SET_SOURCE: {
      const source = action.data;
      return {
        ...state,
        source
      };
    }
    case ACTIONS.SET_RATE: {
      const rate = action.data;
      return {
        ...state,
        rate
      };
    }
    default:
      return state;
  }
};

export default fees;
