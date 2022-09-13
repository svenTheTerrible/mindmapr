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
import { ExampleItem, testItems } from '../test/test-data';

const meta: Meta = {
  title: 'Mindmapr Usage',
  component: Mindmapr,
};

export default meta;

interface DokuProps {
  '#notPartOfLibrary_tell_to_color_background': boolean;
  '#notPartOfLibrary_showSelectionDoku': boolean;
  '#notPartOfLibrary_showEnterTabDoku': boolean;
}

const Template = <T extends HasIdAndChildren>(
  args: MindmaprProps<T> & DokuProps
) => {
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
  return (
    <>
      <div style={{ width: 600, height: 300, margin: 'auto' }}>
        <Mindmapr {...newArgs} items={state} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 200,
          borderLeft: '1px solid #ddd',
          borderBottom: '1px solid #ddd',
          borderRadius: 4,
        }}
      >
        <ul>
          {!args['#notPartOfLibrary_tell_to_color_background'] ? null : (
            <li>
              The lines extend from the center of the parent to the beginning of
              the child element. You need to add a background-color to your
              rendered elements to cover the lines
            </li>
          )}
          {!args['#notPartOfLibrary_showSelectionDoku']
            ? null
            : [
                <li key="1">You can select an item by clicking</li>,
                <li key="2">You can move selection with the arrow keys</li>,
              ]}

          {!args['#notPartOfLibrary_showEnterTabDoku']
            ? null
            : [
                <li key="3">"ENTER" adds a new element on same depth level</li>,
                <li key="4">
                  "TAB" adds a new element one depth level deeper on child level
                </li>,
              ]}
        </ul>
      </div>
    </>
  );
};

const renderItem = (item: ExampleItem) => {
  return <div style={{ backgroundColor: 'white' }}>{item.name}</div>;
};

export const ReadonlyDefault = Template.bind({});
ReadonlyDefault.args = {
  renderItem,
  items: testItems,
  '#notPartOfLibrary_tell_to_color_background': true,
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
  items: testItems,
  '#notPartOfLibrary_showSelectionDoku': true,
};

export const AddAndDeleteWithStyledItems = Template.bind({});
AddAndDeleteWithStyledItems.args = {
  renderItem: renderItemNice,
  items: testItems,
  setData: () => {},
  createNewItem: () => ({
    id: uniqid(),
    children: [],
    name: 'new child',
  }),
  '#notPartOfLibrary_showSelectionDoku': true,
  '#notPartOfLibrary_showEnterTabDoku': true,
};

//todo lines don't get rerendered properly in storybook, when side changes back to "both"
