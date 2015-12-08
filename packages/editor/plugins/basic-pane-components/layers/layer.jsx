import './layer.scss';
import React from 'react';

class LayerComponent extends React.Component {
  render() {
    var node  = this.props.node;
    if (!node) return <span></span>;
      
    var depth = this.props.depth || 0;

    var labelStyle = {
      paddingLeft: 15 + depth * 15
    };

    return <div className='m-layers-pane-component-layer'>
      <div style={labelStyle} className={'m-layers-pane-component-layer--header m-layer-type-' + node.type}>
        <span>
          <i className={'s s-' + node.icon } />
          { node.label }
        </span>
      </div>
      { node.children.map(function(child, i) {
        return <LayerComponent node={child} key={i} depth={depth + 1} />
      })}
    </div>;
  }
}

export default LayerComponent;
