import './index.less';

import React from 'react';

/**
 * Enables people to drag componens & drop components
 * around the application
 */

class DragDropComponent extends React.Component {

  static propTypes = {
    draggable : React.PropTypes.bool,
    droppable : React.PropTypes.bool,

    // the target item that is getting dragged
    target    : React.PropTypes.item,

    // the function which tests
    accept    : React.PropTypes.func
  }

  startDragging(event) {

    this._start = {
      x: 
    }

    // TODO - calc mouse click offset and store on component here
    // TODO - clone element being dragged

    // stop dragging immediately in case it was never fired from mouseup. This *might*
    // happen if the user moves their cursor outside of the application
    this.stopDragging();

    // always stop drag on mouse up.
    document.body.addEventListener('mouseup', this.stopDragging);
    document.body.addEventListener('mousemove', this.drag);
  }

  drag(event) {

  }

  stopDragging() {
    document.body.removeEventListener('mouseup', this.stopDragging);
    document.body.removeEventListener('mousemove', this.drag);
  }

  render() {
    return <div className='m-drag-drop' onMouseDown={this.startDragging}>
      { this.props.children }
    </div>;
  }
};

export default DragDropComponent;
