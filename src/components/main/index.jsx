import React from 'react';
import Line from '../line';
import Stage from '../stage';
import Obj from '../project/object';

var MainComponent = React.createClass({
  componentDidMount: function() {

    this.props.bus.execute({ action: 'tail' }).pipeTo({
      write: () => {
        this.forceUpdate();
      },
      abort: function() { },
      close: function() { }
    });

  },
  render: function() {

    var points = [];

    var currentTarget = this.props.currentTarget;

    var allTargets = {};

    currentTarget.children.forEach(function(child) {
      allTargets[child._id] = child;
    });

    currentTarget.children.forEach(function(child) {
      child.outputs.forEach(function(output) {
        var target = allTargets[output.target._id];
        points.push({ x: child.x, y: child.y + child.height / 2}, target);
      });
    });

    return <Stage>

      <Line points={points} />

      {
        (currentTarget.children || []).map((child, i) => {
          return <Obj target={child} key={i} />
        })
      }

    </Stage>;
  }
});

export default MainComponent;
