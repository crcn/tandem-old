import * as React from "react";
import { startDrag } from "sf-front-end/utils/component";
import PathComponent from "./path";
import { BoundingRect } from "sf-core/geom";
import { FrontEndApplication } from "sf-front-end/application";
import { DisplayEntityCollection } from "sf-front-end/selection";

const POINT_STROKE_WIDTH = 0;
const POINT_RADIUS       = 3;

class ResizerComponent extends React.Component<{ app: FrontEndApplication, selection: DisplayEntityCollection, onResizing: Function, zoom: number, pointRadius?: number, strokeWidth?: number, onStopResizing: Function }, any> {

  private _dragger: any;
  private _movingTimer: any;
  private _dragTimer: any;

  constructor() {
    super();
    this.state = {};
  }

  onDoubleClick = () => {
    // this.props.bus.execute({
    //   type      : ENTITY_PREVIEW_DOUBLE_CLICK,
    //   selection : this.props.selection,
    // });
  }

  get targetDisplay() {
    return this.props.selection.display;
  }

  get file() {
    return this.props.app.editor.file;
  }

  updatePoint = (point, event) => {

    const keepAspectRatio = event.shiftKey;
    const keepCenter      = event.altKey;

    const selection = this.props.selection;

    // no ZOOM
    const style = this.targetDisplay.bounds;

    const props = {
      left   : style.left,
      top    : style.top,
      width  : style.width,
      height : style.height
    };

    if (/^n/.test(point.id)) {
      props.top    = point.currentBounds.top + point.top;
      props.height = point.currentBounds.height - point.top;
    }

    if (/e$/.test(point.id)) {
      props.width = point.left;
    }

    if (/^s/.test(point.id)) {
      props.height = point.top;
    }

    if (/w$/.test(point.id)) {
      props.width = point.currentBounds.width - point.left;
      props.left  = point.currentBounds.left + point.left;
    }

    if (keepAspectRatio) {
      if (/^[ns]/.test(point.id)) {
        const perc  = props.height / point.currentBounds.height;
        props.width = point.currentBounds.width * perc;

        // only north and south poles
        if (!/[ew]$/.test(point.id)) {
          props.left = point.currentBounds.left + (point.currentBounds.width / 2 - props.width / 2);
        } else if (/w$/.test(point.id)) {
          props.left = point.currentBounds.left + point.currentBounds.width - props.width;
        }
      } else if (/[ew]$/.test(point.id)) {
        const perc   = props.width / point.currentBounds.width;
        props.height = point.currentBounds.height * perc;

        if (!/[ns]$/.test(point.id)) {
          props.top = point.currentBounds.top + (point.currentBounds.height / 2 - props.height / 2);
        }
      }
    }

    if (keepCenter) {
      props.left = point.currentBounds.left + (point.currentBounds.width / 2 - props.width / 2);
      props.top  = point.currentBounds.top + (point.currentBounds.height / 2 - props.height / 2);
    }

    this.targetDisplay.bounds = new BoundingRect(
      props.left,
      props.top,
      props.left + props.width,
      props.top + props.height
    );
    this._isMoving();
  }

  /**
   */

  _isMoving() {
    this.props.onResizing();
    clearTimeout(this._dragTimer);
    this.setState({ dragging: true });
    this._dragTimer = setTimeout(() => {
      this.setState({ dragging: false });
    }, 100);
  }

  startDragging = (event) => {
    event.stopPropagation();
    const selection = this.props.selection;

    // when dragging, need to fetch style of the selection
    // so that the dragger is relative to the entity"s position
    const style = this.targetDisplay.bounds;

    const sx2 = style.left;
    const sy2 = style.top;

    this._dragger = startDrag(event, (event2, { delta }) => {

      const nx = sx2 + delta.x / this.props.zoom;
      const ny = sy2 + delta.y / this.props.zoom;

      this.moveTarget(nx, ny);
    }, () => {
      this.file.save();
      this._dragger = void 0;
      this.props.onStopResizing();
    });
  }

  onPointMouseUp = () => {
    this.file.save();
  }

  moveTarget(left, top) {
    this.targetDisplay.position = { left, top };
    this._isMoving();
  }

  render() {

    const pointRadius = (this.props.pointRadius || POINT_RADIUS) / this.props.zoom;
    const strokeWidth = (this.props.strokeWidth || POINT_STROKE_WIDTH) / this.props.zoom;
    const preview = this.props.selection.display;

    const rect       = preview.bounds;
    const zoomedRect = rect;

    const cw = (pointRadius + strokeWidth) * 2;

    // offset stroke
    const resizerStyle = {
      left     : zoomedRect.left - cw / 2 - 1,
      top      : zoomedRect.top  - cw / 2 - 1
    };

    const capabilities = preview.capabilities;
    const movable = capabilities.movable;

    const points = [
      ["nw", movable === true, 0, 0],
      ["n", movable === true, zoomedRect.width / 2, 0],
      ["ne", movable === true, zoomedRect.width, 0],
      ["e", true, zoomedRect.width, zoomedRect.height / 2],
      ["se", true, zoomedRect.width, zoomedRect.height],
      ["s", true, zoomedRect.width / 2, zoomedRect.height],
      ["sw", movable === true, 0, zoomedRect.height],
      ["w", movable === true, 0, zoomedRect.height / 2],
    ].map(([id, show, left, top], i) => ({
      id: id,
      index: i,
      show: show,

      // no zoom
      currentBounds: rect,
      left: left,
      top: top
    }));

    return (
      <div
        ref="selection"
        className="m-selector-component--selection"
        style={resizerStyle}
        onMouseDown={this.startDragging}
        onDoubleClick={this.onDoubleClick}
      >
        <PathComponent
          showPoints={capabilities.resizable}
          onPointChange={this.updatePoint}
          onPointMouseUp={this.onPointMouseUp}
          zoom={this.props.zoom}
          points={points}
          strokeWidth={strokeWidth}
          pointRadius={pointRadius}
        />
      </div>
    );
  }
}

export default ResizerComponent;
