import "./index.scss";
import * as React from "react";

import { STAGE_CANVAS_MOUSE_DOWN } from "sf-front-end/actions/index";
import PreviewLayerComponent from "./preview/index";
import ToolsLayerComponent from "./tools/index";
import IsolateComponent  from "sf-front-end/components/isolate";
import { PreviewFacade } from "sf-front-end/facades";
import { FragmentDictionary, BusFragment } from "sf-core/fragments";

export default class EditorStageLayersComponent extends React.Component<{ preview: PreviewFacade, fragments: FragmentDictionary }, any> {

  private _mousePosition: any;
  private _toolsHidden: any;
  private _previousZoom: number;

  onMouseDown(event) {
   this.bus.execute(Object.assign({}, event, {
      type: {
        mousedown: STAGE_CANVAS_MOUSE_DOWN
      }[event.type]
    }));
  }

  get bus() {
    return BusFragment.getInstance(this.props.fragments);
  }

  componentWillUpdate(props:any) {
    if (this.props.preview.zoom !== this._previousZoom) {
      this._previousZoom = this.props.preview.zoom;
      requestAnimationFrame(this._center.bind(this, props.zoom, this.props.zoom));
    }
  }

  componentDidMount() {
    const isolateBody = (this.refs as any).isolate.body;
    isolateBody.scrollTop = isolateBody.scrollHeight / 2;
    isolateBody.scrollLeft = isolateBody.scrollWidth / 2;
    this._mousePosition = { left: 0, top: 0 };
  }

  onMouseMove = (event) => {
    this._mousePosition = {
      left: event.pageX,
      top : event.pageY
    };
  }

  onWheel = (event) => {
    this.onMouseMove(event);
    if (event.metaKey) {
      event.preventDefault();
      this.bus.execute({
        type: "zoom",
        delta: event.deltaY / 250
      });
    }
  }

  onScroll = () => {
    if (!this._hideTools()) {
      this.forceUpdate();
    }
  }

  _hideTools() {
    var paused = !!this._toolsHidden;
    if (this._toolsHidden) clearTimeout(this._toolsHidden);
    this._toolsHidden = setTimeout(this._showTools, 100);
    return paused;
  }

  _showTools = () => {
    this._toolsHidden = void 0;
    this.forceUpdate();
  }

  _center = (newZoom, oldZoom) => {

    function calcPrev(value) {
      return Math.round((value / newZoom) * oldZoom);
    }

    const isolateBody = (this.refs as any).isolate.body;

    var newHeight  = isolateBody.scrollHeight;
    var prevHeight = calcPrev(newHeight);

    var newWidth  = isolateBody.scrollWidth;
    var prevWidth = calcPrev(newWidth);

    var changeLeft = (newHeight - prevHeight) / 2;
    var changeTop = (newWidth - prevWidth)   / 2;

    var scrollTop   = isolateBody.scrollTop + changeTop;
    var scrollLeft  = isolateBody.scrollLeft + changeLeft;

    isolateBody.scrollTop = scrollTop;
    isolateBody.scrollLeft = scrollLeft;
    this.forceUpdate();
  }

  render() {

    var style = {
      cursor: this.props.preview.currentTool.cursor
    };

    return (<IsolateComponent ref="isolate" onWheel={this.onWheel} onScroll={this.onScroll} inheritCSS className="m-editor-stage-isolate">
      <div className="m-editor-stage-canvas" onMouseMove={this.onMouseMove} style={style} onMouseDown={this.onMouseDown.bind(this)}>
        <PreviewLayerComponent {...this.props} />
        {this._toolsHidden ? void 0 : <ToolsLayerComponent {...this.props} />}
      </div>
    </IsolateComponent>);
  }
}
