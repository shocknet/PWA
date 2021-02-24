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

export const setSource = source => dispatch => {
  dispatch({
    type: ACTIONS.SET_SOURCE,
    data: source
  });

  return source;
};

export const setRate = rate => dispatch => {
  dispatch({
    type: ACTIONS.SET_RATE,
    data: rate
  });

  return rate;
};
