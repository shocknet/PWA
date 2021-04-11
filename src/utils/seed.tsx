import Http from "./Http";


export const EnrollToken = async (seedUrl,seedToken) => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const token = Array.prototype.map.call(array, x => ('00' + x.toString(16)).slice(-2)).join('');
    const reqData = {
      seed_token: seedToken,
      wallet_token: token
    }
    const res = await fetch(`${seedUrl}/api/enroll_token`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify(reqData)
    })
    if (res.status !== 200) {
      throw new Error('torrentSeed service currently not available')
    }
    return token
}

export const RequestToken = async ({
  availableTokens,
  seedUrl,
  seedToken,
  seedProviderPub,
  serviceID,
  servicePrice
}) => {
  let tokenInfo = null
  let deleteToken = false
  let availableToken = null
  for (const key in availableTokens) {
    if (Object.prototype.hasOwnProperty.call(availableTokens, key)) {
      const element = availableTokens[key];
      if(element[0]){
        availableToken = {seedUrl:key,tokens:element}
        break
      }
    }
  }
  console.log(seedProviderPub)
  console.log(serviceID)
  console.log(servicePrice)
  if(seedUrl && seedToken){
    console.log("USING SELF SEED TOKEN")
    const token = await EnrollToken(seedUrl,seedToken)
    console.log("token")
    console.log(token)
    tokenInfo = {seedUrl, tokens:[token]}
  } else if(availableToken) {
    console.log("USING AVAILABLE TOKEN")
    tokenInfo = availableToken
    deleteToken = true
  } else if(seedProviderPub && serviceID && servicePrice){
    console.log("USING DEFAULT TOKEN PROVIDER")
    const {data,status} = await Http.post('/api/lnd/unifiedTrx',{
      type: 'service',
      amt: servicePrice,
      to:seedProviderPub,
      memo:'',
      feeLimit:500,
      ackInfo:serviceID
    })
    if(status !== 200){
      throw new Error("seed token request failed")
    }
    console.log(data)
    const {orderAck} = data
    tokenInfo = JSON.parse(orderAck.response)
  } else {
    throw new Error("provide the token data or use default seed provider")
  }
  return {...tokenInfo,deleteToken}
}