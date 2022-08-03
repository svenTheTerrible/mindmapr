import { ReactNode, useEffect, useMemo, useState } from "react";
import { ItemGroup } from "./ItemGroup";
import "./Mindmapr.css";
import { findItemById, splitItemsToLeftAndRight } from "./util";
import ClickAwayListener from "react-click-away-listener";

export interface HasIdAndChildren {
  id: string | number;
  children: HasIdAndChildren[];
}

export interface RenderItemState {
  isSelected: boolean;
}

interface MindmaprProps<T extends HasIdAndChildren> {
  items: T;
  onChange: (data: T) => void;
  itemsSelectable?: boolean;
  allowSelectionChangeTroughKeyboard?: boolean;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
}

export const Mindmapr = <T extends HasIdAndChildren>({
  items,
  onChange,
  renderItem,
  itemsSelectable,
  allowSelectionChangeTroughKeyboard,
}: MindmaprProps<T>) => {
  const [centerItemRef, setCenterItemRef] = useState<HTMLDivElement | null>(
    null
  );

  const [selectedItem, setSelectedItem] = useState<number | string | undefined>(
    undefined
  );

  const { leftItems, rightItems } = useMemo(() => {
    return splitItemsToLeftAndRight(items.children) as {
      leftItems: T[];
      rightItems: T[];
    };
  }, [items.children]);

  useEffect(() => {
    if (!itemsSelectable) {
      setSelectedItem(undefined);
    }
  }, [itemsSelectable, setSelectedItem]);

  useEffect(() => {
    const switchSelectionThroughKeypress = (e: KeyboardEvent) => {
      if (!selectedItem || !allowSelectionChangeTroughKeyboard) {
        return;
      }

      const selectedItemIsCenter = selectedItem === items.id;
      const foundInLeftItems = findItemById(leftItems, selectedItem, items.id);
      const foundInRightItems = findItemById(
        rightItems,
        selectedItem,
        items.id
      );

      if (e.key === "ArrowDown") {
        if (selectedItemIsCenter) {
          return;
        }
        const lowerItem =
          foundInLeftItems?.lowerElementId ?? foundInRightItems?.lowerElementId;
        if (lowerItem) {
          setSelectedItem(lowerItem);
          return;
        }
      }

      if (e.key === "ArrowLeft") {
        if (selectedItemIsCenter && leftItems.length > 0) {
          setSelectedItem(leftItems[0].id);
          return;
        }

        if (foundInLeftItems && foundInLeftItems.childIds.length > 0) {
          setSelectedItem(foundInLeftItems.childIds[0]);
          return;
        }

        if (foundInRightItems) {
          setSelectedItem(foundInRightItems.parentId);
        }
      }

      if (e.key === "ArrowRight") {
        if (selectedItemIsCenter && rightItems.length > 0) {
          setSelectedItem(rightItems[0].id);
          return;
        }

        if (foundInRightItems && foundInRightItems.childIds.length > 0) {
          setSelectedItem(foundInRightItems.childIds[0]);
          return;
        }

        if (foundInLeftItems) {
          setSelectedItem(foundInLeftItems.parentId);
        }
      }

      if (e.key === "ArrowUp") {
        if (selectedItemIsCenter) {
          return;
        }
        const upperItem =
          foundInLeftItems?.upperElementId ?? foundInRightItems?.upperElementId;
        if (upperItem) {
          setSelectedItem(upperItem);
          return;
        }
      }
    };
    window.addEventListener("keydown", switchSelectionThroughKeypress);
    return () => {
      window.removeEventListener("keydown", switchSelectionThroughKeypress);
    };
  }, [
    allowSelectionChangeTroughKeyboard,
    selectedItem,
    setSelectedItem,
    items,
    leftItems,
    rightItems,
  ]);

  const selectCenterItem = () => {
    if (itemsSelectable) {
      setSelectedItem(items.id);
    }
  };

  const clearSelectedItem = () => {
    setSelectedItem(undefined);
  };

  return (
    <ClickAwayListener onClickAway={clearSelectedItem}>
      <div className="mindmaprContainer">
        <div className="leftContainer">
          <ItemGroup
            parentRef={centerItemRef}
            items={leftItems}
            side="left"
            renderItem={renderItem}
            depth={1}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            itemsSelectable={itemsSelectable}
          />
        </div>
        <div
          className="centerItem"
          ref={(ref) => setCenterItemRef(ref)}
          onClick={selectCenterItem}
        >
          {renderItem(items, 0, { isSelected: selectedItem === items.id })}
        </div>
        <div className="rightContainer">
          <ItemGroup
            parentRef={centerItemRef}
            items={rightItems}
            side="right"
            renderItem={renderItem}
            depth={1}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            itemsSelectable={itemsSelectable}
          />
        </div>
      </div>
    </ClickAwayListener>
  );
};
