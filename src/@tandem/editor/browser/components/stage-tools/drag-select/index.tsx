import "./index.scss";
import * as React from "react";
import { startDrag } from "@tandem/common/utils/component";
import { Workspace } from "@tandem/editor/browser/stores";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { SelectRequest, MouseAction } from "@tandem/editor/browser/messages";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";
import { VisibleSyntheticElementCollection } from "@tandem/editor/browser/collections";
import { BoundingRect, BaseApplicationComponent } from "@tandem/common";

export class DragSelectStageToolComponent extends BaseApplicationComponent<{ workspace: Workspace, style?: any }, any> {

  componentDidMount() {
    document.body.addEventListener("mousedown", this.startDrag);
  }

  componentWillImount() {
    document.body.removeEventListener("mousedown", this.startDrag);
  }

  startDrag = (event: MouseEvent) => {

    const { zoom } = this.props.workspace;

    const container = (this.refs as any).container;
    if (!container) return;

    const b = container.getBoundingClientRect();

    const visibleEntities = [];

    const left = (event.clientX - b.left) / zoom;
    const top  = (event.clientY - b.top) / zoom;

    this.setState({
      left: left,
      top : top,
      dragging: true
    });

    startDrag(event, (event2, { delta }) => {

      let x = left;
      let y = top;
      let w = Math.abs(delta.x / zoom);
      let h = Math.abs(delta.y / zoom);

      if (delta.x < 0) {
        x = left - w;
      }

      if (delta.y < 0) {
        y = top - h;
      }

      this.setState({
        left: x,
        top: y,
        width: w,
        height: h,
      });

      const bounds = new BoundingRect(x, y, x + w, y + h);

      const selection = [];

      visibleEntities.forEach(function (entity) {
        if (entity.editable && (entity.metadata.get(MetadataKeys.CANVAS_ROOT) !== true || entity.children.length === 0) && entity.absoluteBounds.intersects(bounds)) {
          selection.push(entity);
        }
      });

      this.props.workspace.select(selection);

    }, () => {
      this.setState({
        dragging: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0
      });
    });
  }

  render() {

    if (!process.env.SANDBOXED) return null;

    const { zoom } = this.props.workspace;
    const bounds = this.props.style || this.state || { left: 0, top: 0, width: 0, bottom: 0 };

    const style = {
      display: bounds.width && bounds.height ? "block" : "none",
      left   : bounds.left,
      top    : bounds.top,
      width  : bounds.width,
      height : bounds.height,
      boxShadow: `0 0 0 ${1 / zoom}px #00B5FF`
    };

    return (<div ref="container" className="m-drag-select">
      <div style={style} className="m-drag-select--box" />
    </div>);
  }
}

