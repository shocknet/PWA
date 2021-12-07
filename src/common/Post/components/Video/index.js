import classNames from "classnames";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import useInView from "react-cool-inview";
import TipRibbon from "../TipRibbon";
import "./css/index.scoped.css";

const Video = ({
  item,
  index = 0,
  tipValue = 0,
  tipCounter = 0,
  hideRibbon = false
}) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const { observe } = useInView({
    trackVisibility: false,
    delay: 100,
    onEnter: () => {
      if (videoRef.current) {
        setPlaying(true);
        videoRef.current.play();
      }
    },
    onLeave: () => {
      if (!videoRef.current) {
        return;
      }

      setPlaying(false);
      videoRef.current.pause();
    }
  });

  const togglePlayingStatus = useCallback(() => {
    const updatedPlaying = !playing;
    setPlaying(updatedPlaying);
    if (videoRef.current) {
      if (!updatedPlaying) {
        videoRef.current.pause();
        return;
      }

      console.log("Playing video", updatedPlaying);
      videoRef.current.play();
    }
  }, [playing]);

  const videoHeight = useMemo(() => {
    if (CSS.supports("aspect-ratio: 16 / 9")) {
      return {
        aspectRatio: "16 / 9"
      };
    }

    return {
      height: 400
    };
  }, []);

  const onPause = useCallback(() => {
    if (videoRef.current?.readyState === 4) {
      setPlaying(false);
    }
  }, [videoRef]);

  return (
    <div className="media-container" ref={observe}>
      <div className="video-container" style={videoHeight}>
        <div
          className={classNames({
            "thumbnail-container": true,
            "video-hidden": playing
          })}
          onClick={togglePlayingStatus}
        >
          <div className="play-btn">
            <i className="fas fa-play" />
          </div>
          <img
            className="video-thumbnail hidden"
            data-torrent={item.magnetURI}
            data-file-key={index}
            alt="Video thumbnail"
          />
          <video
            className="dynamic-thumbnail hidden"
            data-torrent={item.magnetURI}
            data-file-key={index}
            data-played="false"
            controls={false}
            muted
          />
        </div>
        <video
          className={classNames({
            "torrent-video video-js vjs-default-skin": true,
            "video-hidden": !playing
          })}
          data-torrent={item.magnetURI}
          data-file-key={index}
          data-played="false"
          controls
          ref={videoRef}
          muted
          onPause={onPause}
        />
        {!hideRibbon && (
          <TipRibbon tipCounter={tipCounter} tipValue={tipValue} />
        )}
      </div>
    </div>
  );
};

export default memo(Video);
