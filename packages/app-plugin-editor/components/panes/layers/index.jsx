import './index.scss';
import React from 'react';
import Node from 'node';
import LayerComponent from './layer.jsx';

class LayersPaneComponent extends React.Component {
  render() {

    var node = Node.create({ label: 'Button', type: 'component' }, [
      Node.create({ label: 'label', type: 'component' }),
      Node.create({ label: 'mouse over', type: 'state' }),
      Node.create({ label: 'hover', type: 'state' })
    ]);

    return <div className='m-layers-pane-component'>
      <LayerComponent node={node} />
    </div>
  }
}

export default LayersPaneComponent;
