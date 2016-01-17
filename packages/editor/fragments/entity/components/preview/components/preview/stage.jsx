import './stage.scss';

import React from 'react';
import DropZone from 'react-dropzone';
import ToolsLayerComponent from './tools';
import RegisteredComponent from 'common/components/registered';
import { PREVIEW_STAGE_CLICK, PREVIEW_STAGE_MOUSE_DOWN, UPLOAD_FILE } from 'editor/message-types';

class StageComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  onMouseEvent(event) {
    var p = this._getMousePosition(event);
    this.props.app.notifier.notify({
      ...event,
      type: {
        click: PREVIEW_STAGE_CLICK,
        mousedown: PREVIEW_STAGE_MOUSE_DOWN
      }[event.type],
      x: p.x,
      y: p.y
    });
  }

  _getMousePosition(event) {
    var rect = this.refs.canvas.getBoundingClientRect();

    // FIXME: this code is fine for now, though we are accessing an iframe
    // here which is defined in some other part of the codebase. I.E: we're busting encapsulation here. This will *not* work when we start implementing
    // other rendering engines. The later fix here will be to implement a "Canvas" class, or react component which encapsulates all the preview details such as scrollLeft & scrollTop. That way we still have access *here* without explicitly fetching it from the DOM.
    var iframe = this.refs.canvas.querySelector('iframe');
    var idoc = iframe.contentWindow.document;


    // this math seems very odd. However, rect.left property gets zoomed,
    // whereas the width stays the same. Need to offsets mouse x & y with this.

    var x =  (idoc.body.scrollLeft + event.clientX - rect.left * this.props.app.preview.zoom) / this.props.app.preview.zoom;
    var y =  (idoc.body.scrollTop + event.clientY - rect.top * this.props.app.preview.zoom) / this.props.app.preview.zoom;

    return { x, y };
  }

  componentWillMount() {
    // this.props.app.notifier.push(this);
  }

  componentWillUnmount() {
    this.props.app.notifier.remove(this);
  }


  onDropFile(files, event) {

    var { x, y } = this._getMousePosition(event);

    // needed for positioning items that have
    // been dropped. Nast. Logic should be done here.
    app.setProperties({
      mouseX: x,
      mouseY: y
    });

    files.forEach((file) => {
      this.props.app.notifier.notify({
        type: UPLOAD_FILE,
        file: file
      });
    });
  }

  onScroll(event) {

    // meta key is down, initiate zoom scroll here
    if (event.metaKey) {
      var deltaY = event.deltaY;
      if (deltaY < 0) {
        this.props.app.preview.zoomOut();
      } else if(deltaY > 0) {
        this.props.app.preview.zoomIn();
      }
    } else {

      // otherwise we want to apply a slight hack - turn off pointer
      // events for the tools layer so that scrolling natively works
      // for the iframe
      this.setState({
        scrolling: true
      });

      this.props.app.notifier.notify({ type: 'scroll' });

      clearTimeout(this._scrollTimer);
      this._scrollTimer = setTimeout(() => {
        this.setState({ scrolling: false });
      }, 50);
    }
    event.preventDefault();
  }

  componentWillReceiveProps() {

    // tmp fix - fixes gitteryness. Works for now
    this._center();
    requestAnimationFrame(() => {
      this._center();
    });
  }

  _center() {
    var stage  = this.refs.stage;
    var canvas = this.refs.canvas;
    var canvasOuter = this.refs.canvasOuter;

    var { canvasWidth, canvasHeight, zoom }   = this.props.app.preview;

    var zoomedHeight = canvasHeight * zoom;
    var zoomedWidth  = canvasWidth * zoom;

    var left = stage.offsetWidth / 2 - zoomedWidth / 2;
    var top  = stage.offsetHeight / 2.2 - zoomedHeight / 2;

    canvas.style.zoom = zoom;

    if (zoomedWidth > stage.offsetWidth) {
      canvasOuter.style.width = canvas.style.width = '100%';
      canvasOuter.style.left  = '0px';
    } else {
      canvasOuter.style.width = 'auto';
      canvas.style.width = canvasWidth + 'px';
      canvasOuter.style.left = Math.max(0, left) + 'px';
    }

    if (zoomedHeight > stage.offsetHeight) {
      canvasOuter.style.height = canvas.style.height = '100%';
      canvasOuter.style.top  = '0px';
    } else {
      canvasOuter.style.height = 'auto';
      canvas.style.height = canvasHeight + 'px';
      canvasOuter.style.top = Math.max(0, top) + 'px';
    }
  }

  render() {

    var app = this.props.app;
    var preview = this.props.app.preview;
    var { zoom, canvasWidth, canvasHeight, currentTool } = preview;

    var previewStyle = {
      cursor: currentTool ? currentTool.cursor : void 0
    };

    var entity = this.props.app.rootEntity;

    var toolsStyle = {
      pointerEvents: this.state.scrolling ? 'none' : 'all'
    };

    return <div
      ref='stage'
      className='m-preview-stage'
      style={previewStyle}
      onClick={this.onMouseEvent.bind(this)}
      onMouseDown={this.onMouseEvent.bind(this)}
      onWheel={this.onScroll.bind(this)}>

        <DropZone
          disableClick={true}
          onDrop={this.onDropFile.bind(this)}
          className='m-preview-stage--drop-zone'
          activeClassName='m-preview-stage--drop-zone-active'
          >

        <div className='m-preview-stage--inner'>
          <div
            id='preview-canvas-outer'
            ref='canvasOuter'
            className='m-preview-stage--center'>
              <div
                ref='canvas'
                className='m-preview-stage--canvas'>

                <div id='preview-canvas' ref='drawLayer' className='m-preview-stage--draw-layer'>
                  { entity ? <RegisteredComponent {...this.props} entity={entity} queryOne={{
                    componentType: entity.componentType
                  }} /> : void 0 }
                </div>

              </div>

            { entity ? <ToolsLayerComponent style={toolsStyle} app={app} zoom={preview.zoom} /> : void 0 }
          </div>
        </div>
      </DropZone>

    </div>;
  }
}

export default StageComponent;
