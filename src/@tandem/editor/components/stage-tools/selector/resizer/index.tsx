import * as React from "react";
import { Editor } from "@tandem/editor/models";
import { startDrag } from "@tandem/common/utils/component";
import PathComponent from "./path";
import { DocumentFile } from "@tandem/editor/models";
import { MetadataKeys } from "@tandem/editor/constants";
import { FrontEndApplication } from "@tandem/editor/application";
import { VisibleDOMEntityCollection } from "@tandem/editor/collections";
import { IntersectingPointComponent } from "./intersecting-point";
import { SyntheticDOMElement, BaseVisibleDOMNodeEntity, BaseDOMNodeEntity } from "@tandem/synthetic-browser";
import { BoundingRect, IPoint, Point, traverseTree, findTreeNode } from "@tandem/common";
import { Guider, GuideLine, createBoundingRectPoints, BoundingRectPoint } from "../guider";

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
  selection: Array<any>,
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
  private _currentGuider: Guider;
  private _visibleEntities: VisibleDOMEntityCollection<BaseVisibleDOMNodeEntity<SyntheticDOMElement, any>>;

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

  createGuider(): Guider {
    const guider = new Guider(5 / this.props.zoom);
    const { selection } = this.props;

    const bottomOwnerDocument = (selection as BaseDOMNodeEntity<any, any>[]).reduce((a: BaseDOMNodeEntity<any, any>, b: BaseDOMNodeEntity<any, any>) => {
      return a.source.ownerDocument.defaultView.depth > a.source.ownerDocument.defaultView.depth ? a : b;
    }).source.ownerDocument;

    const bottomOwnerDocumentEntity = findTreeNode(this.props.app.editor.documentEntity, (entity) => entity.source === bottomOwnerDocument);

    traverseTree(bottomOwnerDocumentEntity, (node) => {
      if (node.source.ownerDocument !== bottomOwnerDocument) return;

      for (const entity of selection) {

        // do not use the node as a guide point if it's part of the selection,
        // or the source is the same. The source will be the same in certain cases -
        // registered components for example.
        if (node === entity || node.source === entity.source) return;
      }

      // if (node.metadata.get(MetadataKeys.CANVAS_ROOT) && node.flatten().indexOf()) return;

      const displayNode = node as any as BaseVisibleDOMNodeEntity<any, any>;
      const bounds = displayNode.absoluteBounds;
      if (bounds && bounds.visible) {
        guider.addPoint(...createBoundingRectPoints(bounds));
      }
    });

    return guider;
  }

  updatePoint = (point, event: MouseEvent) => {
    const keepAspectRatio = event.shiftKey;
    const keepCenter      = event.altKey;
    const anchor: IPoint  = point.anchor;

    let bounds = resize(point.currentBounds.clone(), point.delta, point.anchor, keepAspectRatio, keepCenter);

    const guider = this._currentGuider;

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
    this._visibleEntities.absoluteBounds = bounds;


    this.props.onResizing(event);
  }

  startDragging = (event) => {
    event.stopPropagation();

    if (!this._visibleEntities.capabilities.movable) return;

    this.props.onMoving();
    const selection = this.props.selection;

    // when dragging, need to fetch style of the selection
    // so that the dragger is relative to the entity"s position
    const bounds = this._visibleEntities.absoluteBounds;

    const sx2 = bounds.left;
    const sy2 = bounds.top;
    const translateLeft = this.props.editor.transform.left;
    const translateTop  = this.props.editor.transform.top;
    const guider = this.createGuider();

    this.setState({ guideLines: undefined });
    this.props.editor.metadata.set(MetadataKeys.MOVING, true);

    this._dragger = startDrag(event, (event2, { delta }) => {

      const nx = (sx2 + (delta.x - (this.props.editor.transform.left - translateLeft)) / this.props.zoom);
      const ny = (sy2 + (delta.y - (this.props.editor.transform.top - translateTop)) / this.props.zoom);

      let position = { left: nx, top: ny };
      let changeDelta = guider.snap(position, createBoundingRectPoints(new BoundingRect(nx, ny, nx + bounds.width, ny + bounds.height)));


      const newBounds = bounds.moveTo({
        left: nx + changeDelta.left,
        top: ny + changeDelta.top
      });

      this.moveTarget(newBounds.position);
      const guideLines = guider.getGuideLines(createBoundingRectPoints(newBounds));

      this.setState({ guideLines: guideLines });

    }, () => {
      this._visibleEntities.save();
      this._dragger = void 0;
      this.props.editor.metadata.set(MetadataKeys.MOVING, false);
      this.setState({ guideLines: undefined });
      this.props.onStopMoving();
    });
  }

  onPointMouseDown = () => {
    this._currentGuider = this.createGuider();
    this.props.editor.metadata.set(MetadataKeys.MOVING, true);
  }

  onPointMouseUp = () => {
    this._visibleEntities.save();
    this.props.editor.metadata.set(MetadataKeys.MOVING, false);
    this.setState({ guideLines: undefined });
    this.props.onStopResizing();
  }

  moveTarget(position: IPoint) {
    this._visibleEntities.position = position;
  }

  render() {

    const { selection } = this.props;

    const entities = this._visibleEntities = new VisibleDOMEntityCollection(...selection);

    const pointRadius = (this.props.pointRadius || POINT_RADIUS);
    const strokeWidth = (this.props.strokeWidth || POINT_STROKE_WIDTH);

    const rect = BoundingRect.merge(...entities.map(entity => entity.absoluteBounds));

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

    const capabilities = entities.capabilities;
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

    const guideLines: Array<GuideLine> = this.state.guideLines || [];

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
          onPointMouseDown={this.onPointMouseDown}
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
