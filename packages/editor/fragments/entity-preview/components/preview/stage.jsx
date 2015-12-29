import './stage.scss';

import React from 'react';
import EntityComponent from './entity';
import ToolsLayerComponent from './tools';
import { ENTITY_PREVIEW_CLICK } from 'editor/message-types';

class StageComponent extends React.Component {

  onClick(event) {

    var rect = this.refs.canvas.getBoundingClientRect();
    var nodeId = event.target.getAttribute('data-node-id');

    // this math seems very odd. However, rect.left property gets zoomed,
    // whereas the width stays the same. Need to offsets mouse x & y with this.

    var x = (event.clientX - rect.left * this.props.app.preview.zoom) / this.props.app.preview.zoom;
    var y = (event.clientY - rect.top * this.props.app.preview.zoom) / this.props.app.preview.zoom;

    this.props.app.preview.notify({
      type: ENTITY_PREVIEW_CLICK,
      entity: this.props.app.rootEntity.find(
        sift({ id: nodeId })
      ),
      x: x,
      y: y
    });
  }

  render() {

    var app = this.props.app;
    var preview = this.props.app.preview;

    var canvasStyle = {

      // TODO - this needs to be based off of room symbol
      width  : preview.canvasWidth,
      height : preview.canvasHeight,
      zoom   : preview.zoom
    };

    var previewStyle = {
      cursor: preview.currentTool ? preview.currentTool.cursor : void 0
    };

    // TODO - canvas needs to have different types of layers

    return <div className='m-preview-stage' style={previewStyle}>
      <div className='m-preview-stage--inner'>
        <div ref='canvas' className='m-preview-stage--canvas' style={canvasStyle}>

          <div id='preview-canvas'
            className='m-preview-stage--element-layer'
            role='preview stage'
            onClick={this.onClick.bind(this)}>
            <span ref='drawLayer' className='reset-all m-preview-stage--draw-layer'>
              <EntityComponent entity={app.rootEntity} app={app} />
            </span>
          </div>

          <ToolsLayerComponent app={app} zoom={preview.zoom} />
        </div>
      </div>
    </div>;
  }
}

export default StageComponent;
