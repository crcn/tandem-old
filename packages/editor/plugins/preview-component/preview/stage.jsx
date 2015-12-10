import './stage.scss';

import React from 'react';

class StageComponent extends React.Component {

  onClick(event) {
    this.props.app.preview.currentTool.notify({
      type: 'click',
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {

    var app = this.props.app;
    var preview = this.props.app.preview;

    var canvasStyle = {
      width: preview.canvasWidth,
      height: preview.canvasHeight
    };

    var previewStyle = {
      cursor: preview.currentTool.cursor
    };

    return <div className='m-preview-stage' style={previewStyle}>
      <div className='m-preview-stage--canvas' style={canvasStyle} onClick={this.onClick.bind(this)}>
        canvas!
      </div>
    </div>;
  }
}

export default StageComponent;
