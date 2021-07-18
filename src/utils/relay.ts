export const ParseNodeIP = (hostIdentifier:string) =>{
  let hostIP = hostIdentifier
  let relayId = null
  if(hostIdentifier.includes('@')){
    [relayId,hostIP] = hostIdentifier.split('@')
  }
  return [hostIP,relayId]
}