// @ts-check
import { useCallback } from "react";

import ShockImg from "../../../ShockImg";

import "./css/index.scoped.css";

const ImagePreview = ({
  id,
  item,
  index,
  postId,
  width,
  selected,
  updateSelection,
  alt = ""
}) => {
  const contentURL = decodeURIComponent(
    item.magnetURI.replace(/.*(ws=)/gi, "")
  );
  const mainImageStyle = { opacity: 1 };
  if (width) {
    mainImageStyle.width = width;
  }
  const selectThis = useCallback(() => {
    if (selected !== id) {
      updateSelection(id);
    }
  }, [id, updateSelection, selected]);

  return (
    <div className="container" onClick={selectThis}>
      <ShockImg
        className={`image torrent-img torrent-img-${postId}-${id}`}
        alt={alt}
        data-torrent={item.magnetURI}
        data-file-key={index}
        style={mainImageStyle}
        src={contentURL}
        placeholderHeight={75}
        placeholderWidth={100}
      />
      {selected === id && (
        <div
          style={{
            ...mainImageStyle,
            opacity: 1,
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
      )}
    </div>
  );
};

export default ImagePreview;
