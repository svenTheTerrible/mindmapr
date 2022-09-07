import React from 'react';
import {render} from '@testing-library/react';
import { HasIdAndChildren, Mindmapr } from '../src';

interface TestItem extends  HasIdAndChildren{
  name: string;
}

describe('it', () => {
  it('renders without crashing', () => {
    const item: TestItem = {
      id: "0",
      children: [],
      name: "test"
    } 
    const renderItem = (item: TestItem): React.ReactNode=> {
      return <div>{item.name}</div>
    }
    render(<Mindmapr items={item} renderItem={renderItem}  />);
  });
});
