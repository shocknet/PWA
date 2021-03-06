import React, {  useCallback,  useRef, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import "./css/index.css";

import Loader from "../../common/Loader";
import DialogNav from "../../common/DialogNav";
import Http from "../../utils/Http";
import {addPublishedContent} from '../../actions/ContentActions'
const PublishContentPage = () => {
  const dispatch = useDispatch();
  //@ts-ignore
  const seedProviderPub = useSelector(({content}) => content.seedProviderPub)
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [mediaPreviews,setMediaPreviews] = useState([])
  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const imageFile = useRef(null)
  const videoFile = useRef(null)

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
        const orderData = JSON.parse(orderAck.response)
        const {seedUrl,tokens} = orderData
        const formData = new FormData()
        //TODO support public/private content by requesting two tokens and doing this req twice
        Array.from(selectedFiles).forEach(file => formData.append('files', file))
        formData.append('info', 'extraInfo')
        formData.append('comment', 'comment')
        const res = await fetch(`${seedUrl}/api/put_file`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokens[0]}`,
          },
          body: formData,
        })
        const resJson = await res.json()
        console.log(resJson)
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
        window.history.back();
      }catch(err){
        console.log(err)
        setError(err?.errorMessage ?? err?.message)
        setLoading(false)
      }

    },
    [title,description,selectedFiles,mediaPreviews, dispatch, setError]
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
    const { value, name } = e.target;
    switch (name) {
      case "title": {
        setTitle(value);
        return;
      }
      case "description": {
        setDescription(value);
        return;
      }
      default:
        return;
    }
  }, [setTitle,setDescription]);
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
  return (<div className="publish-content-form-container">
    {loading ? (
      <Loader overlay fullScreen text="" />
    ) : null}
    <DialogNav  drawerVisible={false} pageTitle="PUBLISH CONTENT" />
  
    <form className="publish-content-form" onSubmit={onSubmit} onReset={onDiscard}>
      <div className="publish-content-title">
        <label htmlFor="title" >Title</label>
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
        <label htmlFor="contents">Contents</label>
      </div>
      <div>
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
        <label htmlFor="description">Description</label>
      </div>
      <textarea
        name="description"
        placeholder="I made a quick video to show you guys how easy it is to run your own social platform on ShockWallet, and start earning Bitcoin"
        rows={3}
        value={description}
        onChange={onInputChange}
        className="input-field"
      />
      {error ? <p className="error-container">{error}</p> : null}
      <div className='flex-center'>
      <input type="reset" value="reset" className='shock-form-button m-1'/>
      <input type="submit" value="submit" className='shock-form-button-confirm m-1' />
      </div>
    </form>
  </div>)
};

export default PublishContentPage;
