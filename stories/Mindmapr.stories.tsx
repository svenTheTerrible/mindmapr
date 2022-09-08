import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Mindmapr,
  MindmaprProps,
  HasIdAndChildren,
  RenderItemState,
} from '../src';
import { MindmapItem } from '../example/src/MindmapItem';
import uniqid from 'uniqid';

interface ExampleItem extends HasIdAndChildren {
  name: string;
  children: ExampleItem[];
}

const meta: Meta = {
  title: 'Mindmapr Usage',
  component: Mindmapr,
};

export default meta;

const Template = <T extends HasIdAndChildren>(args: MindmaprProps<T>) => {
  const [state, setState] = React.useState<T | undefined>();
  const inputStateRef = React.useRef<T>();
  React.useEffect(() => {
    if (args.items !== inputStateRef.current) {
      inputStateRef.current = args.items;
      setState(args.items);
    }
  }, [args.items, setState]);
  const newArgs = args.setData ? { ...args, setData: setState } : args;
  if (!state) {
    return <div></div>;
  }
  return <Mindmapr {...newArgs} items={state} />;
};

const items: ExampleItem = {
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

const renderItem = (item: ExampleItem) => {
  return <div style={{ backgroundColor: 'white' }}>{item.name}</div>;
};

export const ReadonlyDefault = Template.bind({});
ReadonlyDefault.args = {
  renderItem,
  items,
};

const renderItemNice = (
  item: ExampleItem,
  depth: number,
  state: RenderItemState
): React.ReactNode => {
  return <MindmapItem data={item} depth={depth} state={state} />;
};

export const ReadonlyWithStyledItems = Template.bind({});
ReadonlyWithStyledItems.args = {
  renderItem: renderItemNice,
  items,
};

export const AddAndDeleteWithStyledItems = Template.bind({});
AddAndDeleteWithStyledItems.args = {
  renderItem: renderItemNice,
  items,
  setData: () => {},
  createNewItem: () => ({
    id: uniqid(),
    children: [],
    name: 'new child',
  }),
};

//todo lines don't get rerendered properly in storybook, when side changes back to "both"
