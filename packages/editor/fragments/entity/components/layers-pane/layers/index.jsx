import './index.scss';

import Node from 'common/node';
import React from 'react';
import PaneComponent from 'common/components/pane';
import LayerComponent from './layer.jsx';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class LayersPaneComponent extends React.Component {
  render() {
    return <PaneComponent label={this.props.fragment.label}>
      <LayerComponent entity={this.props.app.rootEntity} app={this.props.app} />
    </PaneComponent>;
  }
}

export default DragDropContext(HTML5Backend)(LayersPaneComponent);
