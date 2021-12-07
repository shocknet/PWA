import { useRef, useEffect, memo } from "react";

import TipRibbon from "../TipRibbon";
import "./css/index.scoped.css";
import videojs from "video.js";

const Stream = ({
  item,
  tipValue,
  tipCounter,
  hideRibbon,
  width,
}) => {
  const playerDOM = useRef(null);
  const isLive = false // TODO
  const videoStyle = { width: "100%" };
  if (width) {
    videoStyle.width = width;
  }
  const { liveStatus } = item
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
    //listen for 404s from the player
    //player.tech().on('retryplaylist', () => {
    //  console.log('retryplaylist');
    //});
    player.play();
  }, [item])
  useEffect(() => {
    if (item.viewersSocketUrl) {
      const socket = new WebSocket(`${item.viewersSocketUrl}/stream/watch/${item.userToken}`);
      socket.addEventListener("open", () => {
        console.log("viewer socket open")
      });
      return () => {
        socket.close()
      }
    }
  }, [item])

  return (
    <div className="media-container w-100">
      <div
        className="video-container w-100"
        style={{
          cursor: "pointer",
          width: "100%"
        }}
      >
        {!isLive && liveStatus === 'waiting' && <p>The stream did not start yet.</p>}
        {!isLive && liveStatus === 'wasLive' && <p>The stream is over</p>}
        {!isLive && !liveStatus && <p>The streamer has disconnected.</p>}
        <div
          style={
            liveStatus === 'live' ? { width: "100%" } : { display: "none", width: "100%" }
          }
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
        </div>
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

export default memo(Stream);
