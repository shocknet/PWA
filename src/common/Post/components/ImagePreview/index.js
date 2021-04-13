import React, { useState, useCallback } from "react";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import TipRibbon from "../TipRibbon";
import "react-medium-image-zoom/dist/styles.css";
import "./css/index.css";

const IMAGE_TRANSITION_MS = 200;

const ImagePreview = ({ id, item, index, postId,width,selected,updateSelection }) => {

  const contentURL = decodeURIComponent(
    item.magnetURI.replace(/.*(ws=)/gi, "")
  );
  const mainImageStyle = {opacity:1}
  if(width){
    mainImageStyle.width = width
  }
  const selectThis = useCallback(()=> {
    if(selected !==id){
      updateSelection(id)
    } 
  },[id,updateSelection])

  return (
    <div className="media-container" onClick={selectThis} style={{position:'relative'}}>
      <img
          className={`torrent-img torrent-img-${postId}-${id}`}
          alt="Post Media"
          data-torrent={item.magnetURI}
          data-file-key={index}
          style={mainImageStyle}
          src={contentURL}
        />
      {selected === id && <div
          style={{...mainImageStyle,opacity:1,position:'absolute',top:0,backgroundColor:'rgb(255,255,255,0.2)',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}
        >
        <i class="far fa-check-circle fa-3x" style={{opacity:1}}></i>
      </div>}
    </div>
  );
};

export default ImagePreview;