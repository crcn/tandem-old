import "./index.scss";
import * as React from "react";
import { DragDropComponent } from "@tandem/editor/components/drag-drop";
import { IReference } from "@tandem/common/reference";

export class SideDraggerComponent extends React.Component<{ reference: IReference, position: string }, any> {

  private _start: number;

  onDragStart = () => {
    this._start = this.props.reference.value;
  }
  onDrag = (delta: { left: number, top: number }) => {
    this.props.reference.value = this._start + (this.props.position === "right" ? delta.left : -delta.left);
  }
  render() {
    return <DragDropComponent canMove={false} onDragStart={this.onDragStart} onDrag={this.onDrag}>
      <div className={["m-side-dragger", this.props.position].join(" ")}>

      </div>
    </DragDropComponent>;
  }
}

