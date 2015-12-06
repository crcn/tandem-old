import './index.sass';

import React from 'react';
import DragDrop from 'component-drag-drop';
import RegisteredComponent from 'component-registered';
import sift from 'sift';

class PaneComponent extends React.Component {
  render() {
    return <div className={['m-component-pane', this.props.className].join(' ')}>
      <DragDrop draggable={true} droppable={true} accept={sift({ type: 'pane' })}>
        <RegisteredComponent query={{id: this.props.target.id}} {...this.props} />
      </DragDrop>
    </div>;
  }
}

export default PaneComponent;
