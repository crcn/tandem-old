import './layer.scss';

import cx from 'classnames';
import React from 'react';
import { SetFocusMessage, ToggleFocusMessage } from 'editor/message-types';
import { DragSource } from 'react-dnd';

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

  toggleExpand(expand) {

    // store on the entity so that it can be serialized
    this.props.entity.setProperties({
      layerExpanded: expand !== void 0 ? expand : !this.props.entity.layerExpanded
    });
  }

  onKeyDown(event) {

    // TODO - probably want to tie key commands here -- should
    // still be able to nudge elements
    return;

    // right - expand folder
    if (event.keyCode === 39) {
      this.toggleExpand(true);
      event.preventDefault();

      // left collapse
    } else if (event.keyCode === 37) {
      this.toggleExpand(false);
      event.preventDefault();
    }
  }

  render() {
    var entity  = this.props.entity;
    var expanded = entity.layerExpanded;

    var depth = this.props.depth || 0;

    var labelStyle = {

      // magic numbers are here defined in CSS
      paddingLeft: 17 + depth * 12
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
    });

    var expandButtonClassName = cx({
      'm-layers-pane-component-layer--expand-button': true,
      'expanded': !!expanded,
      'ion-arrow-right-b': !expanded,
      'ion-arrow-down-b': expanded
    });

    var expandButtonStyle = {
      'visibility': entity.children.length ? 'visible': 'hidden'
    };

    return <div className='m-layers-pane-component-layer'>
      <div style={labelStyle} tabIndex="0" onClick={this.onClick.bind(this)} className={headerClassName} onKeyDown={this.onKeyDown.bind(this)}>
        <i onClick={this.toggleExpand.bind(this, !expanded)} className={expandButtonClassName} style={expandButtonStyle} />
        { labelSection }
      </div>
      { expanded ? entity.children.map((child, i) => {
        return <LayerComponent {...this.props} entity={child} key={i} depth={depth + 1}  />
      }) : void 0 }
    </div>;
  }
}

var layerSource = {
  beginDrag(props) {
    console.log('trag');
    return {
      text: 'ptext'
    };
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

export default LayerComponent;
//export default DragSource('layer', layerSource, collect)(LayerComponent);
