import './index.scss';

import Node from 'saffron-common/node';
import React from 'react';
import PaneComponent from 'saffron-common/components/pane';
import LayerComponent from './layer.jsx';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class LayersPaneComponent extends React.Component {
  render() {
    if (!this.props.app.rootEntity) return null;
    return <PaneComponent label={this.props.fragment.label}>
      <LayerComponent entity={this.props.app.rootEntity} app={this.props.app} />
    </PaneComponent>;
  }
}

export default DragDropContext(HTML5Backend)(LayersPaneComponent);
