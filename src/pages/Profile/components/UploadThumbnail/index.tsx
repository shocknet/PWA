import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Modal from "../../../../common/Modal";
import ModalSubmit from "../../../../common/Modal/components/ModalSubmit";
import "./css/index.scoped.css";
import Thumbnail from "./components/Thumbnail";
import CustomThumbnail from "./components/CustomThumbnail";
import useMemo from "react";

interface Thumbnail {
  preview: string;
  blob: Blob;
}

const getCanvasBlob = (canvas: HTMLCanvasElement) =>
  new Promise(resolve =>
    canvas.toBlob(blob => {
      resolve(blob);
    })
  );

async function extractFramesFromVideo(
  videoObjectUrl,
  fps = 25,
  limit = 3,
  randomFrames = true
): Promise<Thumbnail[]> {
  return new Promise(async resolve => {
    let video = document.createElement("video");

    let seekResolve;
    video.addEventListener("seeked", async function () {
      if (seekResolve) seekResolve();
    });

    video.src = videoObjectUrl;

    // workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
    while (
      (video.duration === Infinity || isNaN(video.duration)) &&
      video.readyState < 2
    ) {
      await new Promise(r => setTimeout(r, 1000));
      video.currentTime = 10000000 * Math.random();
    }
    let duration = video.duration;

    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let [w, h] = [video.videoWidth, video.videoHeight];
    canvas.width = w;
    canvas.height = h;

    let frames = [];
    let interval = 15 / fps;
    let currentTime = 0;

    while (
      (limit && frames.length < limit) ||
      (!limit && currentTime < duration)
    ) {
      if (randomFrames) {
        video.currentTime = Math.random() * duration;
      } else {
        video.currentTime = currentTime;
      }

      await new Promise(r => (seekResolve = r));

      context.drawImage(video, 0, 0, w, h);
      let base64ImageData = canvas.toDataURL();
      let canvasBlob = getCanvasBlob(canvas);

      frames.push({ preview: base64ImageData, blob: canvasBlob });
      currentTime += interval;
    }
    resolve(frames);
  });
}

const UploadThumbnail = ({
  open = false,
  toggleModal,
  target,
  setVideoThumbnails
}) => {
  const [selectedThumbnail, setSelectedThumbnailPreview] = useState<
    string | undefined
  >();
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<
    string | undefined
  >();
  const [customThumbnail, setCustomThumbnail] = useState<Thumbnail>();
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoFrames, setVideoFrames] = useState<Thumbnail[]>([]);
  const videoElement = useRef<HTMLVideoElement>();

  const setSelectedThumbnail = useCallback(thumbnail => {
    setSelectedThumbnailPreview(thumbnail.preview);
    setSelectedThumbnailFile(thumbnail.blob);
  }, []);

  const onUpload = useCallback(e => {
    const [thumbnail] = e.target.files;

    if (!thumbnail || !thumbnail.type.includes("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string") {
        return;
      }

      const data: Thumbnail = { preview: reader.result, blob: thumbnail };
      setCustomThumbnail(data);
      setSelectedThumbnail(data);
      console.log(data);
    });

    reader.readAsDataURL(thumbnail);
  }, []);

  const loadVideoFrames = useCallback(async () => {
    const frames = await extractFramesFromVideo(target.uri);
    setVideoFrames(frames);
    setSelectedThumbnail(frames[0]);
  }, [target]);

  useEffect(() => {
    if (!target?.uri) {
      return;
    }

    loadVideoFrames();
  }, [loadVideoFrames, target]);

  const updateThumbnail = useCallback(() => {
    const targetName = `${target.type}-${target.index}`;
    setVideoThumbnails(thumbnails => ({
      ...thumbnails,
      [targetName]: selectedThumbnailFile
    }));
    toggleModal();
  }, [setVideoThumbnails, toggleModal, target, selectedThumbnailFile]);

  const playVideo = useCallback(async () => {
    if (!videoElement.current) {
      return;
    }

    if (
      videoElement.current.currentTime > 0 &&
      !videoElement.current.paused &&
      videoElement.current.readyState > 2
    ) {
      videoElement.current.pause();
      setVideoPlaying(false);
      return;
    }

    videoElement.current.play();
    setVideoPlaying(true);
  }, [videoElement]);

  const removeCustomThumbnail = useCallback(() => {
    setCustomThumbnail(null);

    if (videoFrames.length) {
      setSelectedThumbnail(videoFrames[0]);
    }
  }, [videoFrames]);

  const onEnded = useCallback(() => {
    setVideoPlaying(false);
  }, []);

  return (
    <Modal
      modalOpen={open}
      toggleModal={toggleModal}
      modalTitle="Upload Video Thumbnail"
    >
      <div className="section">
        <p className="section-title">Choose a Thumbnail</p>
        <div className="choices">
          <CustomThumbnail
            onUpload={onUpload}
            removeCustomThumbnail={removeCustomThumbnail}
            setSelectedThumbnail={setSelectedThumbnail}
            selected={customThumbnail?.preview === selectedThumbnail}
            thumbnail={customThumbnail}
          />
          {videoFrames.map(frame => (
            <Thumbnail
              thumbnail={frame}
              selected={selectedThumbnail === frame.preview}
              setSelectedThumbnail={setSelectedThumbnail}
            />
          ))}
        </div>
      </div>
      <div className="section preview">
        <p className="section-title">Video Preview</p>
        <div
          className={classNames({
            "sample-video": true,
            "video-playing": videoPlaying
          })}
          onClick={playVideo}
        >
          <div className="play-btn">
            <i className="fas fa-play"></i>
          </div>
          {selectedThumbnail && (
            <img src={selectedThumbnail} alt="Video thumbnail preview" />
          )}
          {target?.uri && (
            <video src={target.uri} ref={videoElement} onEnded={onEnded} />
          )}
        </div>
      </div>
      <ModalSubmit text="Update Thumbnail" onClick={updateThumbnail} />
    </Modal>
  );
};

export default UploadThumbnail;
