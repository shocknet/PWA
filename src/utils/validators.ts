const btcAddress = /^(bc(1|r)|[123]|m|n|((t|x)pub)|(tb1))[a-zA-HJ-NP-Z0-9]{25,90}$/
const lnInvoice = /^(ln(tb|bc|bcrt))[0-9][a-z0-9]{180,7089}$/
const lnPubKey = /^[a-f0-9]{66}$/

export const removePrefix = (data:string):string => {
  let value = data
  if (data.includes('bitcoin:')) {
    ;[, value] = data.split('bitcoin:')
  } else if (data.includes('lightning:')) {
    ;[, value] = data.split('lightning:')
  } else if (data.includes('LIGHTNING:')) {
    ;[, value] = data.split('LIGHTNING:')
  }

  return value
}

export const hasAmount = (data:string):{address:string,amount:undefined|string} => {
  if (data.includes('?amount=')) {
    const amountSplit = data.split('?amount=')

    const amount = Math.floor(Number(amountSplit[1]) * 100000000)
    return { address: amountSplit[0], amount: amount.toString() }
  }
  return { address: data, amount: undefined }
}


export const isBitcoinAddress = (data:string) => {
  return btcAddress.test(data)
}

export const isLightningPaymentRequest = (data:string) =>
  lnInvoice.test(data.toLowerCase())

export const isLightningPubKey = (data:string) => lnPubKey.test(data)


export const isShockPubKey = (data:string) => data.startsWith('$$__SHOCKWALLET__USER__')


export const findlnurl = (data:string) => {
  const res = /^(http.*[&?]lightning=)?((lnurl)([0-9]{1,}[a-z0-9]+){1})/.exec(
    data.toLowerCase(),
  )
  if (res) {
    return res[2]
  }
  return null
}
export type ExtractedBTCAddress = {
  type: 'btc',
  address:string,
  amount?:string
}
export type ExtractedLNInvoice = {
  type: 'ln',
  request:string,
}
export type ExtractedKeysend = {
  type: 'keysend',
  address:string,
}
export type ExtractedShockPK = {
  type: 'pk',
  pk:string,
}
export type ExtractedLNURL = {
  type: 'lnurl',
  lnurl:string,
}
export type ExtractedUnknown = {
  type: 'unknown',
}

/**
 * @param {string} data
 * @returns {ExtractedBTCAddress|ExtractedLNInvoice|ExtractedKeysend|ExtractedShockPK|ExtractedUnknown|ExtractedLNURL}
 */
const extractInfo = (data:string):ExtractedBTCAddress|ExtractedLNInvoice|ExtractedKeysend|ExtractedShockPK|ExtractedUnknown|ExtractedLNURL => {
  const cleanData = removePrefix(data)
  const { address, amount } = hasAmount(cleanData)
  if (isBitcoinAddress(address)) {
    return {
      type: 'btc',
      address,
      amount,
    }
  }
  if (isLightningPaymentRequest(cleanData)) {
    return {
      type: 'ln',
      request: cleanData,
    }
  }
  if (isLightningPubKey(cleanData)) {
    return {
      type: 'keysend',
      address: cleanData,
    }
  }
  if (isShockPubKey(cleanData)) {
    return {
      type: 'pk',
      pk: cleanData,
    }
  }

  const found = findlnurl(cleanData)
  if (found) {
    return {
      type: 'lnurl',
      lnurl: found.toUpperCase(),
    }
  }
  return { type: 'unknown' }
}

export default extractInfo
