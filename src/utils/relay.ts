const relayIDIdentifier = '@'
const AccessSecretIdentifier = '#'
export const ParseNodeIP = (hostIdentifier:string) =>{
  const hasRelayID = hostIdentifier.includes(relayIDIdentifier)
  const hasAccessSecret = hostIdentifier.includes(AccessSecretIdentifier)
  if(hasRelayID && hasAccessSecret){
    const [accessSecret, rest] = hostIdentifier.split(AccessSecretIdentifier)
    const [relayId,hostIP] = rest.split(relayIDIdentifier)
    return [hostIP, relayId, accessSecret]
  }
  if(hasAccessSecret){
    const [accessSecret, hostIP] = hostIdentifier.split(AccessSecretIdentifier)
    return [hostIP, null, accessSecret]
  }
  if(hasRelayID){
    const [relayId,hostIP] = hostIdentifier.split(relayIDIdentifier)
    return [hostIP, relayId, null]
  }
  return [hostIdentifier,null, null]
}