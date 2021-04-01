import React, {  useCallback,   useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import {addStream,removeStream} from "../../actions/ContentActions"
import "./css/index.css";
import Loader from "../../common/Loader";
import Http from "../../utils/Http";
import DialogNav from "../../common/DialogNav";
import obsLogo from "../../images/obs-2.svg"
import Stream from "../../common/Post/components/Stream";
import {EnrollToken} from '../../utils/seed'

const GoLive = () => {
  const dispatch = useDispatch();
  //@ts-ignore
  const seedProviderPub = useSelector(({content}) => content.seedProviderPub)
  //@ts-ignore
  const {seedUrl,seedToken} = useSelector(({content}) => content.seedInfo)
  //@ts-ignore
  const streamLiveToken = useSelector(({content}) => content.streamLiveToken)
  //@ts-ignore
  const streamUserToken = useSelector(({content}) => content.streamUserToken)
  //@ts-ignore
  const availableStreamTokens = useSelector(({content}) => content.availableStreamTokens)
  const [selectedSource, setSelectedSource] = useState('obs');
  const [loading, setLoading] = useState(false);
  const [streamToken,setStreamToken] = useState(streamLiveToken)
  const [userToken,setUserToken] = useState(streamUserToken)
  const [paragraph,setParagraph] = useState("Look I'm streaming!")
  const [isLive,setIsLive] = useState(true)
  const [error, setError] = useState<string|null>(null);
  const [rtmpUri,setRtmpUri] = useState("")
  const [rtmpApiUri,setRtmpApiUri] = useState("")
  const [useDefault,setUseDefault] = useState(false)
  const enroll = useCallback(async () =>{
    try {
      setLoading(true)
      let orderData = null
      let deleteToken = false
        let availableToken = null
        for (const key in availableStreamTokens) {
          if (Object.prototype.hasOwnProperty.call(availableStreamTokens, key)) {
            const element = availableStreamTokens[key];
            if(element[0]){
              availableToken = {seedUrl:key,tokens:element}
              break
            }
          }
        }
      if(seedUrl && seedToken){
        console.log("USING SELF SEED TOKEN")
        const token = await EnrollToken(seedUrl,seedToken)
        orderData = {seedUrl, tokens:[token]}
      }else if(useDefault){
        console.log("USING DEFAULT TOKEN PROVIDER")
        const {data:seedData,status} = await Http.post('/api/lnd/unifiedTrx',{
          type: 'streamSeed',
          amt: 100,
          to:seedProviderPub, 
          memo:'',
          feeLimit:500,
          ackInfo:1
        })
        if(status !== 200){
          setError("seed token request failed")
          setLoading(false)
        }
        console.log(seedData)
        const {orderAck} = seedData
        orderData = JSON.parse(orderAck.response)
      } else if(availableToken) {
        console.log("USING AVAILABLE TOKEN")
        orderData = availableToken
        deleteToken = true
      }
      const {tokens,seedUrl:finalSeedUrl} = orderData
      const [latestUserToken] = tokens
      setUserToken(latestUserToken)
      const {data:streamData} = await Http.post(
        `${finalSeedUrl}/api/stream/auth`,
        { token: latestUserToken }
      );
      const {token:obsToken} = streamData.data;
      console.log(obsToken)
      const liveToken = `${latestUserToken}?key=${obsToken}`
      setStreamToken(`${latestUserToken}?key=${obsToken}`)
      const rtmp = finalSeedUrl.replace('https','rtmp')
      setRtmpUri(`${rtmp}/live`)
      setRtmpApiUri(`${finalSeedUrl}/rtmpapi`)
      addStream(latestUserToken,liveToken)(dispatch)
      let contentItems = []
      if(paragraph !== ''){
        contentItems.push({
          type: 'text/paragraph',
          text: paragraph,
        })
      }
      contentItems.push({
        type:'stream/embedded',
        width:0,
        height:0,
        magnetURI:`${finalSeedUrl}/rtmpapi/live/${latestUserToken}/index.m3u8`,
        isPreview:false,
        isPrivate:false,
        userToken:latestUserToken
      })
      const res = await Http.post(`/api/gun/wall`, {
        tags: [],
        title: 'Post',
        contentItems,
      })
      if (res.status === 200) {
        console.log('post created successfully')
        setLoading(false)
      } else {
        setError('invalid response status')
        setLoading(false)
      }
      
    } catch(err) {
      console.log(err)
      setError(err?.errorMessage ?? err?.message)
      setLoading(false)
    }
  },[paragraph,seedProviderPub,availableStreamTokens,seedUrl,seedToken,useDefault,setLoading,setStreamToken,setError,setUserToken,setRtmpUri,setRtmpApiUri,addStream])
  const copyToken = useCallback(() => {
    navigator.clipboard.writeText(streamToken);
  }, [streamToken]);
  const copyUri = useCallback(() => {
    navigator.clipboard.writeText(rtmpUri);
  }, []);
  const onInputChange = useCallback(e => {
    const { value, name,checked } = e.target;
    switch (name) {
      case "paragraph": {
        setParagraph(value)
        return;
      }
      case "source": {
        setSelectedSource(value)
        return;
      }
      case "useDefault":{
        setUseDefault(checked)
        return
      }
      default:
        return;
    }
  }, [setParagraph,setSelectedSource]);
  const stopStream = useCallback(()=>{
    removeStream()(dispatch)
    window.history.back();
  },[])
  return <div className="h-100 m-1">
    {loading ? (
      <Loader overlay fullScreen text="" />
    ) : null}
    <DialogNav  drawerVisible={false} pageTitle="GO LIVE" />
    
    {/*@ts-expect-error */}
    {isLive && <div ><Stream
      hideRibbon={true}
      item={{magnetURI:`${rtmpApiUri}/live/${userToken}/index.m3u8`}}
    /></div>}
    <select value={selectedSource} onChange={onInputChange} name="source" id="source" style={{backgroundColor:"rgba(0,0,0,0)",color:'white',width:'100%',border:'0',marginBottom:'1em'}}>
      <option value="camera" style={{backgroundColor:"rgba(0,0,0,0)",color:'var(--main-blue)'}}>Camera</option>
      <option value="obs" style={{backgroundColor:"rgba(0,0,0,0)",color:'var(--main-blue)'}}>OBS</option>
    </select>
    <div className="flex-center m-b-1">
      {selectedSource === 'obs' && <img src={obsLogo} style={{width:"10em",height:"10em"}}alt=""/>}
      {selectedSource === 'camera' && <i className="fas fa-camera" style={{fontSize:"10em"}}></i>}
    </div>
    {streamToken ? <div  >
        {selectedSource === 'obs' && <p className="m-b-1">You are ready to go! setup the stream with OBS and watch it from your profile</p>}
        <p>Broadcaster:</p>
        <div style={{border:"1px solid var(--main-blue)",padding:"0.5rem",display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
          <p >{rtmpUri.substring(0,20)+ (rtmpUri.length >21 ? "..." : "") }</p>
          <i className="far fa-copy" onClick={copyUri}></i>
        </div>
        <p>Stream Key:</p>
        <div style={{border:"1px solid var(--main-blue)",padding:"0.5rem",display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
          <p >{streamToken.substring(0,20)+ (streamToken.length >21 ? "..." : "")}</p>
          <i className="far fa-copy" onClick={copyToken}></i>
        </div>
        <div className="flex-center">
          <button onClick={stopStream} className ="shock-form-button-confirm">STOP</button>
        </div>
      </div>
      : <div className="vertical-flex-center">
        <div style={{display:'flex',alignItems:'center',marginLeft:'auto'}}>
        <label htmlFor="useDefault">Use default seed provider</label>
        <input type="checkbox" name="useDefault" checked={useDefault} onChange={onInputChange} style={{marginLeft:"0.2em"}}  />
      </div>
        <input className="input-field" type="text" name="paragraph" id="paragraph" value={paragraph} onChange={onInputChange}/>
        <button onClick={enroll} className ="shock-form-button-confirm">START NOW</button>
      </div>}
      {error ? <p className="error-container">{error}</p> : null}
  </div>
}

export default GoLive