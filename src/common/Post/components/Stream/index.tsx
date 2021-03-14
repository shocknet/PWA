import React, {    useRef, useEffect } from "react";
import TipRibbon from "../TipRibbon";
import "./css/index.css";
import videojs from "video.js";

const Stream = ({ id, item, index, postId, tipValue, tipCounter, hideRibbon,width }) => {
  const playerDOM = useRef(null)
  const videoStyle = { width:"100%" }
  if(width){
    videoStyle.width = width
  }
  useEffect(() => {
    const player = videojs(playerDOM.current, {
      autoplay: true,
      muted: true,
      aspectRatio: "16:9"
    });
    player.src({
      src: item.magnetURI,
      type: "application/x-mpegURL"
    });
  
    player.play();
  },[])
  
  return (
    <div className="media-container w-100">
      <div
        className="video-container w-100"
        style={{
          cursor: "pointer",
          width:"100%"
        }}
      >
        <video
          className="video-js vjs-default-skin"
          ref={playerDOM}
          style={videoStyle}
          preload="auto"
          controls
          muted
          autoPlay
        />
        {!hideRibbon && <TipRibbon tipCounter={tipCounter} tipValue={tipValue} zoomed={false} />}
      </div>
    </div>
  );
};

export default Stream;
