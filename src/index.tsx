import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import ItemLines, { ParentChildConnection } from './ItemLines';
import MindmaprItems from './MindmaprItems';
import styled from 'styled-components';
import { findMindmapElementById } from './util';
import Autosizer from 'react-virtualized-auto-sizer';

export interface HasIdAndChildren {
  id: string | number;
  children: HasIdAndChildren[];
}

export interface RenderItemState {
  isSelected: boolean;
}

export interface MindmaprProps<T extends HasIdAndChildren> {
  items: T;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
  addChildKey?: string;
  side?: 'both' | 'left' | 'right';
  addChildOnParentLevelKey?: string;
  deleteItemKey?: string;
  overwriteLineStyle?: (depth: number) => CSSProperties;
  setData?: (items: T) => void;
  createNewItem?: (parent: T) => T | undefined;
}

export { findMindmapElementById };

export const Mindmapr = <T extends HasIdAndChildren>({
  items,
  setData,
  createNewItem,
  renderItem,
  addChildKey = 'Tab',
  deleteItemKey = 'Delete',
  side = 'both',
  addChildOnParentLevelKey = 'Enter',
  overwriteLineStyle,
}: MindmaprProps<T>) => {
  const [parentChildConnections, setParentChildConnections] = useState<
    ParentChildConnection[]
  >([]);
  const parentChildConnectionsRef = useRef<ParentChildConnection[]>([]);
  const [outsideLineUpdater, setOutsideLineUpdater] = useState<number>(0);

  useEffect(() => {
    setOutsideLineUpdater(current => current + 1);
  }, [items, setOutsideLineUpdater, side]);

  const [selectedItem, setSelectedItem] = useState<number | string | undefined>(
    undefined
  );

  const clearSelectedItem = () => {
    setSelectedItem(undefined);
  };

  const addParentChildConnection = useCallback(
    (connection: ParentChildConnection) => {
      setParentChildConnections(current => {
        const newValue = [...current, connection];
        parentChildConnectionsRef.current = newValue;
        return newValue;
      });
    },
    [setParentChildConnections]
  );

  const removeParentChildConnection = useCallback(
    (childId: string | number) => {
      setParentChildConnections(current => {
        const newValue = current.filter(connection => {
          return connection.childId !== childId;
        });
        parentChildConnectionsRef.current = newValue;
        return newValue;
      });
    },
    [setParentChildConnections]
  );

  return (
    <ClickAwayListener onClickAway={clearSelectedItem}>
      <Autosizer>
        {({ width, height }) => (
          <ScrollContainer
            onClick={clearSelectedItem}
            style={{ width, height }}
          >
            <InnerContainer>
              <MindmaprItems
                parentChildConnectionsRef={parentChildConnectionsRef}
                side={side}
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
                outsideLineUpdateCounter={outsideLineUpdater}
                width={width}
                height={height}
              />
            </InnerContainer>
          </ScrollContainer>
        )}
      </Autosizer>
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
  justify-content: center;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
`;
