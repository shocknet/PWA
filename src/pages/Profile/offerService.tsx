import React, {  useCallback,   useState } from "react";
import { useDispatch } from "react-redux";
import DialogNav from "../../common/DialogNav";
import Loader from "../../common/Loader";
import InputGroup from "../../common/InputGroup"
import {createService} from "../../actions/OrdersActions"


const OfferService = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null)
  const [serviceType,setServiceType] = useState("torrentSeed")
  const [serviceTitle,setServiceTitle] = useState("")
  const [serviceDescription,setServiceDescription] = useState("")
  const [serviceCondition,setServiceCondition] = useState("")
  const [servicePrice,setServicePrice] = useState(0)
  //optional fields 
  const [serviceSeedUrl,setServiceSeedUrl] = useState("")
  const [serviceSeedToken,setServiceSeedToken] = useState("")
  //optional fields streamSeed only
  const [serviceRtmpApiUri,setServiceRtmpApiUri] = useState("")
  const [serviceRtmpUri,setServiceRtmpUri] = useState("")

  const onInputChange = useCallback(e => {
    const { value, name } = e.target;
    e.preventDefault()
    switch (name) {
      case "type": {
        setServiceType(value)
        return
      }
      case "title": {
        setServiceTitle(value)
        return
      }
      case "description": {
        setServiceDescription(value)
        return
      }
      case "conditions": {
        setServiceCondition(value)
        return
      }
      case "price": {
        setServicePrice(value)
        return
      }
      case "seedUri": {
        setServiceSeedUrl(value)
        return
      }
      case "seedToken": {
        setServiceSeedToken(value)
        return
      }
      case "rtmpApiUri": {
        setServiceRtmpApiUri(value)
        return
      }
      case "rtmpUri": {
        setServiceRtmpUri(value)
        return
      }
      default:
        return;
    }
  }, [setServiceType,setServiceTitle,setServiceDescription,setServiceCondition,setServicePrice,setServiceSeedUrl,setServiceSeedToken,setServiceRtmpApiUri,setServiceRtmpUri]);
  const onSubmit = useCallback(
    async e => {
      e.preventDefault()
      console.log(serviceType)
      console.log(serviceTitle)
      console.log(serviceDescription)
      console.log(serviceCondition)
      console.log(servicePrice)
      const clear = {serviceType,serviceTitle,serviceDescription,serviceCondition,servicePrice}
      const encrypt = {serviceSeedUrl,serviceSeedToken,serviceRtmpApiUri,serviceRtmpUri}
      const res = await createService(clear,encrypt)(dispatch)
      console.log(res)
    },
    [serviceType,serviceTitle,serviceDescription,serviceCondition,servicePrice,serviceSeedUrl,serviceSeedToken,serviceRtmpApiUri,serviceRtmpUri]
  );
  const onDiscard = useCallback(
    async e => {
      e.preventDefault();
      setError(null)
      setServiceType("torrentSeed")
      setServiceTitle("")
      setServiceDescription("")
      setServiceCondition("")
      setServicePrice(0)
      setServiceSeedUrl("")
      setServiceSeedToken("")
      setServiceRtmpApiUri("")
      setServiceRtmpUri("")

    },
    [setError,setServiceType,setServiceTitle,setServiceDescription,setServiceCondition,setServicePrice,setServiceSeedUrl,setServiceSeedToken,setServiceRtmpApiUri,setServiceRtmpUri]
  );
  
  return (<div className="publish-content-form-container m-1" style={{overflow:'auto'}}>
  {loading ? (
    <Loader overlay fullScreen text="Unlocking Wallet..." />
  ) : null}
  <DialogNav  drawerVisible={false}  pageTitle="OFFER SERVICE" />
  <form className="publish-content-form" onSubmit={onSubmit} onReset={onDiscard}>
    <div style={{display:'flex',justifyContent:'center',marginBottom:"1rem"}}>
      <div >
        <h2>Offer service</h2>
        <div className="line"></div>
      </div>
    </div>
    <div >
      <select name="type" value={serviceType} onChange={onInputChange}>
        <option value="torrentSeed">TORRENT SEED SERVICE</option>
        <option value="streamSeed">STREAM SEED SERVICE</option>
      </select>
      <InputGroup  
        label="Service Title" 
        name="title" 
        type="text" 
        actionIcon={null} 
        value={serviceTitle}
        onChange={onInputChange} 
        disabled={false} 
        inputAction={null}
      />
      <InputGroup  
          label="Service Description" 
          name="description" 
          type="text" 
          actionIcon={null} 
          value={serviceDescription}
          onChange={onInputChange} 
          disabled={false} 
          inputAction={null}
        />
      <InputGroup  
          label="Service Conditions" 
          name="conditions" 
          type="text" 
          actionIcon={null} 
          value={serviceCondition}
          onChange={onInputChange} 
          disabled={false} 
          inputAction={null}
        />
      {/*@ts-ignore */}
      <InputGroup  
        label="Service Price" 
        name="price" 
        type="number" 
        actionIcon={null} 
        value={servicePrice}
        onChange={onInputChange}
        disabled={false} 
        inputAction={null}
      />
      {(serviceType === 'torrentSeed' || serviceType === 'streamSeed') && <div>
        <InputGroup  
          label="Seed URI" 
          name="seedUri" 
          type="text" 
          actionIcon={null} 
          value={serviceSeedUrl}
          onChange={onInputChange} 
          disabled={false} 
          inputAction={null}
        />
        <InputGroup  
          label="Seed Token" 
          name="seedToken" 
          type="text" 
          actionIcon={null} 
          value={serviceSeedToken}
          onChange={onInputChange} 
          disabled={false} 
          inputAction={null}
        />
        {serviceType === 'streamSeed' && <div>
        <InputGroup  
          label="RTMP api URI" 
          name="rtmpApiUri" 
          type="text" 
          actionIcon={null} 
          value={serviceRtmpApiUri}
          onChange={onInputChange} 
          disabled={false} 
          inputAction={null}
        />
        <InputGroup  
          label="RTMP URI" 
          name="rtmpUri" 
          type="text" 
          actionIcon={null} 
          value={serviceRtmpUri}
          onChange={onInputChange} 
          disabled={false} 
          inputAction={null}
        />
        </div>}
      </div>}
      
    </div>
    {error ? <p className="error-container">{error}</p> : null}
    <div className='flex-center'>
    <input type="reset" value="reset" className='shock-form-button m-1'/>
    <input type="submit" value="submit" className='shock-form-button-confirm m-1' />
    </div>
  </form>
  </div>)
}
export default OfferService