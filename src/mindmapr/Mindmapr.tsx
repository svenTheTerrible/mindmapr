import { CSSProperties, ReactNode, useCallback, useState } from "react";
import "./Mindmapr.css";
import ClickAwayListener from "react-click-away-listener";
import ItemLines, { ParentChildRefWithId } from "./ItemLines";
import MindmaprItems from "./MindmaprItems";

export interface HasIdAndChildren {
  id: string | number;
  children: HasIdAndChildren[];
}

export interface RenderItemState {
  isSelected: boolean;
}

interface MindmaprProps<T extends HasIdAndChildren> {
  items: T;
  addChildKey?: string;
  side?: "both" | "left" | "right";
  addChildOnParentLevelKey?: string;
  overwriteOnSelectedItemKeydown?: (
    selectedItem: string | number,
    e: KeyboardEvent
  ) => void;
  overwriteLineStyle?: (depth: number) => CSSProperties;
  setData?: (items: T) => void;
  createNewItem?: (parent: T) => T | undefined;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
}

export const Mindmapr = <T extends HasIdAndChildren>({
  items,
  setData,
  createNewItem,
  renderItem,
  overwriteOnSelectedItemKeydown,
  addChildKey = "Tab",
  side = "both",
  addChildOnParentLevelKey = "Enter",
  overwriteLineStyle,
}: MindmaprProps<T>) => {
  const [parentChildRefWithId, setParentChildRefWithId] =
    useState<ParentChildRefWithId>({});

  const [selectedItem, setSelectedItem] = useState<number | string | undefined>(
    undefined
  );

  const clearSelectedItem = () => {
    setSelectedItem(undefined);
  };

  const addParentChildRefWithId = useCallback(
    (id: string, value: [HTMLDivElement, HTMLDivElement], depth: number) => {
      setParentChildRefWithId((current) => {
        return { ...current, [id]: [...value, depth] };
      });
    },
    [setParentChildRefWithId]
  );

  return (
    <ClickAwayListener onClickAway={clearSelectedItem}>
      <div className="mindmaprScrollContainer" onClick={clearSelectedItem}>
        <div className="innerMindmaprContainer">
          <MindmaprItems
            side={side}
            overwriteOnSelectedItemKeydown={overwriteOnSelectedItemKeydown}
            addChildKey={addChildKey}
            addChildOnParentLevelKey={addChildOnParentLevelKey}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            items={items}
            setData={setData as any}
            createNewItem={createNewItem as any}
            renderItem={renderItem as any}
            addParentChildRefWithId={addParentChildRefWithId}
          />
          <ItemLines
            parentChildRefsWithId={parentChildRefWithId}
            overwriteLineStyle={overwriteLineStyle}
          />
        </div>
      </div>
    </ClickAwayListener>
  );
};
