import React,{useCallback} from "react";
import TipRibbon from "../TipRibbon";
import "./css/index.css";

const VideoPreview = ({ id, item, index, postId,width,selected,updateSelection }) => {
  const contentURL = decodeURIComponent(
    item.magnetURI.replace(/.*(ws=)/gi, "")
  );
  const videoStyle = { }
  if(width){
    videoStyle.width = width
  }
  const selectThis = useCallback(()=> {
    if(selected !==id){
      updateSelection(id)
    } 
  },[id,updateSelection])
  return (
    <div className="media-container" style={{position:'relative'}}>
      <div
        className="video-container"
        style={{
          cursor: "pointer",
          
        }}
        
      >
        <video
          style={videoStyle}
          className={`torrent-video torrent-video-${postId}-${id}`}
          data-torrent={item.magnetURI}
          data-file-key={index}
          controls
          data-played="false"
          src={contentURL}
        />
      </div>
      <div onClick={selectThis}
          style={{...videoStyle,opacity:selected === id ? 1:0,position:'absolute',top:0,backgroundColor:'rgb(255,255,255,0.2)',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}
        >
        <i class="far fa-check-circle fa-3x" style={{opacity:1}}></i>
      </div>
    </div>
  );
};

export default VideoPreview;
