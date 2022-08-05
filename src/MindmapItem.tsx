import { FC } from "react";
import { MindmapData } from "./App";
import { RenderItemState } from "./mindmapr/Mindmapr";
import "./MindmapItem.css";

interface MindmapItemProps {
  depth: number;
  data: MindmapData;
  state: RenderItemState;
}

const depthClasses = [
  "centerMindmaprItem",
  "firstLevelMindmaprItem",
  "secondLevelMindmaprItem",
  "thirdLevelMindmaprItem",
];

const getClassNameFromDepth = (depth: number): string => {
  if (depth >= depthClasses.length) {
    return depthClasses[depthClasses.length - 1];
  }
  return depthClasses[depth];
};

const joinClassNames = (names: Array<string | undefined>): string => {
  return names.filter((name) => name !== undefined).join(" ");
};

export const MindmapItem: FC<MindmapItemProps> = ({ depth, data, state }) => {
  return (
    <div
      className={joinClassNames([
        getClassNameFromDepth(depth),
        state.isSelected ? "selected" : undefined,
      ])}
    >
      {data.name}
    </div>
  );
};
