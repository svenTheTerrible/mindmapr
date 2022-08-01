import { FC } from "react";

interface ItemLineProps {
  parentRef: HTMLDivElement | null;
  itemRef: HTMLDivElement | null;
}

interface Coords {
  x: number;
  y: number;
}

export const ItemLine: FC<ItemLineProps> = ({ itemRef, parentRef }) => {
  if (itemRef === null || parentRef === null) {
    return null;
  }

  const getCenterCoordsOfItem = (coords: DOMRect): Coords => {
    return {
      x: coords.x + coords.width / 2,
      y: coords.y + coords.height / 2,
    };
  };

  const itemCoords = itemRef.getBoundingClientRect();
  const parentCoords = parentRef.getBoundingClientRect();

  const itemCenter = getCenterCoordsOfItem(itemCoords);
  const parentCenter = getCenterCoordsOfItem(parentCoords);

  const calculateLineAndSvgCoords = (): {
    left: number | undefined;
    right: number | undefined;
    top: number | undefined;
    bottom: number | undefined;
    height: number;
    width: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } => {
    //right /
    if (itemCenter.y < parentCenter.y && itemCenter.x > parentCenter.x) {
      const svgHeight = Math.abs(itemCenter.y - parentCenter.y);
      const svgWidth =
        Math.abs(parentCenter.x - itemCenter.x) - itemCoords.width / 2;

      return {
        height: svgHeight,
        width: svgWidth,
        left: -svgWidth,
        right: undefined,
        top: itemCoords.height / 2,
        x1: svgWidth,
        y1: 0,
        x2: 0,
        y2: svgHeight,
        bottom: undefined,
      };
    }
    //right \
    if (itemCenter.y > parentCenter.y && itemCenter.x > parentCenter.x) {
      const svgHeight = Math.abs(itemCenter.y - parentCenter.y);
      const svgWidth =
        Math.abs(parentCenter.x - itemCenter.x) - itemCoords.width / 2;

      return {
        height: svgHeight,
        width: svgWidth,
        left: -svgWidth,
        right: undefined,
        top: undefined,
        bottom: itemCoords.height / 2,
        x1: svgWidth,
        y1: svgHeight,
        x2: 0,
        y2: 0,
      };
    }

    //left /
    if (itemCenter.y > parentCenter.y && itemCenter.x < parentCenter.x) {
      const svgHeight = Math.abs(itemCenter.y - parentCenter.y);
      const svgWidth =
        Math.abs(parentCenter.x - itemCenter.x) - itemCoords.width / 2;

      return {
        height: svgHeight,
        width: svgWidth,
        left: undefined,
        right: -svgWidth,
        top: undefined,
        bottom: itemCoords.height / 2,
        x1: 0,
        y1: svgHeight,
        x2: svgWidth,
        y2: 0,
      };
    }

    //left \
    if (itemCenter.y < parentCenter.y && itemCenter.x < parentCenter.x) {
      const svgHeight = Math.abs(itemCenter.y - parentCenter.y);
      const svgWidth =
        Math.abs(parentCenter.x - itemCenter.x) - itemCoords.width / 2;

      return {
        height: svgHeight,
        width: svgWidth,
        left: undefined,
        right: -svgWidth,
        top: itemCoords.height / 2,
        bottom: undefined,
        x1: 0,
        y1: 0,
        x2: svgWidth,
        y2: svgHeight,
      };
    }

    return {
      height: 0,
      left: 0,
      right: undefined,
      top: 0,
      bottom: undefined,
      width: 0,
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    };
  };

  const { height, width, left, top, x1, x2, y1, y2, bottom, right } =
    calculateLineAndSvgCoords();

  return (
    <svg
      style={{
        position: "absolute",
        left,
        top,
        bottom,
        right,
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
