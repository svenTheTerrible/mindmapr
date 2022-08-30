import React, { CSSProperties, ReactNode, useCallback, useRef, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import ItemLines, { ParentChildConnection } from "./ItemLines";
import MindmaprItems from "./MindmaprItems";
import styled from 'styled-components';
import { findMindmapElementById } from "./util";

export interface HasIdAndChildren {
  id: string | number;
  children: HasIdAndChildren[];
}

export interface RenderItemState {
  isSelected: boolean;
}

interface MindmaprProps<T extends HasIdAndChildren> {
  items: T;
  addChildKey?: string;
  side?: "both" | "left" | "right";
  addChildOnParentLevelKey?: string;
  deleteItemKey?: string;
  overwriteOnSelectedItemKeydown?: (
    selectedItem: string | number,
    e: KeyboardEvent
  ) => void;
  overwriteLineStyle?: (depth: number) => CSSProperties;
  setData?: (items: T) => void;
  createNewItem?: (parent: T) => T | undefined;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
}

export {
  findMindmapElementById
}

export const Mindmapr = <T extends HasIdAndChildren>({
  items,
  setData,
  createNewItem,
  renderItem,
  overwriteOnSelectedItemKeydown,
  addChildKey = "Tab",
  deleteItemKey = "Delete",
  side = "both",
  addChildOnParentLevelKey = "Enter",
  overwriteLineStyle,
}: MindmaprProps<T>) => {
  const [parentChildConnections, setParentChildConnections] = useState<
    ParentChildConnection[]
  >([]);
  const parentChildConnectionsRef = useRef<ParentChildConnection[]>([]);

  const [selectedItem, setSelectedItem] = useState<number | string | undefined>(
    undefined
  );

  const clearSelectedItem = () => {
    setSelectedItem(undefined);
  };

  const addParentChildConnection = useCallback(
    (connection: ParentChildConnection) => {
      setParentChildConnections((current) => {
        const newValue = [...current, connection];
        parentChildConnectionsRef.current = newValue;
        return newValue;
      });
    },
    [setParentChildConnections]
  );

  const removeParentChildConnection = useCallback(
    (childId: string | number) => {
      setParentChildConnections((current) => {
        const newValue = current.filter((connection) => {
          return (
            connection.childId !== childId
          );
        })
        parentChildConnectionsRef.current = newValue;
        return newValue;
      });
    },
    [setParentChildConnections]
  );

  return (
    <ClickAwayListener onClickAway={clearSelectedItem}>
      <ScrollContainer onClick={clearSelectedItem}>
        <InnerContainer>
          <MindmaprItems
            parentChildConnectionsRef={parentChildConnectionsRef}
            side={side}
            overwriteOnSelectedItemKeydown={overwriteOnSelectedItemKeydown}
            addChildKey={addChildKey}
            deleteItemKey={deleteItemKey}
            addChildOnParentLevelKey={addChildOnParentLevelKey}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            items={items}
            setData={setData as any}
            createNewItem={createNewItem as any}
            renderItem={renderItem as any}
            addParentChildConnection={addParentChildConnection}
            removeParentChildConnection={removeParentChildConnection}
          />
          <ItemLines
            parentChildConnections={parentChildConnections}
            overwriteLineStyle={overwriteLineStyle}
          />
        </InnerContainer>
      </ScrollContainer>
    </ClickAwayListener>
  );
};


const ScrollContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
`