import React, {  useCallback,  useRef, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import "./css/index.css";

import Loader from "../../common/Loader";
import DialogNav from "../../common/DialogNav";
import Http from "../../utils/Http";
import {addPublishedContent,removeUnavailableToken} from '../../actions/ContentActions'
import { EnrollToken } from "../../utils/seed";
import { useHistory } from "react-router";
const PublishContentPage = () => {
  const dispatch = useDispatch();
  const history = useHistory()
  //@ts-ignore
  const seedProviderPub = useSelector(({content}) => content.seedProviderPub)
  //@ts-ignore
  const {seedUrl,seedToken} = useSelector(({content}) => content.seedInfo)
  //@ts-ignore
  const availableTokens = useSelector(({content}) => content.availableTokens)
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [mediaPreviews,setMediaPreviews] = useState([])
  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [postType,setPostType] = useState("public")
  const [createPost,setCreatePost] = useState(false)
  const imageFile = useRef(null)
  const videoFile = useRef(null)

  const [useDefault,setUseDefault] = useState(false)

  const [selectedFiles,setSelectedFiles] = useState([]) 

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      
      console.log([title,description,selectedFiles])
      if(selectedFiles.length === 0){
        setError("no selected files")
        return
      }
      setLoading(true)
      try{
        let tokenInfo = null
        let deleteToken = false
        let availableToken = null
        console.log("useDefault")
        console.log(useDefault)
        for (const key in availableTokens) {
          if (Object.prototype.hasOwnProperty.call(availableTokens, key)) {
            const element = availableTokens[key];
            if(element[0]){
              availableToken = {seedUrl:key,tokens:element}
              break
            }
          }
        }
        if(seedUrl && seedToken){
          console.log("USING SELF SEED TOKEN")
          const token = await EnrollToken(seedUrl,seedToken)
          console.log("token")
          console.log(token)
          tokenInfo = {seedUrl, tokens:[token]}
        } else if(useDefault){
          console.log("USING DEFAULT TOKEN PROVIDER")
          const {data,status} = await Http.post('/api/lnd/unifiedTrx',{
            type: 'torrentSeed',
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
          console.log(data)
          const {orderAck} = data
          tokenInfo = JSON.parse(orderAck.response)
        } else if(availableToken) {
          console.log("USING AVAILABLE TOKEN")
          tokenInfo = availableToken
          deleteToken = true
        } else {
          setError("provide the token data or use default seed provider")
          setLoading(false)
        return
        }
        const orderData = tokenInfo
        const {seedUrl:finalSeedUrl,tokens} = orderData
        const formData = new FormData()
        //TODO support public/private content by requesting two tokens and doing this req twice
        Array.from(selectedFiles).forEach(file => formData.append('files', file))
        formData.append('info', 'extraInfo')
        formData.append('comment', 'comment')
        const res = await fetch(`${finalSeedUrl}/api/put_file`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokens[0]}`,
          },
          body: formData,
        })
        const resJson = await res.json()
        console.log(resJson)
        if(resJson.error && resJson.error.message){
          const err = resJson.error.message
          if(err === "The provided token has already been used"){
            setError("An error occurred, please try again")
            removeUnavailableToken(finalSeedUrl,tokens[0])(dispatch)
            
          } else {
            setError(err)
          }
          setLoading(false)
          return
        }
        const {torrent} = resJson.data
        const {magnet} = torrent
        const [firstFile] = mediaPreviews
        console.log(firstFile)
        let type = 'image/embedded'
        if(firstFile.type === 'video'){
          type = 'video/embedded'
        }
        const contentItem = {
          type,
          magnetURI:magnet,
          width:0,
          height:0
        }
        const published = await addPublishedContent(contentItem)(dispatch)
        console.log("content publish complete")
        console.log(published)
        setLoading(false)
        if(deleteToken){
          removeUnavailableToken(finalSeedUrl,tokens[0])(dispatch)
        }
        history.push("/profile")
      }catch(err){
        console.log(err)
        setError(err?.errorMessage ?? err?.message)
        setLoading(false)
      }

    },
    [title,description,selectedFiles,mediaPreviews,availableTokens,seedUrl, seedToken,useDefault,history, dispatch, setError]
  );
  const onDiscard = useCallback(
    async e => {
      e.preventDefault();
      setTitle("")
      setDescription("")
      setError(null)
      
    },
    [setDescription, setTitle, setError]
  );
  const onInputChange = useCallback(e => {
    const { value, name,checked } = e.target;
    //e.preventDefault()
    switch (name) {
      case "title": {
        setTitle(value);
        return;
      }
      case "description": {
        setDescription(value);
        return;
      }
      case "postType":{
        setPostType(value)
        return
      }
      case "createPost":{
        console.log("create post")
        return
      }
      case "useDefault":{
        setUseDefault(checked)
        console.log(checked)
        return
      }
      default:
        return;
    }
  }, [setTitle,setDescription,setCreatePost,setUseDefault]);
  const onSelectedFile = useCallback(e =>{
    e.preventDefault()
    
    console.log(e.target.files)
    setSelectedFiles(e.target.files)
    const promises = Array.from(e.target.files).map((file,index) => {
      console.log("doing file...")
      return new Promise(res => {
        //@ts-ignore
        const {type} = file
        //@ts-ignore
        const reader = new FileReader();

        reader.onload = function (e) {
          if(type.startsWith('image/')){
            res({type:'image',uri:e.target.result,index})
          }
          if(type.startsWith('video/')){
            res({type:'video',uri:e.target.result,index})
          }
        }
        //@ts-ignore
        reader.readAsDataURL(file);
        
      })
    })
    Promise.allSettled(promises)
    .then(res =>{
      const previews = []
      res.forEach(singleRes => {
        if(singleRes.status === 'fulfilled'){
          previews.push(singleRes.value)
        }
      })
      console.log(previews)
      setMediaPreviews(previews)
    })
  },[setSelectedFiles,setMediaPreviews])
  const onSelectImageFile = useCallback(e => {
    e.preventDefault()
    //imageFile.current.onChange = 
    imageFile.current.click()
  },[imageFile])
  const onSelectVideoFile = useCallback(e => {
    e.preventDefault()
    videoFile.current.click()
  },[videoFile])
  return (<div className="publish-content-form-container m-1">
    {loading ? (
      <Loader overlay fullScreen text="" />
    ) : null}
    <DialogNav  drawerVisible={false} pageTitle="PUBLISH CONTENT" />
    
    <form className="publish-content-form" onSubmit={onSubmit} onReset={onDiscard}>
    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
      <h2>Say Something<div className="line"></div></h2>
      
    </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div className="publish-content-title">
          <label htmlFor="title" ><strong>Title</strong></label>
          
        </div>
        <div>
          <strong >Audience: <i className={`fas ${postType === 'public' ? "fa-globe-europe" : "fa-credit-card"}`}></i></strong>
          <select name="postType" id="postType" onChange={onInputChange} style={{appearance:'none',backgroundColor:"rgba(0,0,0,0)",color:'var(--main-blue)', marginLeft:"0.3rem"}}>
            <option value="public" style={{backgroundColor:"rgba(0,0,0,0)",color:'var(--main-blue)'}}>Public</option>
            <option value="private">Paywall</option>
          </select>
        </div>
      </div>
      <input
        type="text"
        name="title"
        placeholder="How I monetized my content with ShockWallet"
        value={title}
        onChange={onInputChange}
        className="input-field"
      />
      <div className="publish-content-title">
        <label htmlFor="contents"><strong>Contents</strong></label>
      </div>
      <div className="m-b-1">
      <input type='file' id='file' ref={imageFile} style={{display: 'none'}} accept="image/*" multiple onChange={onSelectedFile}/>
      <input type='file' id='file' ref={videoFile} style={{display: 'none'}} accept="video/*" multiple onChange={onSelectedFile}/>
      <i className="fas fa-images publish-content-icon" onClick={onSelectImageFile}></i>
      <i className="fas fa-video publish-content-icon" onClick={onSelectVideoFile}></i>
      <div >
        {mediaPreviews.length > 0 && mediaPreviews.map(prev => {
          if(prev.type === 'image'){
            return <img src={prev.uri} key={prev.index.toString()} width={100} className="m-1" ></img>
          }
          if(prev.type === 'video'){
            return <video src={prev.uri} key={prev.index.toString()} controls width={100} className="m-1"></video>
          }
        })}
      </div>
      {/*<i className="fas fa-music publish-content-icon"></i>
      <i className="fas fa-paperclip publish-content-icon"></i>*/}
      </div>
      <div className="publish-content-title">
        <label htmlFor="description"><strong>Description</strong></label>
      </div>
      <textarea
        name="description"
        placeholder="I made a quick video to show you guys how easy it is to run your own social platform on ShockWallet, and start earning Bitcoin"
        rows={3}
        value={description}
        onChange={onInputChange}
        className="input-field"
      />
      <div style={{display:'flex',alignItems:'center',marginLeft:'auto'}}>
        <label htmlFor="useDefault">Use default seed provider</label>
        <input type="checkbox" name="useDefault" checked={useDefault} onChange={onInputChange} style={{marginLeft:"0.2em"}}  />
      </div>
      <div style={{display:'flex',alignItems:'center',marginLeft:'auto'}}>
        <label htmlFor="createPost">Create Post/Teaser?</label>
      <input type="checkbox" name="createPost" style={{marginLeft:"0.2em"}}  />
      </div>
      
      {error ? <p className="error-container">{error}</p> : null}
      <div className='flex-center'>
      <input type="reset" value="reset" className='shock-form-button m-1'/>
      <input type="submit" value="submit" className='shock-form-button-confirm m-1' />
      </div>
    </form>
  </div>)
};

export default PublishContentPage;
