import './layer.scss';

import cx from 'classnames';
import React from 'react';

class LayerComponent extends React.Component {
  
  onHeaderClick(event) {
    this.props.app.setFocus(this.props.entity);
  }

  render() {
    var entity  = this.props.entity;
    if (!entity) return <span></span>;

    var depth = this.props.depth || 0;

    var labelStyle = {
      paddingLeft: 15 + depth * 15
    };

    var labelPlugin = this.props.app.plugins.queryOne({
      componentType : 'label',
      labelType     : entity.componentType
    });

    var labelSection;

    if (labelPlugin) {
      labelSection = labelPlugin.factory.create({
        entity: entity,
        ...this.props
      });
    } else {
      labelSection = <span>
        <i className={'s s-' + entity.icon } />
        { entity.label }
      </span>;
    }

    var headerClassName = cx({
      'm-layers-pane-component-layer--header': true,
      ['m-layer-type-' + entity.type]: true,
      'selected': this.props.app.focus === entity
    })

    return <div className='m-layers-pane-component-layer'>
      <div style={labelStyle} className={headerClassName}  onClick={this.onHeaderClick.bind(this)}>
        { labelSection }
      </div>
      { entity.children.map((child, i) => {
        return <LayerComponent entity={child} key={i} depth={depth + 1} app={this.props.app} />
      })}
    </div>;
  }
}

export default LayerComponent;
