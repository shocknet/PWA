import * as Schema from "../schema";
import { ACTIONS } from "../actions/FeesActions";

export interface FeesState {
  source: string;

  rate: Schema.FeeRate;

  feeRates: Record<Schema.FeeRate, number>;
}

const INITIAL_STATE: FeesState = {
  source: "https://mempool.space/api/v1/fees/recommended",

  rate: "halfHourFee",

  feeRates: {
    fastestFee: 0,
    halfHourFee: 0,
    hourFee: 0
  }
};

const fees = (
  state: FeesState = INITIAL_STATE,
  action: { type: string; data: any }
): FeesState => {
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
