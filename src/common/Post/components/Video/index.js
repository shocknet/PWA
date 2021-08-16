import { useMemo } from "react";
import { isURLCompatible } from "../../../../utils/Torrents";
import TipRibbon from "../TipRibbon";
import "./css/index.scoped.css";

const Video = ({
  id = "",
  item,
  index = 0,
  postId = "",
  tipValue = 0,
  tipCounter = 0,
  hideRibbon = false,
  width = null
}) => {
  const contentURL = useMemo(() => {
    const url = item.magnetURI.replace(/.*(ws=)/gi, "");

    if (isURLCompatible({ url })) {
      return decodeURIComponent(url);
    }

    return null;
  }, [item.magnetURI]);
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
          <TipRibbon
            tipCounter={tipCounter}
            tipValue={tipValue}
            zoomed={false}
          />
        )}
      </div>
    </div>
  );
};

export default Video;
