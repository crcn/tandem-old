import * as React from "react";
import { Editor } from "sf-front-end/models";
import { startDrag } from "sf-front-end/utils/component";
import PathComponent from "./path";
import { IVisibleEntity } from "sf-core/entities";
import { FrontEndApplication } from "sf-front-end/application";
import { BoundingRect, IPoint, Point } from "sf-core/geom";
import { DisplayEntitySelection } from "sf-front-end/models";
import { Guider, GuideLine, createBoundingRectPoints, BoundingRectPoint } from "../guider";
import { IntersectingPointComponent } from "./intersecting-point";

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 4;

function resize(oldBounds: BoundingRect, delta: IPoint, anchor: IPoint, keepAspectRatio: boolean, keepCenter: boolean) {

  const centerLeft      = keepCenter ? 0.5 : anchor.left;
  const centerTop       = keepCenter ? 0.5 : anchor.top;

  const oldLeft   = oldBounds.left;
  const oldTop    = oldBounds.top;
  const oldWidth  = oldBounds.width;
  const oldHeight = oldBounds.height;

  let { left, top, width, height } = oldBounds;

  // N
  if (anchor.top === 0) {
    top += delta.top;
    height -= delta.top;
    if (keepCenter) height += oldTop - top;
  }

  // S
  if (anchor.top === 1) {
    height += delta.top;
    if (keepCenter) {
      const cheight = oldHeight - height;
      top += cheight;
      height -= cheight;
    }
  }

  // W
  if (anchor.left === 0) {
    left += delta.left;
    width -= delta.left;
    if (keepCenter) width += oldLeft - left;
  }

  // E
  if (anchor.left === 1) {
    width += delta.left;
    if (keepCenter) {
      const cwidth = oldWidth - width;
      left += cwidth;
      width -= cwidth;
    }
  }

  if (keepAspectRatio) {
    if (anchor.top === 0 || anchor.top === 1) {
      const perc = height / oldHeight;
      width = oldWidth * perc;
      left = oldLeft + (oldWidth - width) * (1 - centerLeft);
    } else if (anchor.top === 0.5) {
      const perc = width / oldWidth;
      height = oldHeight * perc;
      top = oldTop + (oldHeight - height) * (1 - centerTop);
    }
  }

  return new BoundingRect(
    left,
    top,
    left + width,
    top + height
  );
}

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
    const guider = new Guider(5 / this.props.zoom);
    this.file.document.root.flatten().forEach((childNode: IVisibleEntity) => {
      if (childNode.display && this.props.selection.indexOf(childNode) === -1) {
        guider.addPoint(...createBoundingRectPoints(childNode.display.bounds));
      }
    });
    return guider;
  }

  updatePoint = (point, event: KeyboardEvent) => {
    const keepAspectRatio = event.shiftKey;
    const keepCenter      = event.altKey;
    const anchor: IPoint  = point.anchor;

    let bounds = resize(point.currentBounds.clone(), point.delta, point.anchor, keepAspectRatio, keepCenter);
    const guider = this.createGuider();

    const currentPoint = new Point(
      bounds.left + bounds.width * anchor.left,
      bounds.top + bounds.height * anchor.top
    );

    const snapAnchors = [
      new Point(0, 0),
      new Point(0.5, 0),
      new Point(1, 0),
      new Point(1, 0.5),
      new Point(1, 1),
      new Point(0.5, 1),
      new Point(0, 1),
      new Point(0, 0.5)
    ];

    for (const snapAnchor of snapAnchors) {
      const snapDelta = guider.snap({
        left: bounds.left + bounds.width * snapAnchor.left,
        top: bounds.top + bounds.height * snapAnchor.top
      });

      bounds = resize(bounds, snapDelta, snapAnchor, keepAspectRatio, keepCenter);
      // if (snapDelta.left || snapDelta.top) break;
    }

    this.setState({ guideLines: guider.getGuideLines(createBoundingRectPoints(bounds)) });
    this.targetDisplay.bounds = bounds;
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

    this.setState({ guideLines: undefined });

    this._dragger = startDrag(event, (event2, { delta }) => {

      const nx = (sx2 + (delta.x - (this.props.editor.transform.left - translateLeft)) / this.props.zoom);
      const ny = (sy2 + (delta.y - (this.props.editor.transform.top - translateTop)) / this.props.zoom);

      let position = { left: nx, top: ny };
      let changeDelta = guider.snap(position, createBoundingRectPoints(new BoundingRect(nx, ny, nx + bounds.width, ny + bounds.height)));

      this.moveTarget(new Point(position.left + changeDelta.left, position.top + changeDelta.top));

      this.setState({ guideLines: guider.getGuideLines(createBoundingRectPoints(this.targetDisplay.bounds)) });

    }, () => {
      this.file.save();
      this._dragger = void 0;
      this.setState({ guideLines: undefined });
      this.props.onStopMoving();
    });
  }

  onPointMouseUp = () => {
    this.file.save();
    this.setState({ guideLines: undefined });
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

      anchor: new Point(left as number / rect.width, top as number / rect.height),
      currentBounds: rect,
      left: left,
      top: top
    }));

    const guideLines: Array<IPoint> = this.state.guideLines || [];

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

      { guideLines.map((guideLine: GuideLine, i) => {
        return <IntersectingPointComponent editor={this.props.editor} guideLine={guideLine} key={i} />;
      })}
    </div>);
  }
}

export default ResizerComponent;
