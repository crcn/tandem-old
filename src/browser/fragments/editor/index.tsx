import BaseApplication from 'common/application/Base';
import ComponentFragment from 'common/fragments/Component';
import { render } from 'react-dom';
import * as React from 'react';
import TestComponent from './TestComponent';

class EditorComponent extends React.Component<{}, {}> {
  render() {
    return <div>hello world!!</div>;
  }
}

export default ComponentFragment.create(
  'rootComponent',
  EditorComponent
); 
