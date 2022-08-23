import { LineProps } from "./ItemLine";
import { HasIdAndChildren } from "./Mindmapr";
import _ from "lodash";

interface Coords {
  x: number;
  y: number;
}

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

const getCenterCoordsOfItem = (position: Coords, box: DOMRect): Coords => {
  return {
    x: position.x + box.width / 2,
    y: position.y + box.height / 2,
  };
};

const getRelativeCoords = (element: HTMLDivElement): Coords => {
  return {
    y: element.offsetTop,
    x: element.offsetLeft,
  };
};

export const generateChildParentId = (
  parentId: string | number,
  childId: string | number
): string => `${childId}-${parentId}`;

export const calculateLineAndSvgCoords = (
  childRef: HTMLDivElement,
  parentRef: HTMLDivElement
): LineProps => {
  const itemBox = childRef.getBoundingClientRect();
  const itemCoords = getRelativeCoords(childRef);
  const parentBox = parentRef.getBoundingClientRect();
  const parentCoords = getRelativeCoords(parentRef);

  const itemCenter = getCenterCoordsOfItem(itemCoords, itemBox);
  const parentCenter = getCenterCoordsOfItem(parentCoords, parentBox);

  //right /
  if (itemCenter.y < parentCenter.y && itemCenter.x > parentCenter.x) {
    const svgHeight = Math.abs(itemCenter.y - parentCenter.y);
    const svgWidth =
      Math.abs(parentCenter.x - itemCenter.x) - itemBox.width / 2;
    return {
      height: svgHeight,
      width: svgWidth,
      left: parentCoords.x + parentBox.width / 2,
      top: itemCenter.y,
      x1: svgWidth,
      y1: 0,
      x2: 0,
      y2: svgHeight,
    };
  }

  //right \
  if (itemCenter.y > parentCenter.y && itemCenter.x > parentCenter.x) {
    const svgHeight = Math.abs(itemCenter.y - parentCenter.y);
    const svgWidth = Math.abs(parentCenter.x - itemCoords.x);

    return {
      height: svgHeight,
      width: svgWidth,
      left: parentCenter.x,
      top: parentCenter.y,
      x1: svgWidth,
      y1: svgHeight,
      x2: 0,
      y2: 0,
    };
  }

  //left /
  if (itemCenter.y > parentCenter.y && itemCenter.x < parentCenter.x) {
    const svgHeight = Math.abs(itemCenter.y - parentCenter.y);
    const svgWidth = Math.abs(parentCenter.x - (itemCoords.x + itemBox.width));

    return {
      height: svgHeight,
      width: svgWidth,
      left: itemCoords.x + itemBox.width,
      top: parentCenter.y,
      x1: 0,
      y1: svgHeight,
      x2: svgWidth,
      y2: 0,
    };
  }

  //left \
  if (itemCenter.y < parentCenter.y && itemCenter.x < parentCenter.x) {
    const svgHeight = Math.abs(itemCenter.y - parentCenter.y);
    const svgWidth = Math.abs(parentCenter.x - (itemCoords.x + itemBox.width));

    return {
      height: svgHeight,
      width: svgWidth,
      left: itemCoords.x + itemBox.width,
      top: itemCenter.y,
      x1: 0,
      y1: 0,
      x2: svgWidth,
      y2: svgHeight,
    };
  }

  //left _
  if (itemCenter.y === parentCenter.y && itemCenter.x < parentCenter.x) {
    const svgHeight = 5;
    const svgWidth = Math.abs(parentCenter.x - (itemCoords.x + itemBox.width));

    return {
      height: svgHeight,
      width: svgWidth,
      left: itemCoords.x + itemBox.width,
      top: itemCenter.y - svgHeight / 2,
      x1: 0,
      y1: svgHeight / 2,
      x2: svgWidth,
      y2: svgHeight / 2,
    };
  }

  //right _
  if (itemCenter.y === parentCenter.y && itemCenter.x > parentCenter.x) {
    const svgHeight = 5;
    const svgWidth = Math.abs(parentCenter.x - itemCoords.x);
    return {
      height: svgHeight,
      width: svgWidth,
      left: parentCenter.x,
      top: parentCenter.y - svgHeight / 2,
      x1: 0,
      y1: svgHeight / 2,
      x2: svgWidth,
      y2: svgHeight / 2,
    };
  }

  return {
    height: 0,
    left: 0,
    top: 0,
    width: 0,
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  };
};

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

export const findParentElementById = <T extends HasIdAndChildren>(
  items: T,
  id: string | number,
  parent?: T
): T | undefined => {
  if (items.id === id) {
    return parent;
  }
  for (let i = 0; i < items.children.length; i++) {
    const result = findParentElementById(items.children[i], id, items);
    if (result) {
      return result as T;
    }
  }
  return undefined;
};

export const addOnChildLevel = <T extends HasIdAndChildren>(
  parentId: string | number,
  items: T,
  createNewItem: (parent: T) => T | undefined
): { item: T; newItemId?: string | number } => {
  const itemClone = _.cloneDeep(items);
  const entryToUpdate = findMindmapElementById(itemClone, parentId);
  let newItemId = undefined;
  if (entryToUpdate) {
    const newItem = createNewItem(entryToUpdate);
    newItemId = newItem?.id;
    if (newItem) {
      entryToUpdate.children.push(newItem);
    }
  }
  return { item: itemClone, newItemId };
};

export const addOnParentLevel = <T extends HasIdAndChildren>(
  parentId: string | number,
  items: T,
  createNewItem: (parent: T) => T | undefined
): { item: T; newItemId?: string | number } => {
  const itemClone = _.cloneDeep(items);
  const entryToUpdate = findParentElementById(itemClone, parentId);
  let newItemId = undefined;
  if (entryToUpdate) {
    const newItem = createNewItem(entryToUpdate);
    newItemId = newItem?.id;
    if (newItem) {
      entryToUpdate.children.push(newItem);
    }
  }
  return { item: itemClone, newItemId };
};
