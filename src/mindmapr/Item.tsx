import { HasIdAndChildren, RenderItemState } from "./Mindmapr";
import React, { ReactNode, useEffect, useState } from "react";
import { ItemGroup } from "./ItemGroup";
import "./Item.css";
import { ParentChildConnection } from "./ItemLines";

interface ItemProps<T extends HasIdAndChildren> {
  item: T;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
  side: "left" | "right";
  parentRef: HTMLDivElement | null;
  parentId: string | number;
  addParentChildConnection: (connection: ParentChildConnection) => void;
  depth: number;
  selectedItem: string | number | undefined;
  setSelectedItem: (value: string | number | undefined) => void;
}

export const Item = <T extends HasIdAndChildren>({
  item,
  renderItem,
  side,
  parentRef,
  depth,
  selectedItem,
  setSelectedItem,
  parentId,
  addParentChildConnection,
}: ItemProps<T>) => {
  const [newParentRef, setNewParentRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (parentRef && newParentRef) {
      addParentChildConnection({
        childHtmlItem: newParentRef,
        parentHtmlItem: parentRef,
        childId: item.id,
        depth: depth,
        parentId,
      });
    }
  }, [
    parentRef,
    newParentRef,
    parentId,
    item.id,
    addParentChildConnection,
    depth,
  ]);

  useEffect(() => {
    if (selectedItem === item.id) {
      newParentRef?.focus();
    }
  }, [selectedItem, newParentRef, item]);

  const setRef = (ref: HTMLDivElement): void => {
    setNewParentRef(ref);
  };

  const selectItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item.id);
  };

  return (
    <table className={side === "left" ? "leftItem" : "rightItem"}>
      <tbody>
        <tr>
          <td>
            {side === "left" ? (
              <ItemGroup
                parentRef={newParentRef}
                parentId={item.id}
                addParentChildConnection={addParentChildConnection}
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
                depth={depth + 1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            ) : (
              <div tabIndex={-1} className="itemWrapper" ref={setRef}>
                <div
                  style={{ position: "relative", zIndex: 2 }}
                  onClick={selectItem}
                >
                  {renderItem(item, depth, {
                    isSelected: item.id === selectedItem,
                  })}
                </div>
              </div>
            )}
          </td>
          <td>
            {side === "left" ? (
              <div tabIndex={-1} className="itemWrapper" ref={setRef}>
                <div
                  style={{ position: "relative", zIndex: 2 }}
                  onClick={selectItem}
                >
                  {renderItem(item, depth, {
                    isSelected: item.id === selectedItem,
                  })}
                </div>
              </div>
            ) : (
              <ItemGroup
                parentRef={newParentRef}
                parentId={item.id}
                addParentChildConnection={addParentChildConnection}
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
                depth={depth + 1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
