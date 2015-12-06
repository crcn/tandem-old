import './index.sass';
import React from 'react';
import DragDropComponent from 'component-drag-drop';

class SideDragger extends React.Component {
  onDragStart() {
    this.startWidth = this.props.reference.getValue();
  }
  onDrag(data) {
    this.props.reference.setValue(this.startWidth + (this.props.position === 'right' ? data.x : -data.x));
  }
  render() {
    return <DragDropComponent canMove={false} onDragStart={this.onDragStart.bind(this)} onDrag={this.onDrag.bind(this)}>
      <div className={['m-side-dragger', this.props.position].join(' ')}>

      </div>
    </DragDropComponent>;
  }
}

export default SideDragger;
