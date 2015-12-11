import './index.scss';
import React from 'react';

class FooterComponent extends React.Component {
  render() {

    // TODO - add more project information here such as file name
    // TODO - ability to edit canvas width & height in the footer
    var app = this.props.app;
    return <div className='m-preview-footer'>
      { Math.round(app.preview.zoom * 100) }%
      &nbsp;
      { app.preview.canvasWidth }W x { app.preview.canvasHeight }H
    </div>;
  }
}

export default FooterComponent;
