
import * as  React from "react";
import { startDrag } from "sf-front-end/utils/component";
import { Editor } from "sf-front-end/models/editor";

class PathComponent extends React.Component<{ strokeWidth: number, showPoints: boolean, pointRadius: number, editor: Editor, onPointChange: Function, zoom: number, onPointMouseUp: Function, points: Array<any> }, any> {

  onPointDown(point, index, event) {

    // slight UX tweak to ensure that the resizer cursor stays the same
    // as the user is dragging the selected entity.
    const oldCursor = this.props.editor.cursor;
    this.props.editor.cursor = window.getComputedStyle(event.target).cursor;

    const sx = point.left;
    const sy = point.top;

    event.stopPropagation();

    startDrag(event, (event2, info) => {

      Object.assign(point, {
        left : (sx + info.delta.x / this.props.zoom),
        top  : (sy + info.delta.y / this.props.zoom)
      });

      this.props.onPointChange(point, event2);
    }, () => {
      this.props.editor.cursor = oldCursor;
      this.props.onPointMouseUp(...arguments);
    });
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
    const crz = cr / this.props.zoom;
    const cw = cr * 2;
    const cwz = cw / this.props.zoom;
    const w = Math.ceil(x2 - x1 + Math.max(cw, cwz));
    const h = Math.ceil(y2 - y1 + Math.max(cw, cwz));
    const p = 100;

    return (<svg width={w} height={h} viewBox={[0, 0, w, h]}>
      <path d={d} strokeWidth={strokeWidth} stroke="transparent" fill="transparent" />
      {
        this.props.showPoints !== false ? points.map((path, key) =>
          path.show !== false ?
            <rect
              onMouseDown={this.onPointDown.bind(this, path, key)}
              className={`point-circle-${path.id || key}`}
              strokeWidth={0}
              stroke="black"
              fill="transparent"
              width={cwz}
              height={cwz}
              x={path.left}
              y={path.top}
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
