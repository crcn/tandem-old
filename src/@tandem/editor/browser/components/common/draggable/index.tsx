import * as React from "react";
import { TextEditorToken } from "@tandem/editor/browser";

export interface IDraggableComponentProps {
  onStartDrag(event: React.MouseEvent<any>);
  onStopDrag(event: MouseEvent);
  onDrag(event: MouseEvent);
  style?: any;
  className?: string;
  tabIndex?: any;
}

export class DraggableComponent extends React.Component<IDraggableComponentProps, any> {
  startDrag = (event: React.MouseEvent<HTMLSpanElement>) => {
    this.props.onStartDrag(event);
    document.addEventListener("mouseup", this.stopDrag);
    document.addEventListener("mousemove", this.onMouseMove);
  }
  onMouseMove = (event: MouseEvent) => {
    this.props.onDrag(event);
  }
  stopDrag = (event: MouseEvent) => {
    this.props.onStopDrag(event);
    document.removeEventListener("mouseup", this.stopDrag);
    document.removeEventListener("mousemove", this.onMouseMove);
  }
  render() {
    return <span style={this.props.style} tabIndex={this.props.tabIndex} className={this.props.className} onMouseDown={this.startDrag}>
      { this.props.children }
    </span>
  }
}