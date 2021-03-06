import React, { useState, useCallback } from "react";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import TipRibbon from "../TipRibbon";
import "react-medium-image-zoom/dist/styles.css";
import "./css/index.css";

const IMAGE_TRANSITION_MS = 200;

const Image = ({ id, item, index, postId, tipValue, tipCounter }) => {
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
    [animationTimer, zoomLoaded]
  );

  const contentURL = decodeURIComponent(
    item.magnetURI.replace(/.*(ws=)/gi, "")
  );

  return (
    <div className="media-container">
      <ControlledZoom
        isZoomed={zoomed}
        onZoomChange={handleZoomChange}
        overlayBgColorStart="#16191c00"
        overlayBgColorEnd="#16191c"
      >
        <img
          className={`torrent-img torrent-img-${postId}-${id}`}
          alt="Post Media"
          data-torrent={item.magnetURI}
          data-file-key={index}
          style={{ opacity: previewVisible ? 1 : 0 }}
          src={contentURL}
        />
        <img
          className={`enlarged-img enlarged-img-${postId}-${id}`}
          alt="Post Media"
          data-file-key={index}
          onLoad={() => {
            setZoomLoaded(true);
          }}
          style={{ opacity: zoomLoaded ? 1 : 0 }}
          src={contentURL}
        />
        <TipRibbon
          tipCounter={tipCounter}
          tipValue={tipValue}
          zoomed={zoomed}
        />
      </ControlledZoom>
    </div>
  );
};

export default Image;
