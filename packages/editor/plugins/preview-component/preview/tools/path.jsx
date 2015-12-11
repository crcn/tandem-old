import React from 'react';
import startDrag from 'common/utils/component/start-drag';

class PathComponent extends React.Component {

  onPointDown(point, index, event) {

    event.stopPropagation();

    var sx = point.left;
    var sy = point.top;

    startDrag(event, (info) => {
      point.setProperties({
        left : sx + info.leftDelta,
        top  : sy + info.topDelta
      });
    });
  }

  render() {

    var points = this.props.points;

    var x1 = 0;
    var x2 = 0;
    var y1 = 0;
    var y2 = 0;
    var d = '';

    // calculate the size of the box
    points.forEach(function(point, i) {
      x1 = Math.min(point.left, x1);
      x2 = Math.max(point.left, x2);
      y1 = Math.min(point.top, y1);
      y2 = Math.max(point.top, y2);
      d += (i === 0 ? 'M' : 'L') + point.left + ' ' + point.top;
    });

    d += 'Z';

    var cr = this.props.pointRadius;
    var cw = (cr + (this.props.strokeWidth || 1) * 2) * 2;
    var w = x2 - x1 + cw;
    var h = y2 - y1 + cw;

    return <svg width={w} height={h} viewBox={[-cw / 2, -cw / 2, w, h]}>
      <path d={d} stroke='black' fill='transparent' />
      {
        this.props.showPoints !== false ? points.map((path, key) => {
          return <circle onMouseDown={this.onPointDown.bind(this, path, key)} className={'point-circle-' + key} stroke='black' fill='transparent' r={cr} cx={path.left} cy={path.top} key={key} />;
        }) : void 0
      }
    </svg>;
  }
}

export default PathComponent;
