import { ReactNode } from "react";
import { Item } from "./Item";
import { HasIdAndChildren } from "./Mindmapr";

interface ItemGroupProps<T extends HasIdAndChildren> {
  items: T[];
  side: "left" | "right";
  renderItem: (data: T) => ReactNode;
  parentRef: HTMLDivElement | null;
}

export const ItemGroup = <T extends HasIdAndChildren>({
  items,
  side,
  renderItem,
  parentRef,
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
        />
      ))}
    </>
  );
};
