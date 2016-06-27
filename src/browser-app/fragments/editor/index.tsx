import Stage from './stage';
import BaseApplication from 'common/application/Base';
import ComponentFragment from 'common/fragments/Component';
import { render } from 'react-dom';
import * as React from 'react';
import TestComponent from './TestComponent';

class Editor extends React.Component<{}, {}> {
  render() {
    return <div id='m-editor'>  
      <Stage />
    </div>;
  }
}
 
export default ComponentFragment.create(
  'rootComponent',
  Editor
); 
