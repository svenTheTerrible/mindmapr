import { ParentChildConnection } from '../src/ItemLines';
import {
  addOnChildLevel,
  addOnParentLevel,
  calculateLineAndSvgCoords,
  findItemById,
  findMindmapElementById,
  findNearestChildItem,
  findParentElementById,
  removeItemById,
  splitItemsToLeftAndRight,
} from '../src/util';
import {
  createIdAndChildrenArray,
  createPositionedMockedHtmlDiv,
  ExampleItem,
  testItems,
} from './test-data';

describe('splitItemsToLeftAndRight', () => {
  it('divides even items evenly', () => {
    const testData = createIdAndChildrenArray(6);
    const { leftItems, rightItems } = splitItemsToLeftAndRight(testData);
    expect(leftItems.length).toBe(rightItems.length);
  });
  it('divides uneven items unevenly', () => {
    const testData = createIdAndChildrenArray(7);
    const { leftItems, rightItems } = splitItemsToLeftAndRight(testData);
    expect(leftItems.length + 1).toBe(rightItems.length);
  });
});

describe('findItemById', () => {
  it('finds item that exists with no lower item', () => {
    const result = findItemById(testItems.children, 10, 'center');
    expect(result?.parentId).toBe(8);
    expect(result?.childIds).toHaveLength(0);
    expect(result?.lowerElementId).toBeUndefined();
    expect(result?.upperElementId).toBe(9);
  });
  it('finds item that exists with no upper item', () => {
    const result = findItemById(testItems.children, 9, 'center');
    expect(result?.parentId).toBe(8);
    expect(result?.childIds).toHaveLength(0);
    expect(result?.lowerElementId).toBe(10);
    expect(result?.upperElementId).toBeUndefined();
  });
  it('finds item that exists with lower and upper item', () => {
    const result = findItemById(testItems.children, 2, 'center');
    expect(result?.parentId).toBe('center');
    expect(result?.childIds).toHaveLength(1);
    expect(result?.lowerElementId).toBe(3);
    expect(result?.upperElementId).toBe(1);
  });
  it('finds nothing, if the element is not included', () => {
    const result = findItemById(testItems.children, 18, 'center');
    expect(result).toBeUndefined();
  });
});

describe('findMindmapElementById', () => {
  it('finds first element', () => {
    const result = findMindmapElementById(testItems, 'center');
    expect(result?.id).toBe('center');
  });
  it('finds nested element', () => {
    const result = findMindmapElementById(testItems, 15);
    expect(result?.id).toBe(15);
  });
  it('finds nothing, if element does not exist', () => {
    const result = findMindmapElementById(testItems, 18);
    expect(result).toBeUndefined();
  });
});

describe('findParentElementById', () => {
  it('finds parent of element', () => {
    const result = findParentElementById(testItems, 1);
    expect(result?.id).toBe('center');
  });
  it('finds no parent, if the looked for element is the first one', () => {
    const result = findParentElementById(testItems, 'center');
    expect(result).toBeUndefined();
  });
});

describe('addOnChildLevel', () => {
  const createNewItem = (): ExampleItem => {
    return {
      id: 'new',
      name: 'newItem',
      children: [],
    };
  };

  it('adds on child level', () => {
    const result = addOnChildLevel(5, testItems, createNewItem);
    expect(result.item.children[4].children[0].id).toBe('new');
    expect(result.newItemId).toBe('new');
  });
  it('adds no child, if createNewItem is not given', () => {
    const result = addOnChildLevel(5, testItems);
    expect(result.item.children[4].children).toHaveLength(0);
    expect(result.newItemId).toBeUndefined();
  });
});

describe('addOnParentLevel', () => {
  const createNewItem = (): ExampleItem => {
    return {
      id: 'new',
      name: 'newItem',
      children: [],
    };
  };
  it('adds elements on parent level', () => {
    const { item, newItemId } = addOnParentLevel(1, testItems, createNewItem);
    expect(newItemId).toBe('new');
    expect(item.children).toHaveLength(testItems.children.length + 1);
  });
  it('adds no element, if createNewItem is missing', () => {
    const { item, newItemId } = addOnParentLevel(1, testItems);
    expect(newItemId).toBeUndefined();
    expect(item.children).toHaveLength(testItems.children.length);
  });
  it('adds no element on root level', () => {
    const { item, newItemId } = addOnParentLevel('center', testItems);
    expect(newItemId).toBeUndefined();
    expect(item.children).toHaveLength(testItems.children.length);
  });
});

