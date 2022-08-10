import { FC } from "react";

export interface LineProps {
  left: number | undefined;
  top: number | undefined;
  height: number;
  width: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const ItemLine: FC<LineProps> = ({
  height,
  left,
  top,
  width,
  x1,
  x2,
  y1,
  y2,
}) => {
  return (
    <svg
      style={{
        position: "absolute",
        left,
        top,
      }}
      height={height}
      width={width}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        style={{ stroke: "#000", strokeWidth: 1.5 }}
      />
    </svg>
  );
};
