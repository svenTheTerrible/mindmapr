import { ReactNode } from "react";
import { Item } from "./Item";
import { HasIdAndChildren } from "./Mindmapr";

interface ItemGroupProps<T extends HasIdAndChildren> {
  items: T[];
  side: "left" | "right";
  renderItem: (data: T, depth: number) => ReactNode;
  parentRef: HTMLDivElement | null;
  depth: number;
}

export const ItemGroup = <T extends HasIdAndChildren>({
  items,
  side,
  renderItem,
  parentRef,
  depth,
}: ItemGroupProps<T>) => {
  return (
    <>
      {items.map((item) => (
        <Item
          item={item}
          parentRef={parentRef}
          renderItem={renderItem}
          side={side}
          key={item.id}
          depth={depth}
        />
      ))}
    </>
  );
};
