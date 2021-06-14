import Http from "../utils/Http";

export const ACTIONS = {
  RESET_FEES: "fees/reset",
  LOAD_FEE_RATES: "fees/feeRates/load",
  SET_SOURCE: "fees/source/set",
  SET_RATE: "fees/rate/set"
};

export const loadFeeRates = () => async (dispatch, getState) => {
  const { source } = getState().fees;
  const { data } = await Http.get(source);

  dispatch({
    type: ACTIONS.LOAD_FEE_RATES,
    data
  });

  return data;
};

/**
 * @param {string} source
 */
export const setSource = source => ({
  type: ACTIONS.SET_SOURCE,
  data: source
});

/**
 * @param {import('../schema').FeeRate} rate
 */
export const setRate = rate => ({
  type: ACTIONS.SET_RATE,
  data: rate
});
