import { FC, ReactNode, useState } from "react";
import "./App.css";
import { Mindmapr } from "./mindmapr/Mindmapr";

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
        children: [],
      },
      {
        id: 3,
        name: "third child",
        children: [],
      },
      {
        id: 4,
        name: "fourth child",
        children: [],
      },
      {
        id: 5,
        name: "fifth child",
        children: [],
      },
      {
        id: 6,
        name: "sixth child",
        children: [],
      },
    ],
  });

  const handleChange = (changedData: MindmapData) => {
    setData(changedData);
  };

  const renderItem = (item: MindmapData): ReactNode => {
    return <div className="mindmaprItem">{item.name}</div>;
  };

  return (
    <div className="centering">
      <div className="mindmapContainer">
        <Mindmapr
          items={data}
          onChange={handleChange}
          renderItem={renderItem}
        />
      </div>
    </div>
  );
};
