import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HasIdAndChildren, Mindmapr } from '../src';

interface TestItem extends  HasIdAndChildren{
  name: string;
}

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');

    const item: TestItem = {
      id: "0",
      children: [],
      name: "test"
    } 
    const renderItem = (item: TestItem): React.ReactNode=> {
      return <div>{item.name}</div>
    }
    ReactDOM.render(<Mindmapr items={item} renderItem={renderItem}  />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
