import React from "react";
import classNames from "classnames";
import moment from "moment";

import Pad from "../../common/Pad";
import * as Utils from "../../utils";
import { rifle } from "../../utils/WebSocket";
import * as Store from "../../store";
import { Pic } from "../../hooks";

import styles from "./css/index.module.css";

export interface StoryParams {
  publicKey?: string;
}

export interface StoryProps {
  publicKey?: string;
  onNext(): void;
  onPrevious(): void;
  position: "first" | "middle" | "last";
}

const Story: React.FC<StoryProps> = ({
  publicKey: propsPublicKey,
  onNext: onParentNext,
  onPrevious: onParentPrevious,
  position
}) => {
  const [currI, setCurrI] = React.useState<number>(0);
  const [pics, setPics] = React.useState<readonly Pic[]>([]);
  const currPic = pics[currI];
  // const { publicKey: paramPublicKey } = useParams<StoryParams>();
  // @ts-ignore
  const publicKey = Store.useSelector(state => state.node.publicKey); //paramPublicKey || propsPublicKey;
  const { displayName } = Store.useSelector(
    ({ userProfiles }) => userProfiles[publicKey]
  );
  const { hostIP } = Store.useSelector(state => state.node);

  React.useEffect(() => {
    const sub = rifle({
      host: hostIP,
      query: `${publicKey}::story::open`
    });

    sub.on("$shock", (pictures: unknown) => {
      if (typeof pictures !== "object" || pictures === null) {
        return;
      }

      setPics(
        Object.values(pictures).filter(p => typeof p === "object" && p !== null)
      );
    });

    sub.on("error", err => {
      alert("error");
      alert(err);
    });

    sub.on("NOT_AUTH", () => {
      alert("NOT_AUTH");
    });

    return () => {
      sub.off("$shock");
      sub.close();
    };
  }, [hostIP, publicKey]);

  React.useEffect(() => {
    if (currI !== 0 && position !== "first") {
      // setCurrI(0);
    }
  }, [currI, position]);

  const onNext = () => {
    if (currI === pics.length - 1) {
      if (position !== "last") {
        setCurrI(0);
      }
      onParentNext();
    } else {
      setCurrI(i => i + 1);
    }
  };
  const onPrevious = () => {
    if (currI === 0) {
      onParentPrevious();
    } else {
      setCurrI(i => i - 1);
    }
  };

  if (pics.length === 0) {
    return <div className={classNames("page-container", styles.container)} />;
  }

  return (
    <div className={classNames("page-container", styles.container)}>
      <img
        alt={`Pic ${currI + 1} out of ${pics.length}`}
        src={`data:image/jpeg;base64,${currPic.data}`}
        className={styles.picture}
      />

      <Pad amt={24} />

      <div className={styles["lines-container"]}>
        {pics.map((pic, i) => (
          <React.Fragment key={pic.id}>
            <Pad amt={12} insideRow />

            <div
              className={classNames(
                styles["line"],
                i === currI && styles["line-selected"]
              )}
            />

            <Pad amt={12} insideRow />
          </React.Fragment>
        ))}
      </div>

      <Pad amt={24} />

      <div className={styles.info}>
        <span>{displayName}</span>

        <Pad amt={12} />

        <span>
          {moment(Utils.normalizeTimestampToMs(currPic.timestamp)).fromNow()}
        </span>
      </div>

      <div className={styles["half-left"]} onClick={onPrevious} />

      <div className={styles["half-right"]} onClick={onNext} />
    </div>
  );
};

export default Story;
