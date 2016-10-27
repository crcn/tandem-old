import "./index.scss";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import ToolsLayerComponent from "./tools";
import { IsolateComponent }  from "@tandem/editor/browser/components/common";
import { SyntheticDOMElement }  from "@tandem/synthetic-browser";
import PreviewLayerComponent from "./preview";
import { UpdateAction, IActor } from "@tandem/common";
import { Dependencies, PrivateBusDependency } from "@tandem/common/dependencies";
import { BoundingRect, IPoint, BaseApplicationComponent } from "@tandem/common";
import {
  ZoomAction,
  MouseAction,
  KeyboardAction,
} from "@tandem/editor/browser/actions";

export default class EditorStageLayersComponent extends BaseApplicationComponent<{ workspace: Workspace, zoom: number }, any> {

  private _mousePosition: IPoint;
  private _toolsHidden: any;
  private _previousZoom: number;

  $didInject() {
    super.$didInject();
    this.state = {};
  }

  onMouseDown = (event) => {
    this.bus.execute(new MouseAction(MouseAction.CANVAS_MOUSE_DOWN, event.nativeEvent || event));
  }

  translate(left, top) {
    this.props.workspace.transform.left = left;
    this.props.workspace.transform.top = top;

    const body = (this.refs as any).isolate.body;

    const width = body.offsetWidth;
    const height = body.offsetHeight;
    const zoom   = this.props.workspace.zoom;

    let viewport = BoundingRect.zeros();
    viewport.left = -left
    viewport.top = -top
    viewport.width = width
    viewport.height = height
    viewport = viewport.zoom(1/zoom);


    let visibleCount = 0;

    // if (!this.props.editor.documentEntity || true) return;

    // this.props.editor.documentEntity.querySelectorAll("*").forEach((entity: BaseDOMNodeEntity<any, any>) => {
    //   const rect: BoundingRect = entity.source.getBoundingClientRect && entity.source.getBoundingClientRect();
    //   entity.metadata.set(MetadataKeys.ENTITY_VISIBLE, !rect || viewport.intersects(rect));
    // });
  }

  pane(leftDelta, topDelta) {
    this.translate(this.props.workspace.transform.left - leftDelta, this.props.workspace.transform.top - topDelta);
  }

  onMouseEvent = (event: React.MouseEvent<any>) => {

    let left: number = event.pageX;
    let top: number = event.pageY;

    this._mousePosition = {
      left: left,
      top: top
    };
  }

  componentWillUpdate(props) {
    if (props.workspace !== this.props.workspace) {
      requestAnimationFrame(this._recenter);
    } else if (props.zoom !== this.props.zoom) {
      this._center(this.props.zoom, props.zoom);
    }
  }

  _center = (oldZoom, newZoom) => {
    const zd   = (newZoom / oldZoom);

    const v1w  = this.state.canvasWidth;
    const v1h  = this.state.canvasHeight;

    // center is based on the mouse position
    const v1px = this._mousePosition ? this._mousePosition.left / v1w : 0.5;
    const v1py = this._mousePosition ? this._mousePosition.top / v1h : 0.5;

    // calculate v1 center x & y
    const v1cx = v1w * v1px;
    const v1cy = v1h * v1py;

    // old screen width & height
    const v2ow = v1w * oldZoom;
    const v2oh = v1h * oldZoom;

    // old offset pane left
    const v2ox = this.props.workspace.transform.left;
    const v2oy = this.props.workspace.transform.top;

    // new width of view 2
    const v2nw = v1w * newZoom;
    const v2nh = v1h * newZoom;

    // get the offset px & py of view 2
    const v2px = (v1cx - v2ox) / v2ow;
    const v2py = (v1cy - v2oy) / v2oh;

    const left = v1w * v1px - v2nw * v2px;
    const top  = v1h * v1py - v2nh * v2py;

    this.translate(left, top);
    if (this.state.showCanvas !== true) {
      this.setState({ showCanvas: true });
    }
  }

  onWheel = (event: React.WheelEvent<any>) => {
    this._zooming();
    this.onMouseEvent(event);
    if (event.metaKey) {
      event.preventDefault();
      this.bus.execute(new ZoomAction((event.deltaY / 250)));
    } else {
      this.pane(event.deltaX, event.deltaY);
      event.preventDefault();
      this.forceUpdate();
    }
  }

  private _zoomTimer = null;

  _zooming() {
    this.setState({ zooming: true });
    clearTimeout(this._zoomTimer);
    this._zoomTimer = setTimeout(() => this.setState({ zooming: false }), 100);
  }

  onScroll = () => {
    if (!this._hideTools()) {
      this.forceUpdate();
    }
  }

  _hideTools() {
    const paused = !!this._toolsHidden;
    if (this._toolsHidden) clearTimeout(this._toolsHidden);
    this._toolsHidden = setTimeout(this._showTools, 100);
    return paused;
  }

  _showTools = () => {
    this._toolsHidden = void 0;
    this.forceUpdate();
  }

  componentDidMount() {
    this._recenter();
  }

  _recenter = () => {
    const body = (this.refs as any).isolate.body;
    this._mousePosition = undefined;

    let width  = body.offsetWidth;
    let height = body.offsetHeight;

    this.setState({
      canvasWidth  : width,
      canvasHeight : height,
      centerLeft   : 0.5,
      centerTop    : 0.5
    });
  }

  onKey = (event) => {
    this.bus.execute(new KeyboardAction(KeyboardAction.CANVAS_KEY_DOWN, event));
  }

  render() {

    const { workspace } = this.props;
    const style = {
      cursor: this.props.workspace.cursor
    };

    const canvasWidth  = this.state.canvasWidth;
    const canvasHeight = this.state.canvasHeight;
    const centerLeft   = this.state.centerLeft;
    const centerTop    = this.state.centerTop;

    let transform;

    if (canvasWidth) {
      const { left, top } = this.props.workspace.transform;
      transform = `translate(${left}px, ${top}px) scale(${this.props.zoom})`;
    }

    const innerStyle = {
      transform: transform,
      transformOrigin: "top left",
      position: "absolute",
      width: "100%",
      height: "100%",
      overflow: "visible",
      border: "none"
    };

    return (<IsolateComponent onKeyDown={this.onKey} ref="isolate" ignoreInputEvents={true} onWheel={this.onWheel} onScroll={this.onScroll} inheritCSS className="m-editor-stage-isolate">
      <style>
        {
          `html, body {
            overflow: hidden;
          }`
        }
      </style>
      <div
        ref="canvas"
        onMouseMove={this.onMouseEvent}
        onMouseDown={this.onMouseDown}
        tabIndex={-1}
        className="m-editor-stage-canvas"
        style={style}>
          <div style={innerStyle} className="noselect" data-previewroot>
            <PreviewLayerComponent renderer={this.props.workspace.browser.renderer} />
            { workspace.document ? <ToolsLayerComponent workspace={workspace} zoom={workspace.zoom} zooming={this.state.zooming} allElements={workspace.documentQuerier.queriedElements} /> : undefined }
          </div>
      </div>
    </IsolateComponent>);
  }
}
