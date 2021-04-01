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