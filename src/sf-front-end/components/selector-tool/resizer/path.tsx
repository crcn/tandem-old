import * as  React from "react";
import { startDrag } from "sf-front-end/utils/component";

class PathComponent extends React.Component<any, any> {

  onPointDown(point, index, event) {

    const sx = point.left;
    const sy = point.top;

    event.stopPropagation();

    startDrag(event, (event2, info) => {

      Object.assign(point, {
        left : (sx + info.delta.x),
        top  : (sy + info.delta.y),
      });

      this.props.onPointChange(point, event2);
    }, this.props.onPointMouseUp);
  }

  render() {

    const points = this.props.points;

    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    let d = "";

    // calculate the size of the box
    points.forEach(function (point, i) {
      x1 = Math.min(point.left, x1);
      x2 = Math.max(point.left, x2);
      y1 = Math.min(point.top, y1);
      y2 = Math.max(point.top, y2);
      d += (i === 0 ? "M" : "L") + point.left + " " + point.top;
    });

    d += "Z";

    const strokeWidth = this.props.strokeWidth;

    const cr = this.props.pointRadius;
    const cw = (cr + (strokeWidth || 1)) * 2;
    const w = x2 - x1 + cw;
    const h = y2 - y1 + cw;

    return (<svg width={w} height={h} viewBox={[-cw / 2, -cw / 2, w, h]}>
      <path d={d} strokeWidth={strokeWidth} stroke="transparent" fill="transparent" />
      {
        this.props.showPoints !== false ? points.map((path, key) =>
          path.show !== false ?
            <rect
              onMouseDown={this.onPointDown.bind(this, path, key)}
              className={`point-circle-${path.id || key}`}
              strokeWidth={strokeWidth}
              stroke="black"
              fill="transparent"
              width={cr * 2}
              height={cr * 2}
              x={path.left - cr}
              y={path.top - cr}
              rx={0}
              ry={0}
              key={key}
            />
          : void 0
        ) : void 0
      }
    </svg>);
  }
}

export default PathComponent;
