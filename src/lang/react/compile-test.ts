import compile from './compile';
// import { expect } from 'chai';
import * as ReactDOM from 'react-dom';

describe(__filename + '#', () => {

  let div;

  beforeEach(() => {
    div = document.createElement('div');
  });

  it('can translate a simple DIV into a react component', () => {
    const componentClass = compile('<div>hello</div>');
    // console.log(componentClass.toString());
    // ReactDOM.render(componentClass, div);
  });
});
