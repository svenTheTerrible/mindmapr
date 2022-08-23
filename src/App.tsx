import { FC, ReactNode, useState } from "react";
import "./App.css";
import { MindmapItem } from "./MindmapItem";
import { Mindmapr, RenderItemState } from "./mindmapr/Mindmapr";
import uniqid from "uniqid";
import { findMindmapElementById } from "./mindmapr/util";

export interface MindmapData {
  id: string | number;
  name: string;
  children: MindmapData[];
}

export const App: FC = () => {
  const [data, setData] = useState<MindmapData>({
    id: "center",
    name: "start",
    children: [
      {
        id: 1,
        name: "first child",
        children: [
          {
            id: 7,
            name: "1-1",
            children: [],
          },
          {
            id: 8,
            name: "1-2",
            children: [
              {
                id: 9,
                name: "1-2-1",
                children: [],
              },
              {
                id: 10,
                name: "1-2-2",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "second child",
        children: [
          {
            id: 17,
            name: "2-1",
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: "third child",
        children: [],
      },
      {
        id: 4,
        name: "fourth child",
        children: [
          {
            id: 16,
            name: "4-1",
            children: [],
          },
        ],
      },
      {
        id: 5,
        name: "fifth child",
        children: [],
      },
      {
        id: 6,
        name: "sixth child",
        children: [
          {
            id: 11,
            name: "6-1",
            children: [],
          },
          {
            id: 12,
            name: "6-2",
            children: [
              {
                id: 14,
                name: "6-2-1",
                children: [],
              },
              {
                id: 15,
                name: "6-2-2",
                children: [],
              },
            ],
          },
          {
            id: 13,
            name: "6-3",
            children: [],
          },
        ],
      },
    ],
  });

  const changeItemText = (id: string | number, name: string): void => {
    setData((current) => {
      const entryToUpdate = findMindmapElementById(current, id);
      if (entryToUpdate) {
        entryToUpdate.name = name;
      }
      return current;
    });
  };

  const renderItem = (
    item: MindmapData,
    depth: number,
    state: RenderItemState
  ): ReactNode => {
    return (
      <MindmapItem
        data={item}
        depth={depth}
        state={state}
        changeItemText={changeItemText}
      />
    );
  };

  const createNewItem = (parent: MindmapData): MindmapData | undefined => {
    return {
      id: uniqid(),
      children: [],
      name: "new child",
    };
  };

  return (
    <div className="centering">
      <div className="mindmapContainer">
        <Mindmapr
          items={data}
          setData={setData}
          createNewItem={createNewItem}
          renderItem={renderItem}
        />
      </div>
    </div>
  );
};

//todo
// when navigating via arrow key -> <-, select the nearest item first (mostly the middle item)
// check scrolling and centering, when mindmap area is smaller than the mindmap
// check performance on large mindmaps
// allow mindmap to only add items on one side as a tree via prop
// make connection line thickness and color definable as a prop
// check how to make unique classnames for libraries
// convert project via react-create-lib
// figure out plublishing on npm
// write tests on util functions
