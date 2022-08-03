import { ReactNode } from "react";
import { Item } from "./Item";
import { HasIdAndChildren, RenderItemState } from "./Mindmapr";

interface ItemGroupProps<T extends HasIdAndChildren> {
  items: T[];
  side: "left" | "right";
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
  parentRef: HTMLDivElement | null;
  depth: number;
  selectedItem: string | number | undefined;
  setSelectedItem: (value: string | number | undefined) => void;
  itemsSelectable?: boolean;
}

export const ItemGroup = <T extends HasIdAndChildren>({
  items,
  ...props
}: ItemGroupProps<T>) => {
  return (
    <>
      {items.map((item) => (
        <Item item={item} key={item.id} {...props} />
      ))}
    </>
  );
};
