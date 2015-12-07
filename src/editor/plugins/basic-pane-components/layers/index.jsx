import './index.scss';
import React from 'react';
import Node from 'common/node';
import LayerComponent from './layer.jsx';

class LayersPaneComponent extends React.Component {
  render() {

    var node = Node.create({ label: 'Button', type: 'component', icon: 'puzzle' }, [
      Node.create({ label: 'label', type: 'component', icon: 'text' }),
      Node.create({ label: 'mouse over', type: 'state', icon: 'delta' }),
      Node.create({ label: 'hover', type: 'state', icon: 'delta' })
    ]);

    return <LayerComponent node={node} />;
  }
}

export default LayersPaneComponent;
