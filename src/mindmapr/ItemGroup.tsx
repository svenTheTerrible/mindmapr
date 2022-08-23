import { ReactNode } from "react";
import { Item } from "./Item";
import { HasIdAndChildren, RenderItemState } from "./Mindmapr";

interface ItemGroupProps<T extends HasIdAndChildren> {
  items: T[];
  side: "left" | "right";
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
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
