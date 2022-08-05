import { HasIdAndChildren } from "./mindmapr/Mindmapr";

export const findMindmapElementById = <T extends HasIdAndChildren>(
  items: T,
  id: string | number
): T | undefined => {
  if (items.id === id) {
    return items;
  }
  for (let i = 0; i < items.children.length; i++) {
    const result = findMindmapElementById(items.children[i], id);
    if (result) {
      return result as T;
    }
  }
  return undefined;
};
