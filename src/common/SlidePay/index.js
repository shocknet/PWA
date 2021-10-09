import React, { useCallback, useEffect, useRef, useState } from "react";
import { Swipe } from "react-swipe-component";
import classNames from "classnames";
import bitcoinLightning from "../../images/bitcoin-lightning.svg";
import "./css/index.scoped.css";

const HANDLE_RADIUS = 80;
const HANDLE_POSITION_OFFSET = -3;

const SlidePay = ({
  wrapperStyle = {},
  containerStyle = {},
  disabled = false,
  onSuccess,
  slideText = "SLIDE TO PAY"
}) => {
  const containerRef = useRef();
  const [position, setPosition] = useState(HANDLE_POSITION_OFFSET);
  const [swipeSuccess, setSwipeSuccess] = useState(false);
  const [swipeReset, setSwipeReset] = useState(false);

  const handleSuccess = useCallback(async () => {
    try {
      if (swipeSuccess && onSuccess) {
        // Proceed with action
        await onSuccess();
      }
    } catch (err) {
      console.error(err);
      setSwipeSuccess(false);
      setSwipeReset(true);
      setPosition(HANDLE_POSITION_OFFSET);
    }
  }, [onSuccess, swipeSuccess]);

  useEffect(() => {
    handleSuccess();
  }, [handleSuccess]);

  const onSwipe = useCallback(
    position => {
      if (containerRef.current && !swipeSuccess) {
        const maxLeft =
          containerRef.current.getBoundingClientRect().width -
          HANDLE_RADIUS / 2;
        const left = position.x + HANDLE_POSITION_OFFSET; // Handle has a 2px offset to hide the left border

        setSwipeReset(false);

        if (left > maxLeft) {
          setPosition(maxLeft);
          return;
        }

        if (left < HANDLE_POSITION_OFFSET) {
          setPosition(HANDLE_POSITION_OFFSET);
          return;
        }

        setPosition(left);
      }
    },
    [containerRef, swipeSuccess]
  );

  const onSwipeEnd = useCallback(() => {
    if (containerRef.current && !swipeSuccess) {
      const maxLeft =
        containerRef.current.getBoundingClientRect().width - HANDLE_RADIUS / 2;

      if (position >= maxLeft) {
        setSwipeSuccess(true);
        return;
      }

      setSwipeReset(true);
      setPosition(-2);
    }
  }, [position, swipeSuccess]);

  return (
    <Swipe
      className={classNames({
        "slide-pay-container": true,
        "slide-disabled": disabled
      })}
      style={{
        ...wrapperStyle,
        touchAction: "auto"
      }}
      onSwipe={onSwipe}
      onSwipeEnd={onSwipeEnd}
      detectTouch={true}
      detectMouse={true}
    >
      <div className="slide-pay" ref={containerRef} style={containerStyle}>
        <div
          className={classNames({
            "slide-pay-progress": true,
            "slide-transition": swipeReset,
            "slide-success": swipeSuccess
          })}
          style={{ width: position + HANDLE_RADIUS / 2 }}
        />
        <div
          className={classNames({
            "slide-pay-handle": true,
            "slide-transition": swipeReset,
            "slide-success": swipeSuccess
          })}
          style={{
            left: position,
            width: HANDLE_RADIUS,
            height: HANDLE_RADIUS
          }}
        >
          <img
            src={bitcoinLightning}
            alt="Slide Handle"
            className="slide-pay-handle-image"
          />
        </div>
        <p className="slide-pay-text">{slideText}</p>
      </div>
    </Swipe>
  );
};

export default SlidePay;
