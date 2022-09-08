import React, { ReactNode, useEffect, useState } from 'react';
import { ItemGroup } from './ItemGroup';
import { ParentChildConnection } from './ItemLines';
import styled from 'styled-components';
import { SidedTable } from './SidedTable';
import { HasIdAndChildren, RenderItemState } from '.';

interface ItemProps<T extends HasIdAndChildren> {
  item: T;
  renderItem: (data: T, depth: number, state: RenderItemState) => ReactNode;
  side: 'left' | 'right';
  parentRef: HTMLDivElement | null;
  parentId: string | number;
  addParentChildConnection: (connection: ParentChildConnection) => void;
  removeParentChildConnection: (childId: string | number) => void;
  depth: number;
  selectedItem: string | number | undefined;
  setSelectedItem: (value: string | number | undefined) => void;
}

export const Item = <T extends HasIdAndChildren>({
  item,
  renderItem,
  side,
  parentRef,
  depth,
  selectedItem,
  setSelectedItem,
  parentId,
  addParentChildConnection,
  removeParentChildConnection,
}: ItemProps<T>) => {
  const [newParentRef, setNewParentRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      removeParentChildConnection(item.id);
    };
  }, []); //eslint-disable-line

  useEffect(() => {
    if (parentRef && newParentRef) {
      addParentChildConnection({
        childHtmlItem: newParentRef,
        parentHtmlItem: parentRef,
        childId: item.id,
        depth: depth,
        parentId,
      });
    }
  }, [
    parentRef,
    newParentRef,
    parentId,
    item.id,
    addParentChildConnection,
    depth,
  ]);

  useEffect(() => {
    if (selectedItem === item.id) {
      newParentRef?.focus();
    }
  }, [selectedItem, newParentRef, item]);

  const setRef = (ref: HTMLDivElement): void => {
    setNewParentRef(ref);
  };

  const selectItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item.id);
  };

  return (
    <SidedTable side={side}>
      <tbody>
        <tr>
          <td>
            {side === 'left' ? (
              <ItemGroup
                removeParentChildConnection={removeParentChildConnection}
                parentRef={newParentRef}
                parentId={item.id}
                addParentChildConnection={addParentChildConnection}
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
                depth={depth + 1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            ) : (
              <ItemWrapperBackground tabIndex={-1} ref={setRef}>
                <ItemWrapper onClick={selectItem}>
                  {renderItem(item, depth, {
                    isSelected: item.id === selectedItem,
                  })}
                </ItemWrapper>
              </ItemWrapperBackground>
            )}
          </td>
          <td>
            {side === 'left' ? (
              <ItemWrapperBackground tabIndex={-1} ref={setRef}>
                <ItemWrapper onClick={selectItem}>
                  {renderItem(item, depth, {
                    isSelected: item.id === selectedItem,
                  })}
                </ItemWrapper>
              </ItemWrapperBackground>
            ) : (
              <ItemGroup
                removeParentChildConnection={removeParentChildConnection}
                parentRef={newParentRef}
                parentId={item.id}
                addParentChildConnection={addParentChildConnection}
                items={item.children as T[]}
                renderItem={renderItem}
                side={side}
                depth={depth + 1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )}
          </td>
        </tr>
      </tbody>
    </SidedTable>
  );
};

const ItemWrapperBackground = styled.div`
  position: relative;
  &:focus {
    outline: none;
  }
  z-index: 1;
`;

const ItemWrapper = styled.div`
  position: relative;
  z-index: 2;
`;
