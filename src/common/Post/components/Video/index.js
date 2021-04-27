import React from "react";
import TipRibbon from "../TipRibbon";
import "./css/index.css";

const Video = ({
  id,
  item,
  index,
  postId,
  tipValue,
  tipCounter,
  hideRibbon,
  width
}) => {
  const contentURL = decodeURIComponent(
    item.magnetURI.replace(/.*(ws=)/gi, "")
  );
  const videoStyle = {};
  if (width) {
    videoStyle.width = width;
  }
  return (
    <div className="media-container">
      <div
        className="video-container"
        style={{
          cursor: "pointer"
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
        {!hideRibbon && (
          <TipRibbon tipCounter={tipCounter} tipValue={tipValue} />
        )}
      </div>
    </div>
  );
};

export default Video;
