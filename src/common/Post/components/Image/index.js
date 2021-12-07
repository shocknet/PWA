import React, { memo, useState, useCallback } from "react";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import TipRibbon from "../TipRibbon";
import "react-medium-image-zoom/dist/styles.css";
import "./css/index.scoped.css";

const IMAGE_TRANSITION_MS = 200;

const Image = ({
  id = "",
  item,
  index = 0,
  postId = "",
  tipValue = 0,
  tipCounter = 0,
  hideRibbon = false,
  width = null,
  disableZoom = false,
  style = /** @type {import('react').CSSProperties} */ ({})
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [zoomLoaded, setZoomLoaded] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [animationTimer, setAnimationTimer] = useState(null);

  const handleZoomChange = useCallback(
    value => {
      clearTimeout(animationTimer);
      setZoomed(value);
      if (!value && zoomLoaded) {
        setZoomLoaded(false);
        const timer = setTimeout(() => {
          setPreviewVisible(true);
        }, IMAGE_TRANSITION_MS);
        setAnimationTimer(timer);
      }

      if (value) {
        setPreviewVisible(false);
      }
    },
    [
      animationTimer,
      zoomLoaded,
      setZoomed,
      setZoomLoaded,
      setPreviewVisible,
      setAnimationTimer
    ]
  );

  const contentURL = decodeURIComponent(
    item.magnetURI.replace(/.*(ws=)/gi, "")
  );
  const mainImageStyle = { ...style, opacity: previewVisible ? 1 : 0 };
  if (width) {
    mainImageStyle.width = width;
  }

  const imgNode = (
    <>
      <img
        className={`image torrent-img torrent-img-${postId}-${id}`}
        alt="Post Media"
        data-torrent={item.magnetURI}
        data-file-key={index}
        style={mainImageStyle}
        src={contentURL}
      />
      <img
        className={`image enlarged-img enlarged-img-${postId}-${id}`}
        alt="Post Media"
        data-file-key={index}
        onLoad={() => {
          setZoomLoaded(true);
        }}
        style={{
          opacity: zoomed ? 1 : 0,
          display: zoomed ? "block" : "none"
        }}
        src={contentURL}
      />
      {!hideRibbon && (
        <TipRibbon
          tipCounter={tipCounter}
          tipValue={tipValue}
          zoomed={zoomed}
        />
      )}
    </>
  );

  return (
    <div className="media-container">
      {disableZoom ? (
        imgNode
      ) : (
        <ControlledZoom
          isZoomed={zoomed}
          onZoomChange={handleZoomChange}
          overlayBgColorStart="#16191c00"
          overlayBgColorEnd="#16191c"
        >
          {imgNode}
        </ControlledZoom>
      )}
    </div>
  );
};

export default memo(Image);
