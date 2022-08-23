import { useEffect, useMemo, useState, ReactNode, memo } from "react";
import { ItemGroup } from "./ItemGroup";
import { HasIdAndChildren, RenderItemState } from "./Mindmapr";
import {
  addOnChildLevel,
  addOnParentLevel,
  findItemById,
  splitItemsToLeftAndRight,
} from "./util";

interface MindmaprItemsProps<T extends HasIdAndChildren> {
  items: T;
  addChildKey: string;
  addChildOnParentLevelKey: string;
  setData?: (items: T) => void;
  overwriteOnSelectedItemKeydown?: (
    selectedItem: string | number,
    e: KeyboardEvent
  ) => void;
  createNewItem?: (parent: T) => T;
  selectedItem?: string | number;
  setSelectedItem: (value?: string | number) => void;
  addParentChildRefWithId: (
    id: string,
    value: [HTMLDivElement, HTMLDivElement],
    depth: number
  ) => void;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
}

export default memo(function MindmaprItems<T extends HasIdAndChildren>({
  items,
  setData,
  createNewItem,
  renderItem,
  addParentChildRefWithId,
  overwriteOnSelectedItemKeydown,
  selectedItem,
  setSelectedItem,
  addChildKey,
  addChildOnParentLevelKey,
}: MindmaprItemsProps<T>) {
  const [centerItemRef, setCenterItemRef] = useState<HTMLDivElement | null>(
    null
  );

  const { leftItems, rightItems } = useMemo(() => {
    return splitItemsToLeftAndRight(items.children) as {
      leftItems: T[];
      rightItems: T[];
    };
  }, [items.children]);

  useEffect(() => {
    setSelectedItem(undefined);
  }, [setSelectedItem]);

  useEffect(() => {
    const switchSelectionThroughKeypress = (e: KeyboardEvent) => {
      if (!selectedItem) {
        return;
      }

      if (overwriteOnSelectedItemKeydown) {
        overwriteOnSelectedItemKeydown(selectedItem, e);
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
        e.preventDefault();
        e.stopImmediatePropagation();
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
        e.preventDefault();
        e.stopImmediatePropagation();
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
        e.preventDefault();
        e.stopImmediatePropagation();
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
        e.preventDefault();
        e.stopImmediatePropagation();
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

      if (e.key === addChildKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const { item: newItems, newItemId } = addOnChildLevel(
          selectedItem,
          items,
          createNewItem
        );
        if (newItemId) {
          setSelectedItem(newItemId);
          setData?.(newItems);
        }
        return;
      }

      if (e.key === addChildOnParentLevelKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const { item: newItems, newItemId } = addOnParentLevel(
          selectedItem,
          items,
          createNewItem
        );
        if (newItemId) {
          setSelectedItem(newItemId);
          setData?.(newItems);
        }
        return;
      }
    };
    window.addEventListener("keydown", switchSelectionThroughKeypress);
    return () => {
      window.removeEventListener("keydown", switchSelectionThroughKeypress);
    };
  }, [
    selectedItem,
    setSelectedItem,
    createNewItem,
    items,
    setData,
    leftItems,
    rightItems,
    addChildKey,
    addChildOnParentLevelKey,
    overwriteOnSelectedItemKeydown,
  ]);

  const selectCenterItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(items.id);
  };

  return (
    <>
      <div className="leftContainer">
        <ItemGroup
          parentRef={centerItemRef}
          parentId={items.id}
          addParentChildRefWithId={addParentChildRefWithId}
          items={leftItems}
          side="left"
          renderItem={renderItem}
          depth={1}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
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
          parentId={items.id}
          addParentChildRefWithId={addParentChildRefWithId}
          items={rightItems}
          side="right"
          renderItem={renderItem}
          depth={1}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </div>
    </>
  );
});
