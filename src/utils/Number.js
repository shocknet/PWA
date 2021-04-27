// Use Big.js to avoid large number inaccuracy issues
import Big from "big.js";

const COMMA_REGEX = /(\d+)(\d{3})/gi;

export const SAT_DENOMINATION = 100000000;

const _addCommas = number => {
  const test = COMMA_REGEX.test(number);

  if (test) {
    const newNumber = number.replace(COMMA_REGEX, "$1,$2");
    return _addCommas(newNumber);
  }

  return number;
};

export const formatNumber = (value = "") => {
  const [number, decimal] = value.split(".");
  const formattedNumber = _addCommas(number);
  const formattedDecimal = decimal ? "." + decimal : "";

  return formattedNumber + formattedDecimal;
};

export const convertSatsToUSD = (sats, USDRate = "0") => {
  //console.debug(`Converting ${sats} Sats to USD (${USDRate})`);
  const confirmedBalanceBTC = Big(sats).div(SAT_DENOMINATION).toString();

  return Big(USDRate?.toString() || "0").times(confirmedBalanceBTC);
};
