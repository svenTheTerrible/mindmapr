import { HasIdAndChildren, RenderItemState } from "./Mindmapr";
import React, { ReactNode, useState } from "react";
import { ItemGroup } from "./ItemGroup";
import "./Item.css";
import { ItemLine } from "./ItemLine";

interface ItemProps<T extends HasIdAndChildren> {
  item: T;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
  side: "left" | "right";
  parentRef: HTMLDivElement | null;
  depth: number;
  selectedItem: string | number | undefined;
  setSelectedItem: (value: string | number | undefined) => void;
  itemsSelectable?: boolean;
}

export const Item = <T extends HasIdAndChildren>({
  item,
  renderItem,
  side,
  parentRef,
  depth,
  selectedItem,
  setSelectedItem,
  itemsSelectable,
}: ItemProps<T>) => {
  const [newParentRef, setNewParentRef] = useState<HTMLDivElement | null>(null);

  const setRef = (ref: HTMLDivElement): void => {
    setNewParentRef(ref);
  };

  const selectItem = (e: React.MouseEvent) => {
    if (itemsSelectable) {
      setSelectedItem(item.id);
    }
  };

  return (
    <table className={side === "left" ? "leftItem" : "rightItem"}>
      <tbody>
        <tr>
          <td>
            {side === "left" ? (
              <ItemGroup
                parentRef={newParentRef}
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
                depth={depth + 1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                itemsSelectable={itemsSelectable}
              />
            ) : (
              <div className="itemWrapper" ref={setRef}>
                <ItemLine itemRef={newParentRef} parentRef={parentRef} />
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
              <div className="itemWrapper" ref={setRef}>
                <ItemLine itemRef={newParentRef} parentRef={parentRef} />
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
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
                depth={depth + 1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                itemsSelectable={itemsSelectable}
              />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
