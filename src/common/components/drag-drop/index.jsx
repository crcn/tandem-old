import './index.scss';

import React from 'react';

/**
 * Enables people to drag componens & drop components
 * around the app
 */

class DragDropComponent extends React.Component {

  static propTypes = {
    draggable : React.PropTypes.bool,
    droppable : React.PropTypes.bool,

    // the target item that is getting dragged
    target    : React.PropTypes.object,

    // the function which tests
    accept    : React.PropTypes.func
  }

  constructor() {
    super();
    this.state = {};

    this.startDragging = this.startDragging.bind(this);
    this.stopDragging  = this.stopDragging.bind(this);
    this.drag          = this.drag.bind(this);
  }

  startDragging(event) {

    if (this.props.onDragStart) this.props.onDragStart();

    // TODO - calc mouse click offset and store on component here
    // TODO - clone element being dragged

    // stop dragging immediately in case it was never fired from mouseup. This *might*
    // happen if the user moves their cursor outside of the app
    this.stopDragging();

    var b  = this.refs.draggable.getBoundingClientRect();
    var cx = b.left + b.right;
    var cy = b.top;

    this.setState({
      drag : true,
      mx   : event.clientX,
      my   : event.clientY,
      x    : cx,
      y    : cy,
      sx   : cx,
      sy   : cy
    });

    // always stop drag on mouse up.
    document.addEventListener('mouseup', this.stopDragging);
    document.addEventListener('mousemove', this.drag);
  }

  drag(event) {
    this.setState({
      x: event.clientX - this.state.mx,
      y: event.clientY - this.state.my
    });

    if (this.props.onDrag) {
      this.props.onDrag(this.state);
    }
  }

  stopDragging() {
    this.setState({ drag: false });
    document.removeEventListener('mouseup', this.stopDragging);
    document.removeEventListener('mousemove', this.drag);
  }

  render() {

    var dragStyle = {};

    if (this.state.drag && this.props.canMove !== false) {
      dragStyle = {
        position : 'fixed',
        top      : this.state.y,
        left     : this.state.x
      };
    }

    return <div ref='dragDrop' className='m-drag-drop'>
      <div ref='draggable' style={dragStyle} onMouseDown={this.startDragging.bind(this)}>
        { this.props.children }
      </div>
    </div>;
  }
};

export default DragDropComponent;
