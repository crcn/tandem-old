import "./index.scss";
import * as React from "react";
import { BoundingRect } from "@tandem/common/geom";

export class SelectionSizeComponent extends React.Component<{ zoom: number, left: number, top: number, bounds: BoundingRect }, any> {

  render() {
    return <div style={{
      transform: `scale(${1 / this.props.zoom})`,
      left: this.props.left + 10 / this.props.zoom,
      top: this.props.top + 10 / this.props.zoom
    }} className="m-selection-size">{Math.round(this.props.bounds.width)} &times; { Math.round(this.props.bounds.height) }</div>;
  }
}
