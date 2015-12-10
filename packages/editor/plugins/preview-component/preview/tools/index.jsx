import './index.scss';
import React from 'react';
import ResizerComponent from './resizer';

class ToolsLayerComponent extends React.Component {
  render() {
    return <div className='m-tools-layer'>
      { this.props.app.focus ? <ResizerComponent app={this.props.app} focus={this.props.app.focus} /> : void 0 }
    </div>;
  }
}

export default ToolsLayerComponent;
