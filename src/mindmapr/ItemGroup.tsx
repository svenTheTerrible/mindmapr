import { ReactNode } from "react";
import { Item } from "./Item";
import { HasIdAndChildren } from "./Mindmapr";

interface ItemGroupProps<T extends HasIdAndChildren> {
  items: T[];
  side: "left" | "right";
  renderItem: (data: T) => ReactNode;
}

export const ItemGroup = <T extends HasIdAndChildren>({
  items,
  side,
  renderItem,
}: ItemGroupProps<T>) => {
  return (
    <>
      {items.map((item) => (
        <Item item={item} renderItem={renderItem} side={side} key={item.id} />
      ))}
    </>
  );
};
