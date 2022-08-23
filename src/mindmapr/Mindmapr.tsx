import { ReactNode, useCallback, useState } from "react";
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
  setData: (items: T) => void;
  createNewItem: (parent: T) => T | undefined;
  itemsSelectable?: boolean;
  allowSelectionChangeTroughKeyboard?: boolean;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
}

export const Mindmapr = <T extends HasIdAndChildren>({
  items,
  setData,
  createNewItem,
  renderItem,
  itemsSelectable,
  allowSelectionChangeTroughKeyboard,
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
    (id: string, value: [HTMLDivElement, HTMLDivElement]) => {
      setParentChildRefWithId((current) => {
        return { ...current, [id]: value };
      });
    },
    [setParentChildRefWithId]
  );

  return (
    <ClickAwayListener onClickAway={clearSelectedItem}>
      <div className="mindmaprContainer" onClick={clearSelectedItem}>
        <MindmaprItems
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          items={items}
          setData={setData as any}
          createNewItem={createNewItem as any}
          renderItem={renderItem as any}
          allowSelectionChangeTroughKeyboard={
            allowSelectionChangeTroughKeyboard
          }
          itemsSelectable={itemsSelectable}
          addParentChildRefWithId={addParentChildRefWithId}
        />
        <ItemLines parentChildRefsWithId={parentChildRefWithId} />
      </div>
    </ClickAwayListener>
  );
};
