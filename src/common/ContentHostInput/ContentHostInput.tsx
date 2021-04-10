import { useCallback, useEffect, useMemo, useState } from "react";
import produce from "immer";
import { useDispatch } from "react-redux";
import * as Store from "../../store";
import {
  subscribeUserProfile,
  unsubscribeUserProfile
} from "../../actions/UserProfilesActions";

import ContentHostInputView, { IHost } from "./components/ContentHostInputView";
import { Http } from "../../utils";
import {setSeedInfo,setSeedProviderPub} from '../../actions/ContentActions'

const ContentHostInput = () => {
  const dispatch = useDispatch();
  const seedProviderPub = Store.useSelector(
    ({ content }) => content.seedProviderPub
  );
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);
  const { seedUrl, seedToken } = Store.useSelector(
    ({ content }) => content.seedInfo
  );
  const [hosts, setHosts] = useState<IHost[]>([]);
  //effect to update service provider on mount
  const userRef =userProfiles[seedProviderPub]
  useEffect(()=>{
    let pair = null
    if(seedUrl && seedToken){
      pair = {
        URI:seedUrl,
        token:seedToken,
        price:0,
        isBeingAddedOrDeleted:false,
        dateAdded:Date.now(),
        isDefault:true,
        error:null,
        publicKey:null
      }
      setHosts([pair])
    }
    console.log(userProfiles)
    if(seedProviderPub && !userProfiles[seedProviderPub]){
      setHosts([pair,{
        dateAdded:Date.now(),
        isBeingAddedOrDeleted:true,
        isDefault:true,
        publicKey:seedProviderPub,
        price:0,
        URI:null,
        token:null,
        error:null
      }])
    }


    if(seedProviderPub && userProfiles[seedProviderPub]){
      //@ts-expect-error
      const {SeedServiceProvided} = userProfiles[seedProviderPub]
      if(SeedServiceProvided){
        setHosts([pair,{
          dateAdded:Date.now(),
          isBeingAddedOrDeleted:true,
          isDefault:true,
          publicKey:seedProviderPub,
          price:0,
          URI:null,
          token:null,
          error:null
        }])
        Http.get(
          `/api/gun/otheruser/${seedProviderPub}/load/offeredServices>${SeedServiceProvided}`
        ).then(({data})=>{
          const {data:service} = data
          console.log(service)
          setHosts([pair,{
            dateAdded:Date.now(),
            isBeingAddedOrDeleted:false,
            isDefault:true,
            publicKey:seedProviderPub,
            price:service.servicePrice,
            URI:null,
            token:null,
            error:null
          }])
        })
        .catch(e => {
          setHosts([pair,{
            dateAdded:Date.now(),
            isBeingAddedOrDeleted:false,
            isDefault:true,
            publicKey:seedProviderPub,
            price:0,
            URI:null,
            token:null,
            error:e.message || e
          }])
        })
      }
    }
  },[seedUrl,seedToken,seedProviderPub,userRef,setHosts])
  
  const addHost = useCallback((publicKeyOrURI, token)=>{
    if(publicKeyOrURI.startsWith("http")){
      setSeedInfo(publicKeyOrURI,token)(dispatch)
    } else {
      setSeedProviderPub(publicKeyOrURI)(dispatch)
    }
  },[setSeedInfo,setSeedProviderPub])

  const removeHost = useCallback((publicKeyOrURI) => {
    if(publicKeyOrURI.startsWith("http")){
      setSeedInfo("","")(dispatch)
    } else {
      setSeedProviderPub("")(dispatch)
    }
  },[setSeedInfo,setSeedProviderPub])
  const subbedUsers = useMemo<string[]>(() => [], []);

  useEffect(() => {
    dispatch(subscribeUserProfile(seedProviderPub));
    return () => {
      dispatch(unsubscribeUserProfile(seedProviderPub));
    };
  }, [seedProviderPub, dispatch]);
  const filteredHosts = useMemo(()=>{
    return hosts.filter(h => h)
  },[hosts])
  return (
    <ContentHostInputView
      hosts={filteredHosts}
      onAddHost={addHost}
      onRemoveHost={removeHost}
      onRetryHost={()=>{}}
    />
  );
};

export default ContentHostInput;
