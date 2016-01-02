import './layer.scss';

import cx from 'classnames';
import React from 'react';
import { SetFocusMessage } from 'editor/message-types';

class LayerComponent extends React.Component {

  focus() {
    this.props.app.notifier.notify(SetFocusMessage.create(this.props.entity));
  }

  render() {
    var entity  = this.props.entity;
    if (!entity) return <span></span>;

    var depth = this.props.depth || 0;

    var labelStyle = {

      // magic numbers are here defined in CSS
      paddingLeft: 17 + depth * 18
    };

    var labelFragment = this.props.app.fragments.queryOne({
      componentType : 'label',
      labelType     : entity.componentType
    });

    var labelSection;

    if (labelFragment) {
      labelSection = labelFragment.factory.create({
        ...this.props,
        entity: entity
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
      <div style={labelStyle} tabIndex="0" onFocus={this.focus.bind(this)} className={headerClassName}>
        { labelSection }
      </div>
      { entity.children.map((child, i) => {
        return <LayerComponent {...this.props} entity={child} key={i} depth={depth + 1}  />
      })}
    </div>;
  }
}

export default LayerComponent;
