import './stage.scss';

import React from 'react';

class StageComponent extends React.Component {
    render() {

      var app = this.props.app;

      var style = {
        width: app.previewState.canvasWidth,
        height: app.previewState.canvasHeight
      };

      return <div className='m-preview-stage'>
        <div className='m-preview-stage--canvas' style={style}>
          canvas!
        </div>
      </div>;
    }
}

export default StageComponent;
