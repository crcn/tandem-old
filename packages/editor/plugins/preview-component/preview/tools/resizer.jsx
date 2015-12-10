import './resizer.scss';
import React from 'react';

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 4;

class ResizerComponent extends React.Component {
  render() {

    var focus = this.props.focus;
    var style = focus.attributes.style;

    var points = [
      [0, 0],
      [style.left, 0],
      [style.left, style.top],
      [0, style.top]
    ];

    var x1 = 0;
    var x2 = 0;
    var y1 = 0;
    var y2 = 0;
    var d = '';

    points.forEach(function(point, i) {
      x1 = Math.min(point[0], x1);
      x2 = Math.max(point[0], x2);
      y1 = Math.min(point[1], y1);
      y2 = Math.max(point[1], y2);
      d += (i === 0 ? 'M' : 'L') + point.join(' ');
    });

    d += 'Z';

    var cr = POINT_RADIUS;
    var cw = (cr + POINT_STROKE_WIDTH * 2) * 2;
    var w = x2 - x1 + cw;
    var h = y2 - y1 + cw;

    var style = {
      position: 'absolute',
      left: 100,
      top: 100
    }

    return <div className='m-resizer-component' style={style}>

      <svg width={w} height={h} viewBox={[-cw / 2, -cw / 2, w, h]}>
        <path d={d} stroke='black' fill='transparent' />
        {
          points.map(function(path, key) {
            return <circle className={'point-circle-' + key} stroke='black' fill='transparent' r={cr} cx={path[0]} cy={path[1]} key={key} />;
          })
        }
      </svg>

    </div>;
  }
}

export default ResizerComponent;
