import "./intersecting-point.scss";


import * as React from "react";
import { IPoint } from "sf-core/geom";
import { Editor } from "sf-front-end/models/editor";
import { BoundingRectPoint, GuideLine } from "../guider";

export class IntersectingPointComponent extends React.Component<{ guideLine: GuideLine, editor: Editor }, any> {
  render() {

    const { guideLine, editor } = this.props;
    const point: BoundingRectPoint =  guideLine.origin as BoundingRectPoint;
    const { rect, anchor } = point;
    const scale = editor.transform.scale;
    const reverseScale = 1 / scale;
    const borderWidth = reverseScale * 1;
    const halfBorderWidth = borderWidth / 2;

    let width = rect.width;
    let height = rect.height;

    const style = {
      position: "absolute",
      left: point.rect.left,
      top: point.rect.top
    };

    let line;

    if (guideLine.horizontal) {
      line = <line x1={0} y1={height * anchor.top} x2={width} y2={height * anchor.top} strokeWidth={borderWidth} />;
    } else {
      line = <line x1={width * anchor.left} y1={0} x2={width * anchor.left} y2={height} strokeWidth={borderWidth} />;
    }

    return <div style={style} className="m-intersecting-point">
      <svg width={width} height={height} viewBox={[-halfBorderWidth, -halfBorderWidth, width + borderWidth, height + borderWidth]}>
        { line }
      </svg>
    </div>;
  }
}