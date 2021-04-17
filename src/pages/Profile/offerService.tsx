import React, {  useCallback,   useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import DialogNav from "../../common/DialogNav";
import Loader from "../../common/Loader";
import InputGroup from "../../common/InputGroup"
import {createService} from "../../actions/OrdersActions"
import { useHistory } from "react-router";


const OfferService = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  //@ts-expect-error
  const {seedUrl,seedToken} = useSelector(({content}) => content.seedInfo)
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null)
  const [serviceType,setServiceType] = useState("torrentSeed")
  const [servicePrice,setServicePrice] = useState(0)
  //optional fields 

  const onInputChange = useCallback(e => {
    const { value, name } = e.target;
    e.preventDefault()
    switch (name) {
      case "type": {
        setServiceType(value)
        return
      }
      case "price": {
        setServicePrice(value)
        return
      }
      default:
        return;
    }
  }, [setServiceType,setServicePrice]);
  const onSubmit = useCallback(
    async e => {
      e.preventDefault()
      if(!seedUrl || !seedToken){
        setError("seed url and token are not set in config")
        return
      }
      if(servicePrice <= 0){
        setError("service price must be greater than 0")
        return
      }
      try{
        setLoading(true)
        const clear = {serviceType,serviceTitle:"Content Seeding",serviceDescription:"",serviceCondition:"",servicePrice}
        const encrypt = {serviceSeedUrl:seedUrl,serviceSeedToken:seedToken}
        const res = await createService(clear,encrypt)(dispatch)
        console.log(res)
        setLoading(false)
        history.push("/profile")
      } catch(err){
        setLoading(false)
        setError(err.message || err)
      }
    },
    [serviceType,servicePrice,history]
  );
  const onDiscard = useCallback(
    async e => {
      e.preventDefault();
      setError(null)
      setServiceType("torrentSeed")
      setServicePrice(0)

    },
    [setError,setServiceType,setServicePrice]
  );
  
  return (<div className="publish-content-form-container m-1" style={{overflow:'auto'}}>
  {loading ? (
    <Loader overlay fullScreen text="Creating service..." />
  ) : null}
  <DialogNav  drawerVisible={false}  pageTitle="" />
  <form className="publish-content-form" onSubmit={onSubmit} onReset={onDiscard}>
    <div style={{display:'flex',justifyContent:'center',marginBottom:"1rem"}}>
      <div >
        <h2>Offer service</h2>
        <div className="line"></div>
      </div>
    </div>
    <div >
      <select name="type" value={serviceType} onChange={onInputChange}>
        <option value="torrentSeed">Content Seeding</option>
      </select>
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