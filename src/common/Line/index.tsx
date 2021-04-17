import { useMemo } from "react";

export interface LineProps {
  color: string;
  length: number;
  type: "vertical" | "horizontal";
  width: number;
}

const Line = ({ color, length, type, width }: LineProps) => {
  const style = useMemo<React.CSSProperties>(() => {
    if (type === "vertical") {
      return {
        borderLeftStyle: "solid",
        borderLeftWidth: `${width / 2}px`,
        borderLeftColor: color,
        borderRightStyle: "solid",
        borderRightWidth: `${width / 2}px`,
        borderRightColor: color,
        height: length
      };
    }

    if (type === "horizontal") {
      return {
        borderTopStyle: "solid",
        borderTopWidth: width / 2,
        borderTopColor: color,
        borderBottomStyle: "solid",
        borderBottomWidth: width / 2,
        borderBottomColor: color,
        width: length
      };
    }

    return {};
  }, [color, length, type, width]);

  return <div style={style} />;
};

export default Line;
