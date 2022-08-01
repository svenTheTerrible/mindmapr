import { HasIdAndChildren } from "./Mindmapr";
import { ReactNode, useState } from "react";
import { ItemGroup } from "./ItemGroup";
import "./Item.css";
import { ItemLine } from "./ItemLine";

interface ItemProps<T extends HasIdAndChildren> {
  item: T;
  renderItem: (item: T) => ReactNode;
  side: "left" | "right";
  parentRef: HTMLDivElement | null;
}

export const Item = <T extends HasIdAndChildren>({
  item,
  renderItem,
  side,
  parentRef,
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
              />
            ) : (
              <div style={{ position: "relative" }} ref={setRef}>
                <ItemLine itemRef={newParentRef} parentRef={parentRef} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  {renderItem(item)}
                </div>
              </div>
            )}
          </td>
          <td>
            {side === "left" ? (
              <div style={{ position: "relative" }} ref={setRef}>
                <ItemLine itemRef={newParentRef} parentRef={parentRef} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  {renderItem(item)}
                </div>
              </div>
            ) : (
              <ItemGroup
                parentRef={newParentRef}
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
              />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
