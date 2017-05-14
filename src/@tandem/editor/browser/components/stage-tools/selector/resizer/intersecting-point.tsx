import "./intersecting-point.scss";


import React =  require("react");
import { IPoint } from "@tandem/common/geom";
import { Workspace } from "@tandem/editor/browser/stores";
import { BoundingRectPoint, GuideLine } from "../guider";

export class IntersectingPointComponent extends React.Component<{ guideLine: GuideLine, workspace: Workspace }, any> {
  render() {

    const { guideLine, workspace } = this.props;
    const point: BoundingRectPoint =  guideLine.origin as BoundingRectPoint;
    const { rect, anchor } = point;
    const scale = workspace.transform.scale;
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

    return <div style={style as any} className="m-intersecting-point">
      <svg width={width + borderWidth} height={height + borderWidth} viewBox={[-halfBorderWidth, -halfBorderWidth, width + borderWidth, height + borderWidth].join(" ")}>
        { line }
      </svg>
    </div>;
  }
}