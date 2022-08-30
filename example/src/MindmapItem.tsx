import React, { FC, useState } from "react";
import { MindmapData } from "./App";
import { RenderItemState } from "./mindmapr/Mindmapr";
import "./MindmapItem.css";

interface MindmapItemProps {
  depth: number;
  data: MindmapData;
  state: RenderItemState;
  changeItemText: (id: string | number, name: string) => void;
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

export const MindmapItem: FC<MindmapItemProps> = ({
  depth,
  data,
  state,
  changeItemText,
}) => {
  const [inputValue, setInputValue] = useState<string | undefined>();

  const enableEditing = () => {
    if (!state.isSelected) {
      return;
    }

    if (inputValue === undefined) {
      setInputValue(data.name);
      return;
    }
  };

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const applyAlreadyTypedContent = () => {
    if (inputValue === undefined) {
      return;
    }
    changeItemText(data.id, inputValue);
    setInputValue(undefined);
  };

  const handleInputValueKeydown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      applyAlreadyTypedContent();
    }
  };

  const handleInputValueBlur = () => {
    applyAlreadyTypedContent();
  };

  const renderInputValue = () => {
    if (inputValue === undefined) {
      return;
    }

    return (
      <input
        className="overlayInput"
        onBlur={handleInputValueBlur}
        autoFocus={true}
        type="text"
        value={inputValue}
        onKeyDown={handleInputValueKeydown}
        onChange={handleInputValueChange}
      />
    );
  };

  return (
    <div
      onClick={enableEditing}
      className={joinClassNames([
        getClassNameFromDepth(depth),
        state.isSelected ? "selected" : undefined,
      ])}
    >
      <div className={inputValue !== undefined ? "hiddenText" : ""}>
        {data.name}
      </div>
      {renderInputValue()}
    </div>
  );
};
