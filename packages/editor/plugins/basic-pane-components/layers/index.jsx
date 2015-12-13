import './index.scss';

import Node from 'common/node';
import React from 'react';
import LayerComponent from './layer.jsx';

class LayersPaneComponent extends React.Component {
  render() {
    return <LayerComponent entity={this.props.app.rootEntity} app={this.props.app} />;
  }
}

export default LayersPaneComponent;
