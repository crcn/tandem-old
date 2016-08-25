import * as React from "react";
import { Editor } from "sf-front-end/models";
import { startDrag } from "sf-front-end/utils/component";
import PathComponent from "./path";
import { IVisibleEntity } from "sf-core/entities";
import { FrontEndApplication } from "sf-front-end/application";
import { BoundingRect, IPoint, Point } from "sf-core/geom";
import { DisplayEntitySelection } from "sf-front-end/models";
import { Guider, createBoundingRectPoints, SnapResult } from "../guider";
import { IntersectingPointComponent } from "./intersecting-point";

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 4;

class ResizerComponent extends React.Component<{
  editor: Editor,
  app: FrontEndApplication,
  selection: DisplayEntitySelection<any>,
  onResizing: Function,
  onMoving: Function,
  onStopMoving: Function,
  zoom: number,
  pointRadius?: number,
  strokeWidth?: number,
  onStopResizing: Function
}, any> {

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
    return this.props.app.workspace.file;
  }

  createGuider(): Guider {
    const guider = new Guider(3 / this.props.zoom);
    this.file.document.root.flatten().forEach((childNode: IVisibleEntity) => {
      if (childNode.display && this.props.selection.indexOf(childNode) === -1) {
        guider.addPoint(...createBoundingRectPoints(childNode.display.bounds));
      }
    });
    return guider;
  }

  updatePoint = (point, event) => {

    this.props.onResizing(event);

    const keepAspectRatio = event.shiftKey;
    const keepCenter      = event.altKey;

    const selection = this.props.selection;

    const bounds = this.targetDisplay.bounds;
    const guider = this.createGuider();

    const props = {
      left   : bounds.left,
      top    : bounds.top,
      width  : bounds.width,
      height : bounds.height
    };

    let snapResult: SnapResult = guider.snap(
      new Point(point.currentBounds.left + point.left, point.currentBounds.top + point.top)
    );

    point.top  += snapResult.delta.top;
    point.left += snapResult.delta.left;

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

    this.setState({ snap: snapResult });

    this.targetDisplay.bounds = new BoundingRect(
      props.left,
      props.top,
      props.left + props.width,
      props.top + props.height
    );
  }

  startDragging = (event) => {
    this.props.onMoving();
    event.stopPropagation();
    const selection = this.props.selection;

    // when dragging, need to fetch style of the selection
    // so that the dragger is relative to the entity"s position
    const bounds = this.targetDisplay.bounds;

    const sx2 = bounds.left;
    const sy2 = bounds.top;
    const translateLeft = this.props.editor.transform.left;
    const translateTop  = this.props.editor.transform.top;
    const guider = this.createGuider();

    this.setState({ snap: undefined });

    this._dragger = startDrag(event, (event2, { delta }) => {

      const nx = (sx2 + (delta.x - (this.props.editor.transform.left - translateLeft)) / this.props.zoom);
      const ny = (sy2 + (delta.y - (this.props.editor.transform.top - translateTop)) / this.props.zoom);

      let position = { left: nx, top: ny };
      let result = guider.snap(position, createBoundingRectPoints(new BoundingRect(nx, ny, nx + bounds.width, ny + bounds.height)));

      this.setState({ snap: result });

      this.moveTarget(result.point);
    }, () => {
      this.file.save();
      this._dragger = void 0;
      this.setState({ snap: undefined });
      this.props.onStopMoving();
    });
  }

  onPointMouseUp = () => {
    this.file.save();
    this.setState({ snap: undefined });
    this.props.onStopResizing();
  }

  moveTarget(position: IPoint) {
    this.targetDisplay.position = position;
  }

  render() {

    const pointRadius = (this.props.pointRadius || POINT_RADIUS);
    const strokeWidth = (this.props.strokeWidth || POINT_STROKE_WIDTH);
    const display = this.props.selection.display;

    const rect = display.bounds;

    // offset stroke
    const resizerStyle = {
      position : "absolute",
      left     : rect.left,
      top      : rect.top,
      width    : rect.width,
      height   : rect.height,
      transform: `translate(-${pointRadius / this.props.zoom}px, -${pointRadius / this.props.zoom}px)`,
      transformOrigin: "top left"
    };

    const capabilities = display.capabilities;
    const movable = capabilities.movable;

    const points = [
      ["nw", movable === true, 0, 0],
      ["n", movable === true, rect.width / 2, 0],
      ["ne", movable === true, rect.width, 0],
      ["e", true, rect.width, rect.height / 2],
      ["se", true, rect.width, rect.height],
      ["s", true, rect.width / 2, rect.height],
      ["sw", movable === true, 0, rect.height],
      ["w", movable === true, 0, rect.height / 2],
    ].map(([id, show, left, top], i) => ({
      id: id,
      index: i,
      show: show,

      // no zoom
      currentBounds: rect,
      left: left,
      top: top
    }));

    const snap: SnapResult = this.state.snap;

    return (<div>
      <div
        ref="selection"
        className="m-selector-component--selection"
        style={resizerStyle}
        onMouseDown={this.startDragging}
        onDoubleClick={this.onDoubleClick}
      >
        <PathComponent
          editor={this.props.editor}
          showPoints={capabilities.resizable}
          onPointChange={this.updatePoint}
          onPointMouseUp={this.onPointMouseUp}
          zoom={this.props.zoom}
          points={points}
          strokeWidth={strokeWidth}
          pointRadius={pointRadius}
        />
      </div>
      { (snap ? snap.guidePoints : []).map((point: IPoint, i) => {
        return <IntersectingPointComponent editor={this.props.editor} point={point} key={i} />;
      })}
    </div>);
  }
}

export default ResizerComponent;
