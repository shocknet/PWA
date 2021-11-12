import React, { memo } from "react";

export interface PadProps {
  amt: number;
  insideRow?: boolean;
}

const Pad: React.FC<PadProps> = ({ amt, insideRow }) => {
  const style: React.CSSProperties = {};
  if (insideRow) {
    style.width = amt;
  } else {
    style.height = amt;
  }

  return <div style={style} />;
};

export default memo(Pad);
