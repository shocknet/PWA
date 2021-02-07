export const initialMessagePrefix = "$$__SHOCKWALLET__INITIAL__MESSAGE";

export const invoiceMessagePrefix = "$$__SHOCKWALLET__INVOICE__";

export const userMessagePrefix = "$$__SHOCKWALLET__USER__";

export const capitalizeText = text =>
  text
    .split(" ")
    .map(
      word => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`
    )
    .join(" ");

export const processDisplayName = (publicKey = "", displayName = "") => {
  if (displayName) {
    return displayName;
  }

  const suffix = publicKey.slice(-8);

  return `Anon${suffix}`;
};
