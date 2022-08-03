import { FC, ReactNode, useState } from "react";
import "./App.css";
import { Mindmapr, RenderItemState } from "./mindmapr/Mindmapr";

interface MindmapData {
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

  const handleChange = (changedData: MindmapData) => {
    setData(changedData);
  };

  const joinClassNames = (names: Array<string | undefined>): string => {
    return names.filter((name) => name !== undefined).join(" ");
  };

  const renderItem = (
    item: MindmapData,
    depth: number,
    state: RenderItemState
  ): ReactNode => {
    if (depth === 0) {
      return (
        <div
          className={joinClassNames([
            "centerMindmaprItem",
            state.isSelected ? "selected" : undefined,
          ])}
        >
          {item.name}
        </div>
      );
    }

    if (depth === 1) {
      return (
        <div
          className={joinClassNames([
            "firstLevelMindmaprItem",
            state.isSelected ? "selected" : undefined,
          ])}
        >
          {item.name}
        </div>
      );
    }

    if (depth === 2) {
      return (
        <div
          className={joinClassNames([
            "secondLevelMindmaprItem",
            state.isSelected ? "selected" : undefined,
          ])}
        >
          {item.name}
        </div>
      );
    }

    return (
      <div
        className={joinClassNames([
          "thirdLevelMindmaprItem",
          state.isSelected ? "selected" : undefined,
        ])}
      >
        {item.name}
      </div>
    );
  };

  return (
    <div className="centering">
      <div className="mindmapContainer">
        <Mindmapr
          items={data}
          itemsSelectable={true}
          allowSelectionChangeTroughKeyboard={true}
          onChange={handleChange}
          renderItem={renderItem}
        />
      </div>
    </div>
  );
};
