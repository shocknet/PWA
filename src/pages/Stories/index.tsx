import React from "react";
import classNames from "classnames";
import moment from "moment";

import Story from "../Story";
import { Pic } from "../../hooks";

import styles from "./css/index.module.css";
import { data1, data2, data3, data4, data5, data6 } from "./data";

interface IStory {
  publicKey: string;
  displayName: string;
  pics: readonly Pic[];
}

const Stories = () => {
  const [currI, setCurrI] = React.useState<number>(0);
  const stories: readonly IStory[] = [
    {
      publicKey: "iorjioerioejm,bnvmxnbnmxbcvxmnb.",
      displayName: "Daniel",
      pics: [
        {
          data: data1,
          id: "asdjkasd",
          timestamp: moment().clone().subtract(1, "day").valueOf()
        },
        {
          data: data2,
          id: "asdjasdhjkasd",
          timestamp: moment().clone().subtract(6, "hours").valueOf()
        },
        {
          data: data3,
          id: "zxnzmxmcbnzxbc",
          timestamp: moment().clone().subtract(20, "minutes").valueOf()
        }
      ]
    },
    {
      publicKey: "uihijkgnndb90df8g908324.---asfhjaskfbbn34m2",
      displayName: "John",
      pics: [
        {
          data: data4,
          id: "mbmcbnmncbvmnbcv",
          timestamp: moment().clone().subtract(1, "day").valueOf()
        },
        {
          data: data5,
          id: "oiorjtkljk`g`kllj",
          timestamp: moment().clone().subtract(6, "hours").valueOf()
        },
        {
          data: data6,
          id: "qwr4t3ertertnm",
          timestamp: moment().clone().subtract(20, "minutes").valueOf()
        }
      ]
    }
  ];

  return (
    <Story
      publicKey={stories[currI].publicKey}
      onNext={() => {
        setCurrI(i => (i !== stories.length - 1 ? i + 1 : i));
      }}
      onPrevious={() => {
        setCurrI(i => (i !== 0 ? i - 1 : i));
      }}
      position={(() => {
        if (currI === 0) return "first";
        if (currI === stories.length - 1) return "last";
        return "middle";
      })()}
    />
  );
};

export default Stories;
