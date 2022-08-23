import { CSSProperties, memo, useEffect, useState } from "react";
import { ItemLine, LineProps } from "./ItemLine";
import { calculateLineAndSvgCoords } from "./util";

export type ParentChildRefWithId = Record<
  string,
  [HTMLDivElement, HTMLDivElement, number]
>;

interface ItemLinesProps {
  parentChildRefsWithId: ParentChildRefWithId;
  overwriteLineStyle?: (depth: number) => CSSProperties;
}

export default memo(function ItemLines({
  parentChildRefsWithId,
  overwriteLineStyle,
}: ItemLinesProps) {
  const [coords, setCoords] = useState<
    Record<string, LineProps & { depth: number }>
  >({});

  useEffect(() => {
    setCoords((current) => {
      let lineCountChanged = false;
      Object.keys(parentChildRefsWithId).forEach((key) => {
        if (!current[key]) {
          lineCountChanged = true;
        }
        current[key] = {
          ...calculateLineAndSvgCoords(
            parentChildRefsWithId[key][1],
            parentChildRefsWithId[key][0]
          ),
          depth: parentChildRefsWithId[key][2],
        };
      });
      if (lineCountChanged) {
        return { ...current };
      }
      return current;
    });
  }, [parentChildRefsWithId, setCoords]);

  return (
    <div>
      {Object.keys(coords).map((key) => (
        <ItemLine
          overwriteLineStyle={overwriteLineStyle}
          depth={coords[key].depth}
          key={key}
          left={coords[key].left}
          top={coords[key].top}
          height={coords[key].height}
          width={coords[key].width}
          x1={coords[key].x1}
          x2={coords[key].x2}
          y1={coords[key].y1}
          y2={coords[key].y2}
        />
      ))}
    </div>
  );
});