describe('removeItemById', () => {
  it('actually removes items', () => {
    const result = removeItemById(testItems, 1);
    expect(result.children).toHaveLength(5);
  });
  it('actually removes nothing, if item is not included', () => {
    const result = removeItemById(testItems, 20);
    expect(result).toMatchObject(testItems);
  });
  it('does not remove root item', () => {
    const result = removeItemById(testItems, 'center');
    expect(result).toMatchObject(testItems);
  });
});

describe('findNearestChildItem', () => {
  const parentElement = createPositionedMockedHtmlDiv(0, 0, 50, 50);
  const parentChildConnection: ParentChildConnection[] = [
    {
      parentHtmlItem: parentElement,
      parentId: 'parent',
      childId: 'child1',
      depth: 1,
      childHtmlItem: createPositionedMockedHtmlDiv(100, 100, 50, 50),
    },
    {
      parentHtmlItem: parentElement,
      parentId: 'parent',
      childId: 'child2',
      depth: 1,
      childHtmlItem: createPositionedMockedHtmlDiv(150, 150, 50, 50),
    },
    {
      parentHtmlItem: parentElement,
      parentId: 'parent',
      childId: 'child3',
      depth: 1,
      childHtmlItem: createPositionedMockedHtmlDiv(50, 50, 50, 50),
    },
  ];

  it('finds the nearest child item', () => {
    const result = findNearestChildItem(
      'parent',
      ['child1', 'child2', 'child3'],
      parentChildConnection
    );
    expect(result).toBe('child3');
  });
  it('finds no child items, if there aren`t any', () => {
    const result = findNearestChildItem('parent', [], parentChildConnection);
    expect(result).toBeUndefined();
  });
});

describe('calculateLineAndSvgCoords', () => {
  const parentElement = createPositionedMockedHtmlDiv(0, 0, 50, 50);
  it('works right desc', () => {
    const childElement = createPositionedMockedHtmlDiv(100, 100, 50, 50);
    const result = calculateLineAndSvgCoords(childElement, parentElement);
    expect(result).toMatchObject({
      height: 100,
      width: 75,
      left: 25,
      top: 25,
      x1: 75,
      y1: 100,
      x2: 0,
      y2: 0,
    });
  });
  it('works right asc', () => {
    const childElement = createPositionedMockedHtmlDiv(100, -100, 50, 50);
    const result = calculateLineAndSvgCoords(childElement, parentElement);
    expect(result).toMatchObject({
      height: 100,
      width: 75,
      left: 25,
      top: -75,
      x1: 75,
      y1: 0,
      x2: 0,
      y2: 100,
    });
  });
  it('works left desc', () => {
    const childElement = createPositionedMockedHtmlDiv(-100, 100, 50, 50);
    const result = calculateLineAndSvgCoords(childElement, parentElement);
    expect(result).toMatchObject({
      height: 100,
      width: 75,
      left: -50,
      top: 25,
      x1: 0,
      y1: 100,
      x2: 75,
      y2: 0,
    });
  });
  it('works left asc', () => {
    const childElement = createPositionedMockedHtmlDiv(-100, -100, 50, 50);
    const result = calculateLineAndSvgCoords(childElement, parentElement);
    expect(result).toMatchObject({
      height: 100,
      width: 75,
      left: -50,
      top: -75,
      x1: 0,
      y1: 0,
      x2: 75,
      y2: 100,
    });
  });
  it('works right horizontal connection', () => {
    const childElement = createPositionedMockedHtmlDiv(100, 0, 50, 50);
    const result = calculateLineAndSvgCoords(childElement, parentElement);
    expect(result).toMatchObject({
      height: 5,
      width: 75,
      left: 25,
      top: 22.5,
      x1: 0,
      y1: 2.5,
      x2: 75,
      y2: 2.5,
    });
  });
  it('works left horizontal connection', () => {
    const childElement = createPositionedMockedHtmlDiv(-100, 0, 50, 50);
    const result = calculateLineAndSvgCoords(childElement, parentElement);
    expect(result).toMatchObject({
      height: 5,
      width: 75,
      left: -50,
      top: 22.5,
      x1: 0,
      y1: 2.5,
      x2: 75,
      y2: 2.5,
    });
  });
});
