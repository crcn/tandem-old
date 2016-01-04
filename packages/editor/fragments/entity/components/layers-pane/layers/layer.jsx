import './layer.scss';

import cx from 'classnames';
import React from 'react';
import { SetFocusMessage, ToggleFocusMessage } from 'editor/message-types';

class LayerComponent extends React.Component {

  onClick(event) {

    var entity = this.props.entity;
    var selection = this.props.app.selection;
    var select  = [];
    var multiSelect = false;

    // shift select range
    if (event.shiftKey && selection.length) {
      var allEntities = this.props.app.rootEntity.flatten();
      var currentlySelectedEntity = selection[selection.length - 1];
      var index1 = allEntities.indexOf(entity);
      var index2 = allEntities.indexOf(currentlySelectedEntity);
      select = allEntities.slice(Math.min(index1, index2), Math.max(index1, index2) + 1);
    } else {
      select = [entity];

      // selecting individual components
      multiSelect = event.metaKey;
    }


    this.props.app.notifier.notify(ToggleFocusMessage.create(select, multiSelect));
  }

  render() {
    var entity  = this.props.entity;

    var depth = this.props.depth || 0;

    var labelStyle = {

      // magic numbers are here defined in CSS
      paddingLeft: 17 + depth * 10
    };

    var labelFragment = this.props.app.fragments.queryOne({
      componentType : 'label',
      entityComponentType : entity.componentType
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
      'selected': this.props.app.selection && this.props.app.selection.includes(entity)
    })

    return <div className='m-layers-pane-component-layer'>
      <div style={labelStyle} tabIndex="0" onClick={this.onClick.bind(this)} className={headerClassName}>
        { labelSection }
      </div>
      { entity.children.map((child, i) => {
        return <LayerComponent {...this.props} entity={child} key={i} depth={depth + 1}  />
      })}
    </div>;
  }
}

export default LayerComponent;
