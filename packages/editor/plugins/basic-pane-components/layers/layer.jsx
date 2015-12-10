import './layer.scss';
import React from 'react';
import cx from 'classnames';

class LayerComponent extends React.Component {
  onHeaderClick(event) {
    this.props.app.setFocus(this.props.node);
  }
  render() {
    var node  = this.props.node;
    if (!node) return <span></span>;

    var depth = this.props.depth || 0;

    var labelStyle = {
      paddingLeft: 15 + depth * 15
    };

    var headerClassName = cx({
      'm-layers-pane-component-layer--header': true,
      ['m-layer-type-' + node.type]: true,
      'selected': this.props.app.focus === this.props.node
    })

    return <div className='m-layers-pane-component-layer'>
      <div style={labelStyle} className={headerClassName}  onClick={this.onHeaderClick.bind(this)}>
        <span>
          <i className={'s s-' + node.icon } />
          { node.label }
        </span>
      </div>
      { node.children.map((child, i) => {
        return <LayerComponent node={child} key={i} depth={depth + 1} app={this.props.app} />
      })}
    </div>;
  }
}

export default LayerComponent;
