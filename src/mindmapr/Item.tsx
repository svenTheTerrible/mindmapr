import { HasIdAndChildren } from "./Mindmapr";
import { ReactNode } from "react";
import { ItemGroup } from "./ItemGroup";
import "./Item.css";

interface ItemProps<T extends HasIdAndChildren> {
  item: T;
  renderItem: (item: T) => ReactNode;
  side: "left" | "right";
}

export const Item = <T extends HasIdAndChildren>({
  item,
  renderItem,
  side,
}: ItemProps<T>) => {
  return (
    <table className={side === "left" ? "leftItem" : "rightItem"}>
      <tbody>
        <tr>
          <td>
            {side === "left" ? (
              <ItemGroup
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
              />
            ) : (
              renderItem(item)
            )}
          </td>
          <td>
            {side === "left" ? (
              renderItem(item)
            ) : (
              <ItemGroup
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
