import "./index.scss";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/stores";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import ToolsLayerComponent from "./tools";
import { IsolateComponent }  from "@tandem/editor/browser/components/common";
import PreviewLayerComponent from "./preview";
import { Injector, PrivateBusProvider } from "@tandem/common";
import { SyntheticDOMElement, SyntheticRendererEvent }  from "@tandem/synthetic-browser";
import { BoundingRect, IPoint, BaseApplicationComponent } from "@tandem/common";
import {
  ZoomRequest,
  MouseAction,
  AlertMessage,
  SetZoomRequest,
  KeyboardAction,
} from "@tandem/editor/browser/messages";
import {
  ImportFileRequest
} from "@tandem/editor/common";

// TODO - most of this logic should be stored within the a child of the workspace
// model.
export default class EditorStageLayersComponent extends BaseApplicationComponent<{ workspace: Workspace, zoom: number }, any> {

  private _mousePosition: IPoint;
  private _toolsHidden: any;
  private _previousZoom: number;

  $didInject() {
    super.$didInject();
    this.state = {};
  }

  onMouseDown = (event) => {
    this.props.workspace.select([]);
  }

  translate(left, top) {
    this.props.workspace.transform.left = left;
    this.props.workspace.transform.top = top;
  }

  onDragEnter = (event: React.DragEvent<any>) =>  {

    // TODO - figure out how to check for text/uri-list
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  onDrop = (event: React.DragEvent<any>) =>  {
    this.onMouseEvent(event);
    event.preventDefault();

    const transform = this.props.workspace.transform;

    const width  = 1024;
    const height = 768;
    const left   = (this._mousePosition.left - transform.left) / transform.scale;
    const top    = (this._mousePosition.top - transform.top) / transform.scale;

    const bounds = new BoundingRect(left, top, left + width, top + height);

    const importURI = async (uri: string) => {
      try {
        await this.bus.dispatch(new ImportFileRequest(uri, bounds, this.props.workspace.document.documentElement));
      } catch(e) {
        this.bus.dispatch(AlertMessage.createErrorMessage(`Cannot import ${uri}: ${e.message}`));
      }
    }

    const url = event.dataTransfer.getData("URL");
    if (url) return url.split("\n").forEach(importURI);

    
    for (let i = event.dataTransfer.items.length; i--;) {
      const file = event.dataTransfer.items[i].getAsFile();
      importURI(file.path);
    }
  }

  onDragExit = (event: React.DragEvent<any>) => {
  }

  pane(leftDelta, topDelta) {
    this.translate(this.props.workspace.transform.left - leftDelta, this.props.workspace.transform.top - topDelta);
  }

  onMouseEvent = (event: React.MouseEvent<any>) => {
    let pageX = event.pageX;
    let pageY = event.pageY;

    this._mousePosition = {
      left: pageX,
      top: pageY
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
      this.bus.dispatch(new ZoomRequest((event.deltaY / 250)));
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

    const workspace =  this.props.workspace;
    const browser = this.props.workspace.browser;

    // TODO: Move this to a data model instead of here -- this is janky.
    const fitToCanvas = () => {
      const entireBounds = BoundingRect.merge(...browser.renderer.getAllBoundingRects());
      const padding = 200;
      const zoom = Math.min((width - padding) / entireBounds.width, (height - padding) / entireBounds.height);
      this.translate(width / 2 - entireBounds.width / 2 - entireBounds.left, height / 2 - entireBounds.height / 2 - entireBounds.top);
      this.bus.dispatch(new SetZoomRequest(zoom, false));
    }


    const renderObserver = {
      dispatch: (action) => {
        if (action.type === SyntheticRendererEvent.UPDATE_RECTANGLES) {
          browser.unobserve(renderObserver);
          fitToCanvas();
        }
      }
    };

    browser.observe(renderObserver);
  }


  onKey = (event) => {
    this.bus.dispatch(new KeyboardAction(KeyboardAction.CANVAS_KEY_DOWN, event));
  }
  onTouchMove = (event: React.TouchEvent<any>) => {
    console.log(event.touches);
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

    return (<IsolateComponent onKeyDown={this.onKey} ref="isolate" scrolling={false} translateMousePositions={false} ignoreInputEvents={true} onWheel={this.onWheel} inheritCSS className="m-editor-stage-isolate">
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
        onDragOver={this.onDragEnter}
        onDrop={this.onDrop}
        onMouseDown={this.onMouseDown}
        tabIndex={-1}
        onDragExit={this.onDragExit}
        className="m-editor-stage-canvas"
        style={style}>
          <div style={innerStyle} className="noselect preview-root" data-previewroot>
            <PreviewLayerComponent renderer={this.props.workspace.browser.renderer} />
            { workspace.document ? <ToolsLayerComponent workspace={workspace} zoom={workspace.zoom} zooming={this.state.zooming} allElements={workspace.documentQuerier.queriedElements} /> : undefined }
          </div>
      </div>
    </IsolateComponent>);
  }
}
