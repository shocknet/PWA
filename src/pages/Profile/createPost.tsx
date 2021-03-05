import React, { createElement, useCallback, useMemo, useRef, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import QRCode from "qrcode.react";
import { processDisplayName } from "../../utils/String";

import BottomBar from "../../common/BottomBar";
import AddBtn from "../../common/AddBtn";
import Modal from "../../common/Modal";

import ClipboardIcon from "../../images/clipboard.svg";
import QRCodeIcon from "../../images/qrcode.svg";
import "./css/index.css";

import Loader from "../../common/Loader";
import MainNav from "../../common/MainNav";
import DialogNav from "../../common/DialogNav";
import Http from "../../utils/Http";
const PublishContentPage = () => {
  const dispatch = useDispatch();
  //@ts-expect-error
  const publishedContent = useSelector(({content}) => content.publishedContent)
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null)
  const [paragraph,setParagraph] = useState('')
  const [isPrivate,setIsPrivate] = useState(false)
  const [isPreview,setIsPreview] = useState(false)
  const [selectedContent,setSelectedContent] = useState('')
  console.log(publishedContent)
  const onSubmit = useCallback(
    async e => {
      if(selectedContent === '' && paragraph === ''){
        return
      }
      let contentItems = []
      if(paragraph !== ''){
        contentItems.push({
          type: 'text/paragraph',
          text: paragraph,
        })
      }
      if(selectedContent !== ''){
        const item = publishedContent[selectedContent]
        if(item){
          contentItems.push({
            type:item.type,
            width:item.width,
            height:item.height,
            magnetURI:item.magnetURI,
            isPreview:isPreview,
            isPrivate:isPrivate
          })
        }
      }
      const res = await Http.post(`/api/gun/wall`, {
        tags: [],
        title: 'Post',
        contentItems,
      })
      if (res.status === 200) {
        console.log('post created successfully')
      }
    },
    []
  );
  const onDiscard = useCallback(
    async e => {
      e.preventDefault();
      setError(null)
      setParagraph('')
    },
    []
  );
  const onInputChange = useCallback(e => {
    const { value, name } = e.target;
    switch (name) {
      case "": {
        return;
      }
      default:
        return;
    }
  }, []);
  return (<div className="publish-content-form-container">
    {loading ? (
      <Loader overlay fullScreen text="Unlocking Wallet..." />
    ) : null}
    <DialogNav  drawerVisible={false} pageTitle="PUBLISH CONTENT" />
    <h2>Say Something</h2>
    <form className="publish-content-form" onSubmit={onSubmit} onReset={onDiscard}>
      <div>
      <textarea value={paragraph} onChange={onInputChange} placeholder="What's up?" rows={4}>
      </textarea>
      </div>
      <div>
        <select name="postType" id="postType">
          <option value="public">Public</option>
          <option value="private">Paywall</option>
        </select>
      </div>
      {error ? <p className="error-container">{error}</p> : null}
      <div>
      <input type="reset" value="reset" />
      <input type="submit" value="submit" />
      </div>
    </form>
  </div>)
};

export default PublishContentPage;
