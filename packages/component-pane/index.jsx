import './index.less';

import React from 'react';
import DragDrop from 'component-drag-drop';
import sift from 'sift';

class PaneComponent extends React.Component {
  render() {

    var componentEntry = this.props.app.registry.find(sift({
      id: this.props.target.id
    }));


    return <div className={['m-component-pane', this.props.className].join(' ')}>
      <DragDrop draggable={true} droppable={true} accept={sift({ type: 'pane' })}>
        { componentEntry.factory.create(...this.props) }
      </DragDrop>
    </div>;
  }
}

export default PaneComponent;
