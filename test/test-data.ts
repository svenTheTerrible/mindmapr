import { HasIdAndChildren } from '../src';

export interface ExampleItem extends HasIdAndChildren {
  name: string;
  children: ExampleItem[];
}

export const testItems: ExampleItem = {
  id: 'center',
  name: 'start',
  children: [
    {
      id: 1,
      name: 'first child',
      children: [
        {
          id: 7,
          name: '1-1',
          children: [],
        },
        {
          id: 8,
          name: '1-2',
          children: [
            {
              id: 9,
              name: '1-2-1',
              children: [],
            },
            {
              id: 10,
              name: '1-2-2',
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'second child',
      children: [
        {
          id: 17,
          name: '2-1',
          children: [],
        },
      ],
    },
    {
      id: 3,
      name: 'third child',
      children: [],
    },
    {
      id: 4,
      name: 'fourth child',
      children: [
        {
          id: 16,
          name: '4-1',
          children: [],
        },
      ],
    },
    {
      id: 5,
      name: 'fifth child',
      children: [],
    },
    {
      id: 6,
      name: 'sixth child',
      children: [
        {
          id: 11,
          name: '6-1',
          children: [],
        },
        {
          id: 12,
          name: '6-2',
          children: [
            {
              id: 14,
              name: '6-2-1',
              children: [],
            },
            {
              id: 15,
              name: '6-2-2',
              children: [],
            },
          ],
        },
        {
          id: 13,
          name: '6-3',
          children: [],
        },
      ],
    },
  ],
};

export const createIdAndChildrenArray = (
  length: number
): HasIdAndChildren[] => {
  const result: HasIdAndChildren[] = [];
  for (let i = 0; i < length; i++) {
    result.push({
      id: i,
      children: [],
    });
  }
  return result;
};

export const createPositionedMockedHtmlDiv = (
  x: number,
  y: number,
  width: number,
  height: number
): HTMLDivElement => {
  const getBoundingClientRect = (): DOMRect => {
    return {
      y,
      x,
      width,
      height,
      bottom: 0,
      left: x,
      right: 0,
      top: y,
    } as DOMRect;
  };
  return {
    getBoundingClientRect,
    offsetTop: y,
    offsetLeft: x,
  } as HTMLDivElement;
};
