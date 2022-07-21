import { FC, useState } from "react";
import "./App.css";
import { Mindmapr } from "./mindmapr/Mindmapr";

interface MindmapData {
  id: String | number;
  name: String;
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
        children: [],
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

  return (
    <div className="centering">
      <div className="mindmapContainer">
        <Mindmapr items={data} onChange={handleChange} />
      </div>
    </div>
  );
};
