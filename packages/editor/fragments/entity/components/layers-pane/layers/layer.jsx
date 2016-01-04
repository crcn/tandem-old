import './layer.scss';

import cx from 'classnames';
import React from 'react';
import { SetFocusMessage, ToggleFocusMessage } from 'editor/message-types';
import { DragSource, DropTarget } from 'react-dnd';
import { deserialize as deserializeEntity } from 'common/entities';

class DropLayerTargetComponent extends React.Component {
  render() {
    const { accepts, isOver, canDrop, connectDropTarget, lastDroppedItem } = this.props;

    var className = cx({
      'm-layers-pane-component-layer--drop-target': true
    });

    var dropStyle = {};

    if (this.props.bottom) {
      dropStyle.top = 'auto';
      dropStyle.bottom = -2;
    }

    var lineStyle = {
      display: isOver ? 'block' : 'none'
    };

    return connectDropTarget(<div  style={dropStyle} className={className}>
      <div style={lineStyle} className='m-layers-pane-component-layer--drop-target-line'></div>
    </div>);
  }
}

DropLayerTargetComponent = DropTarget('element', {
  canDrop() {
    return true;
  },
  drop({ entity, app, offset }, monitor, component) {

    var item = monitor.getItem();

    // wait for other to remove child
    // TODO - just clone the damn thing and create a new ID
    setTimeout(() => {
      entity.parent.children.splice(
        entity.parent.children.indexOf(entity) + offset,
        0,
        deserializeEntity(item, {}, app.fragments)
      );
    }, 100);
  },
  hover(props, monitor, component) {
    //console.log('hover');
  }
}, function(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
})(DropLayerTargetComponent);

class LayerLabelComponent extends React.Component {

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

  render() {
    const { connectDragSource, isDragging } = this.props;

    var entity     = this.props.entity;
    var expanded   = entity.layerExpanded;

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

    return connectDragSource(<div style={{paddingLeft: this.props.paddingLeft}} tabIndex="0" onClick={this.onClick.bind(this)} className={headerClassName}>
      <DropLayerTargetComponent {...this.props} offset={0} />
      <i onClick={this.toggleExpand.bind(this, !expanded)} className={expandButtonClassName} style={expandButtonStyle} />
      { labelSection }
      <DropLayerTargetComponent {...this.props} bottom={true} offset={1} />
    </div>);
  }
}


var layerSource = {
  beginDrag(props) {
    return props.entity.serialize();
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      console.log('drop');
      props.entity.parent.children.remove(props.entity);
    }
  },
  canDrag() {
    return true;
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

LayerLabelComponent = DragSource('element', layerSource, collect)(LayerLabelComponent);

class LayerComponent extends React.Component {

  render() {


    var entity     = this.props.entity;
    var expanded   = entity.layerExpanded;
    var depth = this.props.depth || 0;
    var paddingLeft =  17 + depth * 12;

    return <div className='m-layers-pane-component-layer'>

      <LayerLabelComponent  paddingLeft={paddingLeft} {...this.props} />

      { expanded ? entity.children.map((child, i) => {
        return <LayerComponent {...this.props} entity={child} key={i} depth={depth + 1}  />
      }) : void 0 }


    </div>;
  }
}

export default LayerComponent;
