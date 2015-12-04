import './index.less';

import React from 'react';
import DragDrop from 'components-drag-drop';
import sift from 'sift';

class PaneComponent extends React.Component {
  render() {
    return <DragDrop draggable={true} droppable={true} accept={sift({ type: 'pane' })} onDrop={}>
      <div className="m-component-pane">

      </div>;
    </DragDrop>;
  }
}

export default PaneComponent;
