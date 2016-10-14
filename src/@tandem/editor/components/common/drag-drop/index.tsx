import "./index.scss";

import * as React from "react";

/**
 * Enables people to drag componens & drop components
 * around the app
 */
export class DragDropComponent extends React.Component<{ onDragStart?: Function, onDragStop?: Function, onDrag: Function, canMove?: boolean }, any> {

  constructor() {
    super();
    this.state = {};
  }

  startDragging = (event) => {

    if (this.props.onDragStart) this.props.onDragStart();

    // stop dragging immediately in case it was never fired from mouseup. This *might*
    // happen if the user moves their cursor outside of the app
    this.stopDragging();

    const b  = (this.refs as any).draggable.getBoundingClientRect();
    const cx = b.left + b.right;
    const cy = b.top;

    this.setState({
      drag   : true,
      mleft  : event.screenX,
      mtop   : event.screenY,
      sleft  : cx,
      stop   : cy
    });

    // always stop drag on mouse up.
    document.addEventListener("mouseup", this.stopDragging);
    document.addEventListener("mousemove", this.drag);
  }

  drag = (event: MouseEvent) => {
    this.setState({
      left: event.screenX - this.state.mleft,
      top: event.screenY - this.state.mtop
    });

    if (this.props.onDrag) {
      this.props.onDrag(this.state);
    }
  }

  stopDragging = () => {
    this.setState({ drag: false });
    document.removeEventListener("mouseup", this.stopDragging);
    document.removeEventListener("mousemove", this.drag);
  }

  render() {

    let dragStyle = {};

    if (this.state.drag && this.props.canMove !== false) {
      dragStyle = {
        position : "fixed",
        top      : this.state.top,
        left     : this.state.left
      };
    }

    return <div ref="dragDrop" className="m-drag-drop">
      <div ref="draggable" style={dragStyle} onMouseDown={this.startDragging.bind(this)}>
        { this.props.children }
      </div>
    </div>;
  }
};
