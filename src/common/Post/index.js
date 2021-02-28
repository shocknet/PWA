import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useEmblaCarousel } from "embla-carousel/react";
import Tooltip from "react-tooltip";
import classNames from "classnames";
import { DateTime } from "luxon";
import Video from "./components/Video";
import Image from "./components/Image";
import "./css/index.css";

const Post = ({
  id,
  timestamp,
  avatar,
  tipCounter,
  tipValue,
  publicKey,
  openTipModal,
  contentItems = {},
  username,
  isOnlineNode
}) => {
  const [carouselRef, carouselAPI] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "center"
  });

  const [sliderLength, setSliderLength] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const getMediaContent = () => {
    return Object.entries(contentItems).filter(
      ([_, item]) => item.type !== "text/paragraph"
    );
  };

  const getTextContent = () => {
    return Object.entries(contentItems).filter(
      ([_, item]) => item.type === "text/paragraph"
    );
  };

  const parseContent = ([key, item], index) => {
    if (item.type === "text/paragraph") {
      return <p key={key}>{item.text}</p>;
    }

    if (item.type === "image/embedded") {
      return (
        <Image
          id={key}
          item={item}
          index={index}
          postId={id}
          tipCounter={tipCounter}
          tipValue={tipValue}
          key={`${id}-${index}`}
        />
      );
    }

    if (item.type === "video/embedded") {
      return (
        <Video
          id={key}
          item={item}
          index={index}
          postId={id}
          tipCounter={tipCounter}
          tipValue={tipValue}
          key={`${id}-${index}`}
        />
      );
    }

    return null;
  };

  // useEffect(() => {
  //   attachMedia();
  // }, [contentItems.length]);

  const nextSlide = useCallback(() => {
    if (!carouselAPI) return;

    if (carouselAPI.canScrollNext()) {
      carouselAPI.scrollNext();
    }
  }, [carouselAPI]);

  const prevSlide = useCallback(() => {
    if (!carouselAPI) return;

    if (carouselAPI.canScrollPrev()) {
      carouselAPI.scrollPrev();
    }
  }, [carouselAPI]);

  const handleUserKeyDown = useCallback(
    e => {
      if (sliderLength === 0) return;
      const { key } = e;

      if (key === "ArrowRight") {
        nextSlide();
      }

      if (key === "ArrowLeft") {
        prevSlide();
      }
    },
    [sliderLength, prevSlide, nextSlide]
  );

  const updateActiveSlide = useCallback(() => {
    setActiveSlide(carouselAPI.selectedScrollSnap());
  }, [carouselAPI, setActiveSlide]);

  useEffect(() => {
    if (!carouselAPI) return;

    carouselAPI.on("scroll", updateActiveSlide);
    setSliderLength(carouselAPI.scrollSnapList().length);
    window.addEventListener("keydown", handleUserKeyDown);

    return () => {
      window.removeEventListener("keydown", handleUserKeyDown);
      carouselAPI.off("scroll", updateActiveSlide);
    };
  }, [carouselAPI, sliderLength, handleUserKeyDown, updateActiveSlide]);

  const tipPost = useCallback(() => {
    if (!isOnlineNode) {
      return;
    }

    openTipModal({
      targetType: "post",
      postID: id
    });
  }, [id, isOnlineNode, openTipModal]);

  useEffect(() => {
    Tooltip.rebuild();
  }, []);

  return (
    <div className="post">
      <div className="head">
        <div className="user">
          <Link
            className="av"
            to={`/${publicKey}`}
            style={{
              backgroundImage: `url(${avatar})`
            }}
          />
          <div className="details">
            <Link to={`/${publicKey}`}>{username}</Link>
            <p>{DateTime.fromMillis(timestamp).toRelative()}</p>
          </div>
        </div>
      </div>

      <div className="content">
        {getTextContent().map(parseContent)}
        <div className="media-content-carousel">
          {sliderLength > 1 ? (
            <div className="media-carousel-controls-container">
              <div
                className="media-carousel-arrow fas fa-angle-left"
                onClick={prevSlide}
              ></div>
              <div className="media-carousel-pages">
                {Array.from({ length: sliderLength }).map((_, key) => (
                  <div
                    className={classNames({
                      "media-carousel-page": true,
                      "active-carousel-page": activeSlide === key
                    })}
                    onClick={() => carouselAPI?.scrollTo(key)}
                  ></div>
                ))}
              </div>
              <div
                className="media-carousel-arrow fas fa-angle-right"
                onClick={nextSlide}
              ></div>
            </div>
          ) : null}
          <div className="media-content-root" ref={carouselRef}>
            <div className="media-content-container">
              {getMediaContent().map(parseContent)}
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <div
          className="icon-tip-btn"
          data-tip="Tip this post"
          onClick={tipPost}
        >
          <div className="tip-icon icon-thin-feed"></div>
        </div>
      </div>
    </div>
  );
};

export default Post;
