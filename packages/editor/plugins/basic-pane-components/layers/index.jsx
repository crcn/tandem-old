import './index.scss';
import React from 'react';
import Node from 'common/node';
import LayerComponent from './layer.jsx';

class LayersPaneComponent extends React.Component {
  render() {
    return <LayerComponent entity={this.props.app.rootEntity} app={this.props.app} />;
  }
}

export default LayersPaneComponent;
