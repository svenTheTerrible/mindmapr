import React, {
  useEffect,
  useMemo,
  useState,
  ReactNode,
  memo,
  MutableRefObject,
} from "react";
import { ItemGroup } from "./ItemGroup";
import { ParentChildConnection } from "./ItemLines";
import { HasIdAndChildren, RenderItemState } from "./";
import {
  addOnChildLevel,
  addOnParentLevel,
  findItemById,
  findNearestChildItem,
  removeItemById,
  splitItemsToLeftAndRight,
} from "./util";
import styled from 'styled-components';

interface MindmaprItemsProps<T extends HasIdAndChildren> {
  items: T;
  parentChildConnectionsRef: MutableRefObject<ParentChildConnection[]>;
  side: "both" | "left" | "right";
  addChildKey: string;
  deleteItemKey: string;
  addChildOnParentLevelKey: string;
  setData?: (items: T) => void;
  overwriteOnSelectedItemKeydown?: (
    selectedItem: string | number,
    e: KeyboardEvent
  ) => void;
  createNewItem?: (parent: T) => T;
  selectedItem?: string | number;
  setSelectedItem: (value?: string | number) => void;
  addParentChildConnection: (connection: ParentChildConnection) => void;
  removeParentChildConnection: (
    childId: string | number
  ) => void;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
}

export default memo(function MindmaprItems<T extends HasIdAndChildren>({
  items,
  side,
  parentChildConnectionsRef,
  setData,
  createNewItem,
  renderItem,
  addParentChildConnection,
  removeParentChildConnection,
  overwriteOnSelectedItemKeydown,
  selectedItem,
  setSelectedItem,
  addChildKey,
  addChildOnParentLevelKey,
  deleteItemKey,
}: MindmaprItemsProps<T>) {
  const [centerItemRef, setCenterItemRef] = useState<HTMLDivElement | null>(
    null
  );

  const { leftItems, rightItems } = useMemo(() => {
    if (side === "left") {
      return { leftItems: items.children, rightItems: [] } as unknown as {
        leftItems: T[];
        rightItems: T[];
      };
    }
    if (side === "right") {
      return { leftItems: [], rightItems: items.children } as unknown as {
        leftItems: T[];
        rightItems: T[];
      };
    }
    return splitItemsToLeftAndRight(items.children) as {
      leftItems: T[];
      rightItems: T[];
    };
  }, [items.children, side]);

  useEffect(() => {
    setSelectedItem(undefined);
  }, [setSelectedItem]);

  useEffect(() => {
    centerItemRef?.focus();
  }, [centerItemRef]);

  useEffect(() => {
    if (selectedItem === items.id) {
      centerItemRef?.focus();
    }
  }, [selectedItem, items, centerItemRef]);

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
          setSelectedItem(
            findNearestChildItem(
              items.id,
              leftItems.map((item) => item.id),
              parentChildConnectionsRef.current
            )
          );
          return;
        }

        if (foundInLeftItems && foundInLeftItems.childIds.length > 0) {
          setSelectedItem(
            findNearestChildItem(
              selectedItem,
              foundInLeftItems.childIds,
              parentChildConnectionsRef.current
            )
          );
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
          setSelectedItem(
            findNearestChildItem(
              items.id,
              rightItems.map((item) => item.id),
              parentChildConnectionsRef.current
            )
          );
          return;
        }

        if (foundInRightItems && foundInRightItems.childIds.length > 0) {
          setSelectedItem(
            findNearestChildItem(
              selectedItem,
              foundInRightItems.childIds,
              parentChildConnectionsRef.current
            )
          );
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

      if (e.key === deleteItemKey) {
        if (selectedItemIsCenter) {
          return;
        }
        const match = findItemById(items.children, selectedItem, items.id);
        const cleanItems = removeItemById(items, selectedItem);
        setSelectedItem(match?.upperElementId ?? match?.lowerElementId ?? match?.parentId);
        setData?.(cleanItems);
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
    parentChildConnectionsRef,
    deleteItemKey,
    removeParentChildConnection
  ]);

  const selectCenterItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(items.id);
  };

  return (
    <>
      <LeftContainer>
        <ItemGroup
        removeParentChildConnection={removeParentChildConnection}
          parentRef={centerItemRef}
          parentId={items.id}
          addParentChildConnection={addParentChildConnection}
          items={leftItems}
          side="left"
          renderItem={renderItem}
          depth={1}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </LeftContainer>
      <CenterItem
        tabIndex={-1}
        ref={(ref) => setCenterItemRef(ref)}
        onClick={selectCenterItem}
      >
        {renderItem(items, 0, { isSelected: selectedItem === items.id })}
      </CenterItem>
      <RightContainer>
        <ItemGroup
        removeParentChildConnection={removeParentChildConnection}
          parentRef={centerItemRef}
          parentId={items.id}
          addParentChildConnection={addParentChildConnection}
          items={rightItems}
          side="right"
          renderItem={renderItem}
          depth={1}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </RightContainer>
    </>
  );
});


const LeftContainer = styled.div `
  margin-right: 15px;
  flex-direction: column;
  align-items: flex-end;
`;

const CenterItem = styled.div `
  z-index: 2;
  &:focus {
    outline: none;
  };
`;

const RightContainer = styled.div `
  margin-left: 15px;
`;