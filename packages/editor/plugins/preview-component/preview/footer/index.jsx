import './index.scss';
import React from 'react';

class FooterComponent extends React.Component {
  render() {

    // TODO - add more project information here such as file name
    var app = this.props.app;
    return <div className='m-preview-footer'>
      { Math.round(app.preview.zoom * 100) }%
    </div>;
  }
}

export default FooterComponent;
