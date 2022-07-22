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
