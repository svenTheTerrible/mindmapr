import { CSSProperties, memo, useEffect, useState } from "react";
import { ItemLine, LineProps } from "./ItemLine";
import { calculateLineAndSvgCoords } from "./util";

export interface ParentChildConnection {
  parentHtmlItem: HTMLDivElement;
  childHtmlItem: HTMLDivElement;
  depth: number;
  parentId: string | number;
  childId: string | number;
}

interface ItemLinesProps {
  parentChildConnections: ParentChildConnection[];
  overwriteLineStyle?: (depth: number) => CSSProperties;
}

export default memo(function ItemLines({
  parentChildConnections,
  overwriteLineStyle,
}: ItemLinesProps) {
  const [coords, setCoords] = useState<
    Record<string, LineProps & { depth: number }>
  >({});

  useEffect(() => {
    setCoords((current) => {
      let lineCountChanged = false;
      parentChildConnections.forEach((connection) => {
        const connectionId = `${connection.parentId} ${connection.childId}`;
        if (!current[connectionId]) {
          lineCountChanged = true;
        }
        current[connectionId] = {
          ...calculateLineAndSvgCoords(
            connection.childHtmlItem,
            connection.parentHtmlItem
          ),
          depth: connection.depth,
        };
      });
      if (lineCountChanged) {
        return { ...current };
      }
      return current;
    });
  }, [parentChildConnections, setCoords]);

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
