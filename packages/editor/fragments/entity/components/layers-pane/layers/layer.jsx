import './layer.scss';

import cx from 'classnames';
import React from 'react';
import flatten from 'lodash/array/flatten';
import intersection from 'lodash/array/intersection';
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
    app.notifier.notify(SetFocusMessage.create([], false));

    var data = monitor.getItem();

    // model data is a pojo, so we need to find it somewhere from the root entity
    var item = app.rootEntity.find(function(entity) {
      return entity.id === data.props.id;
    });

    if (entity === item) return;

    item.parent.children.remove(item);

    // then add it
    entity.parent.children.splice(
      entity.parent.children.indexOf(entity) + offset,
      0,
      item
    );


    app.notifier.notify(SetFocusMessage.create([item], false));
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

  constructor() {
    super();
    this.state = {};
  }

  onClick(event) {

    var entity = this.props.entity;
    var selection = this.props.app.selection || [];
    var select  = [];
    var multiSelect = false;

    // shift select range
    if (event.shiftKey && selection.length) {

      var allEntities = [];

      // capture only open entities
      function each(entity) {
        allEntities.push(entity);
        if (entity.layerExpanded) {
          entity.children.forEach(each);
        }
      }

      each(this.props.app.rootEntity);

      var currentlySelectedEntity = selection[selection.length - 1];
      var index1 = allEntities.indexOf(entity);
      var index2 = allEntities.indexOf(currentlySelectedEntity);
      select = allEntities.slice(Math.min(index1, index2), Math.max(index1, index2) + 1);

      // parents and children CANNOT be selected. Remove parents from the selection list
      select.concat().forEach(function(entity) {
        var i;
        if (entity.parent && ~( i = select.indexOf(entity.parent))) {
          select.splice(i, 1);
        }
      });
    } else {

      select = [entity];

      // selecting individual components
      multiSelect = event.metaKey;

      if (multiSelect) {

        var allSelectedChildren = flatten(selection.map(function(entity) {
          return entity.flatten();
        }));

        var entityChildren = flatten(entity.children.map(function(entity) {
          return entity.flatten();
        }))

        // selecting a child
        if (~allSelectedChildren.indexOf(entity) && !~selection.indexOf(entity)) {
          multiSelect = false;
        } else if (intersection(entityChildren, selection).length) {

          // do not allow selection
          return;
        }
      }
    }

    this.props.app.notifier.notify(ToggleFocusMessage.create(select, multiSelect));
  }

  toggleExpand(expand, event) {

    // store on the entity so that it can be serialized
    this.props.entity.setProperties({
      layerExpanded: expand !== void 0 ? expand : !this.props.entity.layerExpanded
    });

    //console.log(event);
    if (event) event.stopPropagation();
  }

  onMouseOver(event) {
    this.setState({
      hover: true
    });

    this.props.app.setProperties({
      hoverItem: this.props.entity
    });
  }

  onMouseOut(event) {
    this.setState({
      hover: false
    });

    this.props.app.setProperties({
      hoverItem: void 0
    });
  }

  render() {
    const { connectDragSource, isDragging, connectDropTarget, isOver, canDrop } = this.props;

    var entity     = this.props.entity;
    var expanded   = entity.layerExpanded;

    var labelFragment = this.props.app.fragments.queryOne({
      componentType : 'label',
      entityComponentType : entity.componentType
    });

    var labelSection;

    if (labelFragment)  {
      labelSection = labelFragment.factory.create({
        ...this.props,
        entity: entity,
        connectDragSource
      });
    } else {
      labelSection = <span>
        <i className={'s s-' + entity.icon } />
        { entity.label }
      </span>;
    }

    var headerClassName = cx({
      'm-layers-pane-component-layer--header': true,
      'drag-over': isOver && canDrop,
      'hover': this.props.app.hoverItem === this.props.entity && !this.state.hover,
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

    return <div
      style={{paddingLeft: this.props.paddingLeft}}
      tabIndex="0"
      onClick={this.onClick.bind(this)}
      onMouseOver={this.onMouseOver.bind(this)}
      onMouseOut={this.onMouseOut.bind(this)}
      className={headerClassName}>
      <DropLayerTargetComponent {...this.props} offset={0} />
      {connectDropTarget(<span><i onClick={this.toggleExpand.bind(this, !expanded)} className={expandButtonClassName} style={expandButtonStyle} />
      { labelSection }</span>)}
      <DropLayerTargetComponent {...this.props} bottom={true} offset={1} />
    </div>;
  }
}


var layerSource = {
  beginDrag(props) {
    return props.entity.serialize();
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



LayerLabelComponent = DropTarget('element', {
  canDrop({ entity }, monitor) {
    return entity.id !== monitor.getItem().props.id;
  },
  drop({ entity, app, offset }, monitor, component) {
    app.notifier.notify(SetFocusMessage.create([], false));
    var data = monitor.getItem();
    var item = app.rootEntity.find(function(entity) {
      return entity.id === data.props.id;
    });
    entity.layerExpanded = true;
    entity.children.push(item);
    app.notifier.notify(SetFocusMessage.create([item], false));
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
})(LayerLabelComponent);

class LayerComponent extends React.Component {

  componentDidMount() {
    // this.props.entity.notifier.push(this);
  }

  notify() {
    // this._invalidateCache = true;
  }

  componentWillUnmount() {
    // this.props.entity.notifier.remove(this);
  }

  // shouldComponentUpdate() {
  //   return this._invalidateCache;
  // }

  render() {

    // this._invalidateCache = false;

    var entity     = this.props.entity;
    var expanded   = entity.layerExpanded;
    var depth = this.props.depth || 0;
    var paddingLeft =  17 + depth * 12;

    return <div className='m-layers-pane-component-layer'>

      <LayerLabelComponent paddingLeft={paddingLeft} {...this.props} />

      { expanded ? entity.children.map((child, i) => {
        return <LayerComponent {...this.props} entity={child} key={i} depth={depth + 1}  />
      }) : void 0 }

    </div>;
  }
}

export default LayerComponent;
