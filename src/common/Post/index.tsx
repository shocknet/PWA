import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useEmblaCarousel } from "embla-carousel/react";
import Tooltip from "react-tooltip";
import classNames from "classnames";
import sum from "lodash/sum";
import { DateTime } from "luxon";

import * as Store from "../../store";
import ShockAvatar from "../ShockAvatar";
import Pad from "../Pad";
import { subPostContent, subPostTips } from "../../actions/FeedActions";

import Video from "./components/Video";
import Image from "./components/Image";
import Stream from "./components/Stream";
import "./css/index.scoped.css";

import ShareIcon from "../../images/share.svg";

const Post = ({
  id,
  publicKey,
  openTipModal,
  openUnlockModal,
  openDeleteModal = undefined,
  openShareModal = _ => {}
}) => {
  const dispatch = Store.useDispatch();
  const unlockedContent = Store.useSelector(
    ({ content }) => content.unlockedContent
  );
  const [carouselRef, carouselAPI] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "center"
  });
  const author = Store.useSelector(Store.selectUser(publicKey));
  const post = Store.useSelector(Store.selectSinglePost(publicKey, id));
  const [tipCounter, tipValue] = React.useMemo(() => {
    const tips = Object.values(
      post.tips ||
        {} /* cached data from previous app version won't have the tips object */
    );

    return [tips.length, sum(tips)];
  }, [post]);

  const [sliderLength, setSliderLength] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [liveStatus, setLiveStatus] = useState("");
  const [viewersCounter, setViewersCounter] = useState(0);

  const isOnlineNode = /*Utils.isOnline(
    Store.useSelector(Store.selectUser(publicKey)).lastSeenApp
  );*/ true;

  useEffect(() => dispatch(subPostContent(publicKey, id)), [
    dispatch,
    id,
    publicKey
  ]);

  useEffect(() => dispatch(subPostTips(publicKey, id)), [
    dispatch,
    id,
    publicKey
  ]);

  //effect for liveStatus and viewers counter
  useEffect(() => {
    const values = Object.values(post.contentItems);
    const videoContent = values.find(
      // @ts-expect-error
      item => item.type === "video/embedded" && item.liveStatus === "wasLive"
    );
    const streamContent = values.find(
      // @ts-expect-error
      item => item.type === "stream/embedded" && item.liveStatus === "live"
    );
    let status = "";
    if (videoContent) {
      status = "Was Live";
    }
    if (streamContent) {
      status = "Is Live";
      // @ts-expect-error
      if (streamContent.viewersCounter) {
        // @ts-expect-error
        setViewersCounter(streamContent.viewersCounter);
      }
    }
    if (status) {
      setLiveStatus(status);
    }
  }, [post.contentItems, setLiveStatus]);

  const getMediaContent = useCallback(() => {
    return Object.entries(post.contentItems).filter(
      ([_, item]) => item.type !== "text/paragraph"
    );
  }, [post.contentItems]);

  const getTextContent = () => {
    return Object.entries(post.contentItems).filter(
      ([_, item]) => item.type === "text/paragraph"
    );
  };

  useEffect(() => {
    getMediaContent().forEach(([k, e]) => {
      const path = `${publicKey}>posts>${k}`;
      // @ts-expect-error
      if (e.isPrivate && !unlockedContent[path]) {
        setIsPrivate(true);
      }
    });
  }, [getMediaContent, publicKey, unlockedContent]);

  const parseContent = ([key, item], index) => {
    if (item.type === "text/paragraph") {
      return <p key={key}>{item.text}</p>;
    }
    const finalItem = item;
    if (item.isPrivate) {
      const path = `${publicKey}>posts>${id}`;
      const cached = unlockedContent[path];
      if (cached) {
        finalItem.magnetURI = cached;
      } else {
        return (
          <div key={key}>
            <i className="fas fa-lock fa-10x"></i>
          </div>
        );
      }
    }

    if (item.type === "image/embedded") {
      return (
        <Image
          id={key}
          item={finalItem}
          index={index}
          postId={id}
          tipCounter={tipCounter}
          tipValue={tipValue}
          key={`${id}-${index}`}
          hideRibbon={undefined}
          width={undefined}
        />
      );
    }

    if (item.type === "video/embedded") {
      return (
        <Video
          id={key}
          item={finalItem}
          index={index}
          postId={id}
          tipCounter={tipCounter}
          tipValue={tipValue}
          key={`${id}-${index}`}
          hideRibbon={undefined}
          width={undefined}
        />
      );
    }
    if (item.type === "stream/embedded") {
      return (
        <Stream
          id={key}
          item={finalItem}
          index={index}
          postId={id}
          tipCounter={tipCounter}
          tipValue={tipValue}
          key={`${id}-${index}`}
          hideRibbon={undefined}
          width={undefined}
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
      postID: id,
      publicKey
    });
  }, [id, isOnlineNode, openTipModal, publicKey]);

  const unlockPost = useCallback(() => {
    if (!isOnlineNode) {
      return;
    }

    openUnlockModal({
      targetType: "unlock",
      postID: id,
      publicKey
    });
  }, [id, isOnlineNode, openUnlockModal, publicKey]);

  const deletePost = useCallback(() => {
    openDeleteModal({ id, shared: false });
  }, [id, openDeleteModal]);

  const sharePost = useCallback(() => {
    openShareModal({
      targetType: "share",
      postID: id,
      publicKey
    });
  }, [publicKey, id, openShareModal]);

  useEffect(() => {
    try {
      Tooltip.rebuild();
    } catch (e) {
      console.log(`Error inside <Post />: `, e);
    }
  }, []);

  return (
    <div className="post">
      <div className="head">
        <div className="user">
          <ShockAvatar height={50} publicKey={publicKey} />

          <Pad amt={10} insideRow />

          <div className="details">
            <div className="username">
              <Link to={`/otherUser/${publicKey}`}>{author.displayName}</Link>
              {liveStatus && (
                <p className="liveStatus">
                  {liveStatus}
                  <i
                    className={`fas fa-circle liveStatusIcon ${
                      liveStatus === "Is Live" ? "liveIcon" : ""
                    }`}
                  ></i>
                  {liveStatus === "Is Live" && (
                    <span> | {viewersCounter} watching</span>
                  )}
                </p>
              )}
            </div>
            <p>{DateTime.fromMillis(post.date).toRelative()}</p>
          </div>
        </div>
        {openDeleteModal && (
          <i className="fas fa-trash" onClick={deletePost}></i>
        )}
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
                    // TODO: Get the actual ID here. However posts can't be
                    // edited so index is stable.
                    key={key}
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
        <div></div>
        <div
          className="icon-tip-btn"
          data-tip={isPrivate ? "Unlock this post" : "Tip this post"}
          onClick={isPrivate ? unlockPost : tipPost}
        >
          <div className="tip-icon icon-thin-feed"></div>
        </div>
        {openShareModal && (
          <div className="icon-tip-btn" data-tip={"share"} onClick={sharePost}>
            <img
              alt="Share this post"
              src={ShareIcon}
              style={{ color: "#4285b9", marginLeft: "auto" }}
            />
          </div>
        )}
        {!openShareModal && <div></div>}
      </div>
    </div>
  );
};

export default Post;
