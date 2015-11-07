import React from 'react';
import roundPathCorners from './round-path-corners';

var Line = React.createClass({
  getDefaultProps: function() {
    return {
      radius: 10
    };
  },
  render: function() {

    var pdata = [];

    var strokeWidth = this.props.strokeWidth || 2;
    var strokeColor = this.props.strokeColor || 'black';

    this.props.points.forEach((point, i) => {
      pdata.push(i === 0 ? 'M' : 'L', point.x, point.y);
    });

    var endpoints = this.props.showSegments ? [this.props.points[0], this.props.points[this.props.points.length - 1]] : [];

    return <g>
      <path d={roundPathCorners(pdata.join(' '), this.props.radius, false)}  stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
      {
        endpoints.map(function(point, i) {
          return <circle key={i} r={5} cx={point.x} cy={point.y} stroke={strokeColor} fill={strokeColor} />;
        })
      }
    </g>;
  }
});

export default Line;
