import './index.less';

import React from 'react';
import DragDrop from 'component-drag-drop';
import sift from 'sift';

class PaneComponent extends React.Component {
  render() {
    return <div className={['m-component-pane', this.props.className].join(' ')}>
      <DragDrop draggable={true} droppable={true} accept={sift({ type: 'pane' })}>
        pane pane
      </DragDrop>
    </div>;
  }
}

export default PaneComponent;
