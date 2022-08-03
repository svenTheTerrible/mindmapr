import { HasIdAndChildren } from "./Mindmapr";

export const splitItemsToLeftAndRight = <T extends HasIdAndChildren>(
  items: T[]
): { leftItems: T[]; rightItems: T[] } => {
  const { rightItems, leftItems } = items.reduce(
    (acc: { rightItems: T[]; leftItems: T[] }, item: T, index: number) => {
      if (items.length / 2 > index) {
        return { ...acc, rightItems: [...acc.rightItems, item] };
      }
      return { ...acc, leftItems: [...acc.leftItems, item] };
    },
    { rightItems: [], leftItems: [] }
  );
  return { leftItems, rightItems };
};

export const findItemById = <T extends HasIdAndChildren>(
  items: T[],
  wantedId: string | number,
  parentId: string | number
):
  | {
      parentId: string | number;
      childIds: Array<string | number>;
      upperElementId: string | number | undefined;
      lowerElementId: string | number | undefined;
    }
  | undefined => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === wantedId) {
      const lowerElementId = items.length > i + 1 ? items[i + 1].id : undefined;
      const upperElementId = i - 1 >= 0 ? items[i - 1].id : undefined;
      return {
        parentId,
        childIds: items[i].children.map((child) => child.id),
        lowerElementId,
        upperElementId,
      };
    }
    const childResult = findItemById(items[i].children, wantedId, items[i].id);
    if (childResult) {
      return childResult;
    }
  }
  return;
};
