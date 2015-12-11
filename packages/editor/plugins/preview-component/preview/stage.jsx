import './stage.scss';

import React from 'react';
import NodeComponent from './node';
import ToolsLayerComponent from './tools';

class StageComponent extends React.Component {

  onClick(event) {

    var rect = this.refs.canvas.getBoundingClientRect();
    var nodeId = event.target.getAttribute('data-node-id');

    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    this.props.app.preview.currentTool.notify({
      type: 'click',
      targetNode: this.props.app.currentSymbol.find(sift({ id: nodeId })),
      x: x,
      y: y
    });
  }

  onDoubleClick(event) {
    // TODO
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
      cursor: preview.currentTool.cursor
    };

    // TODO - canvas needs to have different types of layers

    return <div className='m-preview-stage' style={previewStyle}>
      <div className='m-preview-stage--inner'>
        <div ref='canvas' className='m-preview-stage--canvas' style={canvasStyle}>

          <ToolsLayerComponent app={app} />

          <div className='m-preview-stage--element-layer' onClick={this.onClick.bind(this)} onDoubleClick={this.onDoubleClick.bind(this)}>
            <NodeComponent node={app.currentSymbol} app={app} />
          </div>
        </div>
      </div>
    </div>;
  }
}

export default StageComponent;
