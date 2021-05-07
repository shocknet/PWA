import React from "react";
import c from "classnames";

import * as gStyles from "../../../../styles";

import Static from "./Static";

const CamFeed = () => {
  const videoRef = React.useRef<HTMLVideoElement>();
  const [width, setWidth] = React.useState(100);
  const [errorMessage, setErrorMessage] = React.useState("");

  const divRefCb: React.RefCallback<HTMLElement> = React.useCallback(el => {
    // https://www.pluralsight.com/tech-blog/getting-size-and-position-of-an-element-in-react/
    if (!el) return;
    try {
      setWidth(el.getBoundingClientRect().width);
    } catch (e) {
      setErrorMessage(`Error inside onWidth mechanism in <CamFeed />:`);
      console.log(e);
    }
  }, []);

  React.useEffect(() => {
    const { current: video } = videoRef;

    if (!video) {
      setErrorMessage(`Video ref falsy inside <CamFeed />.`);
      return;
    }

    video.width = width;
    // video.height = (width / 16) * 9;
  }, [width]);

  React.useEffect(() => {
    if (navigator?.mediaDevices?.getUserMedia) {
      const { current: video } = videoRef;
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
        })
        .catch(function (e) {
          setErrorMessage(`Could not get your camera feed: ${e.message}`);
        });
    } else {
    }
  }, []);

  return (
    <>
      {errorMessage && <Static overlay={errorMessage} />}

      <video
        autoPlay
        className={c(errorMessage && gStyles.displayNone)}
        ref={videoRef}
      />

      <div className={gStyles.width100} ref={divRefCb} />
    </>
  );
};

export default CamFeed;
