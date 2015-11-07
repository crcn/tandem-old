import React from 'react';
import Draggable from '../draggable';

var Obj = React.createClass({
  onClick: function() {
    console.log('cli');
  },
  render: function() {

    var x = this.props.target.x;
    var y = this.props.target.y;
    var w = this.props.target.width;
    var h = this.props.target.height;

    return <Draggable target={this.props.target}>
      <rect width={w} height={h} fill='black' x={x} y={y} />
    </Draggable>;
  }
});

export default Obj;
