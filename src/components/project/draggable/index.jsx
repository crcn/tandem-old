import React from 'react';

var Draggable = React.createClass({
  onMouseDown: function(event) {
    this.sx = this.props.target.x;
    this.sy = this.props.target.y;
    this.mx = event.clientX;
    this.my = event.clientY;
    document.addEventListener('mousemove', this.drag);
    document.addEventListener('mouseup', this.onMouseUp);
  },
  drag: function(event) {
    this.props.target.setProperties({
      x: this.sx + (event.clientX - this.mx),
      y: this.sy + (event.clientY - this.my)
    });
  },
  onMouseUp: function() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.drag);
  },
  render: function() {
    return <g onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
      { this.props.children }
    </g>;
  }
});

export default Draggable;
