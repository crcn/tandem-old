import "./index.scss";
import * as React from "react";
import { IPosition } from "sf-core/geom";
import IsolateComponent  from "sf-front-end/components/isolate";
import ToolsLayerComponent from "./tools";
import PreviewLayerComponent from "./preview";
import { Editor, Workspace } from "sf-front-end/models";
import { Dependencies, MainBusDependency } from "sf-core/dependencies";
import {
  ZoomAction,
  MouseAction,
  KeyboardAction,
  CANVAS_KEY_DOWN,
  CANVAS_MOUSE_DOWN,
} from "sf-front-end/actions";

export default class EditorStageLayersComponent extends React.Component<{ editor: Editor, workspace: Workspace, dependencies: Dependencies, zoom: number }, any> {

  private _mousePosition: IPosition;
  private _toolsHidden: any;
  private _previousZoom: number;

  constructor(props) {
    super(props);
    this.state = {};
  }

  onMouseDown = (event) => {
    this.bus.execute(new MouseAction(CANVAS_MOUSE_DOWN, event.nativeEvent));
  }

  get bus() {
    return MainBusDependency.getInstance(this.props.dependencies);
  }

  translate(left, top) {
    this.props.editor.transform.left = left;
    this.props.editor.transform.top = top;
  }

  pane(leftDelta, topDelta) {
    this.translate(this.props.editor.transform.left - leftDelta, this.props.editor.transform.top - topDelta);
  }

  onMouseEvent = (event: MouseEvent) => {
    this._mousePosition = {
      left: event.pageX,
      top: event.pageY
    };
  }

  componentWillUpdate(props) {
    if (props.zoom !== this.props.zoom) {
      this._center(this.props.zoom, props.zoom);
    }
  }

  _center = (oldZoom, newZoom) => {
    const zd   = (newZoom / oldZoom);

    const v1w  = this.state.canvasWidth;
    const v1h  = this.state.canvasHeight;

    // center is based on the mouse position
    const v1px = this._mousePosition.left / v1w;
    const v1py = this._mousePosition.top / v1h;

    // calculate v1 center x & y
    const v1cx = v1w * v1px;
    const v1cy = v1h * v1py;

    // old screen width & height
    const v2ow = v1w * oldZoom;
    const v2oh = v1h * oldZoom;

    // old offset pane left
    const v2ox = this.props.editor.transform.left;
    const v2oy = this.props.editor.transform.top;

    // new width of view 2
    const v2nw = v1w * newZoom;
    const v2nh = v1h * newZoom;

    // get the offset px & py of view 2
    const v2px = (v1cx - v2ox) / v2ow;
    const v2py = (v1cy - v2oy) / v2oh;

    const left = v1w * v1px - v2nw * v2px;
    const top  = v1h * v1py - v2nh * v2py;

    this.translate(left, top);
  }

  onWheel = (event: WheelEvent) => {
    this.onMouseEvent(event);
    if (event.metaKey) {
      event.preventDefault();
      this.bus.execute(new ZoomAction(event.deltaY / 250));
    } else {
      this.pane(event.deltaX, event.deltaY);
      event.preventDefault();
      this.forceUpdate();
    }
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
    const body = (this.refs as any).isolate.body;
    this.setState({
      canvasWidth  : body.offsetWidth,
      canvasHeight : body.offsetHeight,
      centerLeft   : 0.5,
      centerTop    : 0.5
    });
  }

  onKey = (event) => {
    this.bus.execute(new KeyboardAction(CANVAS_KEY_DOWN, event));
  }

  render() {
    const style = {
      cursor: this.props.editor.cursor
    };

    const canvasWidth  = this.state.canvasWidth;
    const canvasHeight = this.state.canvasHeight;
    const centerLeft   = this.state.centerLeft;
    const centerTop    = this.state.centerTop;

    let transform;

    if (canvasWidth) {
      const { left, top } = this.props.editor.transform;
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
    // TODO - add fixed tools
    const entity = this.props.workspace.file.document.root;
    return (<IsolateComponent ref="isolate" ignoreInputEvents={true} onWheel={this.onWheel} onScroll={this.onScroll} inheritCSS className="m-editor-stage-isolate">
      <style>
        {
          `html, body {
            overflow: hidden;
          }`
        }
      </style>
      <div
        onKeyDown={this.onKey}
        onMouseMove={this.onMouseEvent}
        tabIndex={-1}
        className="m-editor-stage-canvas"
        style={style}
        onMouseDown={this.onMouseDown}>
          <div style={innerStyle} className="noselect" data-previewroot>
              { entity ? <PreviewLayerComponent {...this.props} entity={entity} /> : undefined }
              {this._toolsHidden || !entity ? undefined : <ToolsLayerComponent entity={entity} {...this.props} />}
          </div>
      </div>
    </IsolateComponent>);
  }
}
