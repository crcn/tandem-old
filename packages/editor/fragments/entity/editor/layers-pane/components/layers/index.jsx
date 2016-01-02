import './index.scss';

import Node from 'common/node';
import React from 'react';
import PaneComponent from 'common/components/pane';
import LayerComponent from './layer.jsx';

class LayersPaneComponent extends React.Component {
  render() {
    return <PaneComponent label={this.props.fragment.label}>
      <LayerComponent entity={this.props.app.rootEntity} app={this.props.app} />
    </PaneComponent>;
  }
}

export default LayersPaneComponent;
