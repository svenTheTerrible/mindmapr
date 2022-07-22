import { ReactNode, useMemo } from "react";
import { ItemGroup } from "./ItemGroup";
import "./Mindmapr.css";
import { splitItemsToLeftAndRight } from "./util";

export interface HasIdAndChildren {
  id: string | number;
  children: HasIdAndChildren[];
}

interface MindmaprProps<T extends HasIdAndChildren> {
  items: T;
  onChange: (data: T) => void;
  renderItem: (data: T) => ReactNode;
}

export const Mindmapr = <T extends HasIdAndChildren>({
  items,
  onChange,
  renderItem,
}: MindmaprProps<T>) => {
  const { leftItems, rightItems } = useMemo(() => {
    return splitItemsToLeftAndRight(items.children) as {
      leftItems: T[];
      rightItems: T[];
    };
  }, [items.children]);

  return (
    <div className="mindmaprContainer">
      <div className="leftContainer">
        <ItemGroup items={leftItems} side="left" renderItem={renderItem} />
      </div>
      <div className="centerItem">{renderItem(items)}</div>
      <div className="rightContainer">
        <ItemGroup items={rightItems} side="right" renderItem={renderItem} />
      </div>
    </div>
  );
};
