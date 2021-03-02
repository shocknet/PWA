import React from "react";
import TipRibbon from "../TipRibbon";
import "./css/index.css";

const Video = ({ id, item, index, postId, tipValue, tipCounter }) => {
  return (
    <div className="media-container">
      <div
        className="video-container"
        style={{
          cursor: "pointer"
        }}
      >
        <video
          className={`torrent-video torrent-video-${postId}-${id}`}
          data-torrent={item.magnetURI}
          data-file-key={index}
          controls
          data-played="false"
        />
        <TipRibbon tipCounter={tipCounter} tipValue={tipValue} />
      </div>
    </div>
  );
};

export default Video;
