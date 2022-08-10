import { memo, useEffect, useState } from "react";
import { ItemLine, LineProps } from "./ItemLine";
import { calculateLineAndSvgCoords } from "./util";

export type ParentChildRefWithId = Record<
  string,
  [HTMLDivElement, HTMLDivElement]
>;

interface ItemLinesProps {
  parentChildRefsWithId: ParentChildRefWithId;
}

export default memo(function ItemLines({
  parentChildRefsWithId,
}: ItemLinesProps) {
  const [coords, setCoords] = useState<Record<string, LineProps>>({});

  useEffect(() => {
    setCoords((current) => {
      let lineCountChanged = false;
      Object.keys(parentChildRefsWithId).forEach((key) => {
        //todo correct item line calculation
        if (!current[key]) {
          lineCountChanged = true;
        }
        current[key] = calculateLineAndSvgCoords(
          parentChildRefsWithId[key][1],
          parentChildRefsWithId[key][0]
        );
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
