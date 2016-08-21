import './index.scss';

import * React from 'react';
import PaneComponent from 'sf-front-end/components/pane';
import LayerComponent from './layer';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class LayersPaneComponent extends React.Component<any, any> {
  render() {
    if (!this.props.app.rootEntity) return null;
    return <PaneComponent label={this.props.fragment.label}>
      <LayerComponent entity={this.props.app.rootEntity} app={this.props.app} />
    </PaneComponent>;
  }
}

export default DragDropContext(HTML5Backend)(LayersPaneComponent);
