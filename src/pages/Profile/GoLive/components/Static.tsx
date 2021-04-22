import * as R from "react";

import * as gStyles from "../../../../styles";

import styles from "./Static.module.css";

export interface StaticProps {
  overlay?: string;
}

const Static: R.FC<StaticProps> = ({ overlay }) => {
  const canvasRef = R.useRef<HTMLCanvasElement>();
  const [width, setWidth] = R.useState(100);

  const divRefCb: R.RefCallback<HTMLElement> = R.useCallback(el => {
    // https://www.pluralsight.com/tech-blog/getting-size-and-position-of-an-element-in-react/
    if (!el) return;
    try {
      setWidth(el.getBoundingClientRect().width);
    } catch (e) {
      console.log(`Error inside onWidth mechanism in <Static />:`);
      console.log(e);
    }
  }, []);

  R.useEffect(() => {
    const { current: canvas } = canvasRef;

    if (!canvas) {
      console.error(`Canvas ref falsy inside <Static />.`);
      return;
    }

    canvas.width = width;
    canvas.height = (width / 16) * 9;
  }, [width]);

  const isMountedRef = R.useRef<boolean>(true);

  R.useEffect(() => {
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

export default Static;
