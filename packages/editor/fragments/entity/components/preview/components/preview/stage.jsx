import './stage.scss';

import React from 'react';
import DropZone from 'react-dropzone';
import ToolsLayerComponent from './tools';
import RegisteredComponent from 'common/components/registered';
import { PREVIEW_STAGE_CLICK, PREVIEW_STAGE_MOUSE_DOWN, UPLOAD_FILE } from 'editor/message-types';

class StageComponent extends React.Component {

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

    // this math seems very odd. However, rect.left property gets zoomed,
    // whereas the width stays the same. Need to offsets mouse x & y with this.

    var x = (event.clientX - rect.left * this.props.app.preview.zoom) / this.props.app.preview.zoom;
    var y = (event.clientY - rect.top * this.props.app.preview.zoom) / this.props.app.preview.zoom;

    return { x, y };
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
    var canvas = this.refs.canvas;
    canvas.scrollLeft += event.deltaX;
    canvas.scrollTop += event.deltaY;

    // vanilla notification to re-render the DOM
    this.props.app.notifier.notify({ type: 'canvasScrolled' });

    event.preventDefault();
  }

  render() {

    var app = this.props.app;
    var preview = this.props.app.preview;
    var { zoom, canvasWidth, canvasHeight, currentTool } = preview;

    var canvasStyle = {

      // necessary to ensure that percentages work for
      // child elements - especially when converting units.
      position: 'relative',

      // TODO - this needs to be based off of room symbol
      width  : canvasWidth,
      height : canvasHeight,
      zoom   : zoom
    };

    var previewStyle = {
      cursor: currentTool ? currentTool.cursor : void 0
    };

    var entity = this.props.app.rootEntity;

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
        <div
          id='preview-canvas-outer'
          className='m-preview-stage--center'>
            <div
              ref='canvas'
              className='m-preview-stage--canvas'
              style={canvasStyle}>

              <div id='preview-canvas' ref='drawLayer' className='m-preview-stage--draw-layer'>
                { entity ? <RegisteredComponent {...this.props} entity={entity} queryOne={{
                  componentType: entity.componentType
                }} /> : void 0 }
              </div>

            </div>

          { entity ? <ToolsLayerComponent app={app} zoom={preview.zoom} /> : void 0 }
        </div>
      </DropZone>

    </div>;
  }
}

export default StageComponent;
