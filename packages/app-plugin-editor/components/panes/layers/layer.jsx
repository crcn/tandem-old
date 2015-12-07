import './layer.scss';
import React from 'react';

class LayerComponent extends React.Component {
  render() {
    var node  = this.props.node;
    var depth = this.props.depth || 0;

    var labelStyle = {
      paddingLeft: 15 + depth * 15
    };

    return <div className='m-layers-pane-component-layer'>
      <div style={labelStyle} className='m-layers-pane-component-layer--header'>
        <span>{ node.label }</span>
      </div>
      { node.children.map(function(child, i) {
        return <LayerComponent node={child} key={i} depth={depth + 1} />
      })}
    </div>;
  }
}

export default LayerComponent;
