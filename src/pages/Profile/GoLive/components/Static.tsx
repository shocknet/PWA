import React, { memo } from "react";

import * as gStyles from "../../../../styles";

import styles from "./Static.module.css";

export interface StaticProps {
  overlay?: string;
}

const Static: React.FC<StaticProps> = ({ overlay }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>();
  const [width, setWidth] = React.useState(100);

  const divRefCb: React.RefCallback<HTMLElement> = React.useCallback(el => {
    // https://www.pluralsight.com/tech-blog/getting-size-and-position-of-an-element-in-react/
    if (!el) return;
    try {
      setWidth(el.getBoundingClientRect().width);
    } catch (e) {
      console.log(`Error inside onWidth mechanism in <Static />:`);
      console.log(e);
    }
  }, []);

  React.useEffect(() => {
    const { current: canvas } = canvasRef;

    if (!canvas) {
      console.error(`Canvas ref falsy inside <Static />.`);
      return;
    }

    canvas.width = width;
    canvas.height = (width / 16) * 9;
  }, [width]);

  const isMountedRef = React.useRef<boolean>(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    const { current: canvas } = canvasRef;

    if (!canvas) {
      console.error(`Canvas ref falsy inside <Static />.`);
      return;
    }

    const c = canvas.getContext("2d");
    const imageData = c.createImageData(canvas.width, canvas.height);

    (function staticLoop() {
      if (!isMountedRef.current) {
        return;
      }
      for (let i = 0, a = imageData.data.length; i < a; i++) {
        imageData.data[i] = (Math.random() * 255) | 0;
      }

      c.putImageData(imageData, 0, 0);

      requestAnimationFrame(staticLoop);
    })();

    return () => {
      isMountedRef.current = false;
    };
  }, [width]);

  return (
    <>
      <div className={styles.root}>
        {overlay && (
          <div className={styles.overlay}>
            <span className={styles["overlay-text"]}>{overlay}</span>
          </div>
        )}
        <canvas ref={canvasRef} />
      </div>

      <div className={gStyles.width100} ref={divRefCb} />
    </>
  );
};

export default memo(Static);
