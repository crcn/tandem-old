import './index.scss';

import Node from 'common/node';
import React from 'react';
import LayerComponent from './layer.jsx';
import PaneComponent from 'common/components/pane';

class LayersPaneComponent extends React.Component {
  render() {
    return <PaneComponent label={this.props.fragment.label}>
      <LayerComponent entity={this.props.app.rootEntity} app={this.props.app} />
    </PaneComponent>;
  }
}

export default LayersPaneComponent;
