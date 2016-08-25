import "./intersecting-point.scss";


import * as React from "react";
import { IPoint } from "sf-core/geom";
import { Editor } from "sf-front-end/models/editor";

export class IntersectingPointComponent extends React.Component<{ point: IPoint, editor: Editor }, any> {
  render() {
    const { point, editor } = this.props;
    const scale = editor.transform.scale;
    const reverseScale = 1 / scale;

    const size  = 5000;
    const hsize = size / 2;

    const style = {
      position: "absolute",
      left: point.left - hsize,
      top: point.top - hsize
    };

    return <div style={style} className="m-intersecting-point">
      <svg width={size} height={size}>
        <line x1={0} y1={hsize} x2={size} y2={hsize} strokeWidth={reverseScale} />
        <line x1={hsize} y1={0} x2={hsize} y2={size} strokeWidth={reverseScale} />
      </svg>
    </div>;
  }
}