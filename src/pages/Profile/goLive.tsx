import React, {  useCallback,   useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import "./css/index.css";
import Loader from "../../common/Loader";
import Http from "../../utils/Http";
import DialogNav from "../../common/DialogNav";

const REACT_APP_SL_SEED_URI = "https://webtorrent.shock.network"
const REACT_APP_SL_RTMP_API_URI = "https://sandbox.shock.network/cdn/streams"
const REACT_APP_SL_RTMP_URI = "rtmp://webtorrent.shock.network/live"

const GoLive = () => {
  const dispatch = useDispatch();
  //@ts-ignore
  const seedProviderPub = useSelector(({content}) => content.seedProviderPub)
  const [loading, setLoading] = useState(false);
  const [streamToken,setStreamToken] = useState("")
  const [paragraph,setParagraph] = useState("Look I'm streaming!")
  const [error, setError] = useState<string|null>(null);
  const enroll = useCallback(async () =>{
    try {
      setLoading(true)
      const {data:seedData,status} = await Http.post('/api/lnd/unifiedTrx',{
        type: 'torrentSeed',//TODO change to 'liveSeed'
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
      const orderData = JSON.parse(orderAck.response)
      const {tokens} = orderData
      const [seedToken] = tokens

      const {data:streamData} = await Http.post(
        `${REACT_APP_SL_SEED_URI}/api/stream/auth`,
        { token: seedToken }
      );
      const {token:liveToken} = streamData.data;
      console.log(liveToken)
      setStreamToken(`${seedToken}?key=${liveToken}`)
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
        magnetURI:`${REACT_APP_SL_RTMP_API_URI}/live/${seedToken}/index.m3u8`,
        isPreview:false,
        isPrivate:false
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
  },[paragraph,seedProviderPub,setLoading,setStreamToken,setError])
  const copyToken = useCallback(() => {
    navigator.clipboard.writeText(streamToken);
  }, [streamToken]);
  const copyUri = useCallback(() => {
    navigator.clipboard.writeText(REACT_APP_SL_RTMP_URI);
  }, []);
  const onInputChange = useCallback(e => {
    const { value, name } = e.target;
    switch (name) {
      case "paragraph": {
        setParagraph(value)
        return;
      }
      default:
        return;
    }
  }, [setParagraph]);
  return <div className="h-100">
    {loading ? (
      <Loader overlay fullScreen text="" />
    ) : null}
    <DialogNav  drawerVisible={false} pageTitle="GO LIVE" />
    <div className="vertical-flex-center screen-max">
      {streamToken ? <div className="vertical-flex-center w-50" >
        <p>You are ready to go! setup the stream with OBS and watch it from your profile</p>
        <button onClick={copyUri} className ="shock-form-button-confirm m-1">COPY URI</button>
        <button onClick={copyToken} className ="shock-form-button-confirm m-1">COPY TOKEN</button>
      </div>
      : <div className="vertical-flex-center w-50" >
        <input className="input-field" type="text" name="paragraph" id="paragraph" value={paragraph} onChange={onInputChange}/>
        <button onClick={enroll} className ="shock-form-button-confirm">START NOW</button>
      </div>}
      {error ? <p className="error-container">{error}</p> : null}
    </div>
  </div>
}

export default GoLive