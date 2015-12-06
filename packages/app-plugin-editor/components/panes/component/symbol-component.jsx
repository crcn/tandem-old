import './symbol-component.sass';
import React from 'react';
import DragDropComponent from 'component-drag-drop';

class SymbolComponent extends React.Component {
  render() {
    return <li className='m-symbol-component-pane-item'>
      <DragDropComponent>
        { this.props.entry.label }
      </DragDropComponent>
    </li>
  }
}

export default SymbolComponent;
