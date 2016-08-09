import "./index.scss";
import * as React from "react";

import {
  MouseAction,
  CANVAS_KEY_DOWN,
  CANVAS_MOUSE_DOWN,
  KeyboardAction,
  ZoomAction
} from "sf-front-end/actions";
import PreviewLayerComponent from "./preview";
import ToolsLayerComponent from "./tools";
import IsolateComponent  from "sf-front-end/components/isolate";
import { Editor } from "sf-front-end/models";
import { Dependencies, BusDependency } from "sf-core/dependencies";
import { IPosition } from "sf-core/geom";

export default class EditorStageLayersComponent extends React.Component<{ editor: Editor, dependencies: Dependencies, zoom: number }, any> {

  private _mousePosition: IPosition;
  private _toolsHidden: any;
  private _previousZoom: number;

  constructor(props) {
    super(props);
    this.state = { pane: { left: 0, top: 0 }};
  }

  onMouseDown = (event) => {
    this.bus.execute(new MouseAction(CANVAS_MOUSE_DOWN, event));
  }

  get bus() {
    return BusDependency.getInstance(this.props.dependencies);
  }

  pane(leftDelta, topDelta) {
    this.setState({
      pane: {
        left: this.state.pane.left - leftDelta,
        top: this.state.pane.top - topDelta
      }
    });
  }

  onMouseEvent = (event: MouseEvent) => {
    this._mousePosition = {
      left: event.pageX,
      top: event.pageY
    };
  }

  // componentWillUpdate(props) {
  //   if (props.zoom !== this.props.zoom) {
  //     this._center(this.props.zoom, props.zoom);
  //   }
  // }

  // _center = (oldZoom, newZoom) => {

  //   const canvasLeft = this.state.canvasWidth / 2;
  //   const canvasTop  = this.state.canvasHeight / 2;

  //   const newLeft = this._mousePosition.left + canvasLeft;
  //   const newTop  = this._mousePosition.top  + canvasTop;

  //   this.setState({
  //     centerLeft: this.state.centerLeft + (newLeft - this.state.centerLeft) / 100,
  //     centerTop: this.state.centerTop + (newTop - this.state.centerTop) / 100
  //   });

  //   console.log(newLeft, newTop);
  // }

  onWheel = (event: WheelEvent) => {
    this.onMouseEvent(event);
    if (event.metaKey) {
      event.preventDefault();
      this.bus.execute(new ZoomAction(event.deltaY / 250));
    } else {
      this.pane(event.deltaX, event.deltaY);
      event.preventDefault();
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
      centerLeft   : body.offsetWidth / 2,
      centerTop    : body.offsetTop / 2
    });
  }

  onKey = (event) => {
    this.bus.execute(new KeyboardAction(CANVAS_KEY_DOWN, event));
  }

  render() {
    const style = {
      cursor: this.props.editor.currentTool.cursor
    };
    const canvasWidth  = this.state.canvasWidth;
    const canvasHeight  = this.state.canvasHeight;

    let transform;

    if (canvasWidth) {
      const left = this.state.centerLeft - ((this.state.centerLeft*2 - this.state.pane.left) * this.props.zoom) / 2;
      const top  = this.state.centerTop - ((this.state.centerTop*2 - this.state.pane.top) * this.props.zoom) / 2;
      transform = `translate(${left}px, ${top}px) scale(${this.props.zoom})`;
    }

    const innerStyle = {
      transform: transform,
      transformOrigin: "top left",
      position: "absolute",
      width: "100%",
      height: "100%"
    };

    const entity = this.props.editor.file.entity;
    if (!entity) return null;

    return (<IsolateComponent ref="isolate" onWheel={this.onWheel} onScroll={this.onScroll} inheritCSS className="m-editor-stage-isolate">
      <div
        onKeyDown={this.onKey}
        onMouseMove={this.onMouseEvent}
        tabIndex={-1}
        className="m-editor-stage-canvas"
        style={style}
        onMouseDown={this.onMouseDown}>
          <div style={innerStyle}>
              <PreviewLayerComponent {...this.props} entity={entity} />
          </div>
          {this._toolsHidden ? void 0 : <ToolsLayerComponent entity={entity} {...this.props} />}
      </div>
    </IsolateComponent>);
  }
}
