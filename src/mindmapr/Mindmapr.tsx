import { ReactNode, useEffect, useMemo, useState } from "react";
import { ItemGroup } from "./ItemGroup";
import "./Mindmapr.css";
import { splitItemsToLeftAndRight } from "./util";
import ClickAwayListener from "react-click-away-listener";

export interface HasIdAndChildren {
  id: string | number;
  children: HasIdAndChildren[];
}

export interface RenderItemState {
  isSelected: boolean;
}

interface MindmaprProps<T extends HasIdAndChildren> {
  items: T;
  onChange: (data: T) => void;
  itemsSelectable?: boolean;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
}

export const Mindmapr = <T extends HasIdAndChildren>({
  items,
  onChange,
  renderItem,
  itemsSelectable,
}: MindmaprProps<T>) => {
  const [centerItemRef, setCenterItemRef] = useState<HTMLDivElement | null>(
    null
  );

  const [selectedItem, setSelectedItem] = useState<number | string | undefined>(
    undefined
  );

  const { leftItems, rightItems } = useMemo(() => {
    return splitItemsToLeftAndRight(items.children) as {
      leftItems: T[];
      rightItems: T[];
    };
  }, [items.children]);

  useEffect(() => {
    if (!itemsSelectable) {
      setSelectedItem(undefined);
    }
  }, [itemsSelectable, setSelectedItem]);

  const selectCenterItem = () => {
    if (itemsSelectable) {
      setSelectedItem(items.id);
    }
  };

  const clearSelectedItem = () => {
    setSelectedItem(undefined);
  };

  return (
    <ClickAwayListener onClickAway={clearSelectedItem}>
      <div className="mindmaprContainer">
        <div className="leftContainer">
          <ItemGroup
            parentRef={centerItemRef}
            items={leftItems}
            side="left"
            renderItem={renderItem}
            depth={1}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            itemsSelectable={itemsSelectable}
          />
        </div>
        <div
          className="centerItem"
          ref={(ref) => setCenterItemRef(ref)}
          onClick={selectCenterItem}
        >
          {renderItem(items, 0, { isSelected: selectedItem === items.id })}
        </div>
        <div className="rightContainer">
          <ItemGroup
            parentRef={centerItemRef}
            items={rightItems}
            side="right"
            renderItem={renderItem}
            depth={1}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            itemsSelectable={itemsSelectable}
          />
        </div>
      </div>
    </ClickAwayListener>
  );
};
