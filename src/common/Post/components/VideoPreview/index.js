import { memo, useCallback, useMemo } from "react";
import { isURLCompatible } from "../../../../utils/Torrents";
import "./css/index.scoped.css";

const VideoPreview = ({
  id,
  item,
  index,
  postId,
  width,
  selected,
  updateSelection
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
  const selectThis = useCallback(() => {
    if (selected !== id) {
      updateSelection(id);
    }
  }, [id, selected, updateSelection]);
  return (
    <div className="media-container" style={{ position: "relative" }}>
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
      </div>
      <div
        onClick={selectThis}
        style={{
          ...videoStyle,
          opacity: selected === id ? 1 : 0,
          position: "absolute",
          top: 0,
          backgroundColor: "rgb(255,255,255,0.2)",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <i className="far fa-check-circle fa-3x" style={{ opacity: 1 }}></i>
      </div>
    </div>
  );
};

export default memo(VideoPreview);
