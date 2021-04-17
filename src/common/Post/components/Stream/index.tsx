import React, { useRef, useEffect, useState } from "react";
import TipRibbon from "../TipRibbon";
import "./css/index.css";
import videojs from "video.js";
import Http from "../../../../utils/Http";

const REACT_APP_SL_SEED_URI = "https://webtorrent.shock.network";
const STREAM_STATUS_URI = `${REACT_APP_SL_SEED_URI}/rtmpapi/api/streams/live`;

const Stream = ({
  id,
  item,
  index,
  postId,
  tipValue,
  tipCounter,
  hideRibbon,
  width,
  timeout = 10000
}) => {
  const playerDOM = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const videoStyle = { width: "100%" };
  if (width) {
    videoStyle.width = width;
  }
  useEffect(() => {
    let recheckInterval = null;
    const checkStatus = async () => {
      try {
        //TODO regex (?) `${REACT_APP_SL_RTMP_API_URI}/live/${seedToken}/index.m3u8`
        const [seedToken] = item.magnetURI
          .split("/live/")[1]
          .split("/index.m3u8");
        const res = await Http.get(`${STREAM_STATUS_URI}/${seedToken}`);
        if (!res.data.isLive) {
          return false;
        }
        const player = videojs(playerDOM.current, {
          autoplay: true,
          muted: true,
          aspectRatio: "16:9"
        });
        player.src({
          src: item.magnetURI,
          type: "application/x-mpegURL"
        });
        /*listen for 404s from the player
        player.tech().on('retryplaylist', () => {
          console.log('retryplaylist');
        });*/
        player.play();
        return true;
      } catch (err) {
        return false;
      }
    };
    checkStatus().then(isLive => {
      if (isLive) {
        setIsLive(true);
        return;
      }
      recheckInterval = setInterval(async () => {
        const isLive = await checkStatus();
        if (isLive) {
          setIsLive(true);
          clearInterval(recheckInterval);
          return;
        }
      }, timeout);
    });

    return () => {
      clearInterval(recheckInterval);
    };
  }, [item]);
  return (
    <div className="media-container w-100">
      <div
        className="video-container w-100"
        style={{
          cursor: "pointer",
          width: "100%"
        }}
      >
        {!isLive && <p>The streamer has disconnected.</p>}
        <div
          style={
            isLive ? { width: "100%" } : { display: "none", width: "100%" }
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

export default Stream;
