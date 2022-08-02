import { HasIdAndChildren } from "./Mindmapr";
import { ReactNode, useState } from "react";
import { ItemGroup } from "./ItemGroup";
import "./Item.css";
import { ItemLine } from "./ItemLine";

interface ItemProps<T extends HasIdAndChildren> {
  item: T;
  renderItem: (item: T, depth: number) => ReactNode;
  side: "left" | "right";
  parentRef: HTMLDivElement | null;
  depth: number;
}

export const Item = <T extends HasIdAndChildren>({
  item,
  renderItem,
  side,
  parentRef,
  depth,
}: ItemProps<T>) => {
  const [newParentRef, setNewParentRef] = useState<HTMLDivElement | null>(null);

  const setRef = (ref: HTMLDivElement): void => {
    setNewParentRef(ref);
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
              />
            ) : (
              <div style={{ position: "relative" }} ref={setRef}>
                <ItemLine itemRef={newParentRef} parentRef={parentRef} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  {renderItem(item, depth)}
                </div>
              </div>
            )}
          </td>
          <td>
            {side === "left" ? (
              <div style={{ position: "relative" }} ref={setRef}>
                <ItemLine itemRef={newParentRef} parentRef={parentRef} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  {renderItem(item, depth)}
                </div>
              </div>
            ) : (
              <ItemGroup
                parentRef={newParentRef}
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
                depth={depth + 1}
              />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
