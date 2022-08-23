import { HasIdAndChildren, RenderItemState } from "./Mindmapr";
import React, { ReactNode, useEffect, useState } from "react";
import { ItemGroup } from "./ItemGroup";
import "./Item.css";
import { generateChildParentId } from "./util";

interface ItemProps<T extends HasIdAndChildren> {
  item: T;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
  side: "left" | "right";
  parentRef: HTMLDivElement | null;
  parentId: string | number;
  addParentChildRefWithId: (
    id: string,
    value: [HTMLDivElement, HTMLDivElement]
  ) => void;
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
  addParentChildRefWithId,
}: ItemProps<T>) => {
  const [newParentRef, setNewParentRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (parentRef && newParentRef) {
      addParentChildRefWithId(generateChildParentId(parentId, item.id), [
        parentRef,
        newParentRef,
      ]);
    }
  }, [parentRef, newParentRef, parentId, item.id, addParentChildRefWithId]);

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
                addParentChildRefWithId={addParentChildRefWithId}
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
                depth={depth + 1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            ) : (
              <div className="itemWrapper" ref={setRef}>
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
                addParentChildRefWithId={addParentChildRefWithId}
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
