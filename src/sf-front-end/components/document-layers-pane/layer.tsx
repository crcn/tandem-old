import "./layer.scss";

import * as cx from "classnames";
import * as React from "react";
import { IEntity } from "sf-core/entities";
import { flatten, intersection } from "lodash";
import { SelectAction, ToggleSelectAction } from "sf-front-end/actions";
import { LayerLabelComponentFactoryDependency } from "sf-front-end/dependencies";
import { DragSource, DropTarget, DndComponent } from "react-dnd";

class LayerLabelComponent extends React.Component<any, any> {

  constructor() {
    super();
    this.state = {};
  }

  onClick(event) {

    const entity = this.props.entity;
    const selection = this.props.app.selection || [];
    let select  = [];
    let multiSelect = false;

    // shift select range
    if (event.shiftKey && selection.length) {

      const allEntities = [];

      // capture only open entities
      function each(entity) {
        allEntities.push(entity);
        if (entity.layerExpanded) {
          entity.children.forEach(each);
        }
      }

      each(this.props.app.rootEntity);

      const currentlySelectedEntity = selection[selection.length - 1];
      const index1 = allEntities.indexOf(entity);
      const index2 = allEntities.indexOf(currentlySelectedEntity);
      select = allEntities.slice(Math.min(index1, index2), Math.max(index1, index2) + 1);

      // parents and children CANNOT be selected. Remove parents from the selection list
      select.concat().forEach(function(entity) {
        let i;
        if (entity.parent && ~(i = select.indexOf(entity.parent))) {
          select.splice(i, 1);
        }
      });
    } else {

      select = [entity];

      // selecting individual components
      multiSelect = event.metaKey;

      if (multiSelect) {

        const allSelectedChildren = flatten(selection.map(function(entity) {
          return entity.flatten();
        }));

        const entityChildren = flatten(entity.children.map(function(entity) {
          return entity.flatten();
        }));

        // selecting a child
        if (~allSelectedChildren.indexOf(entity) && !~selection.indexOf(entity)) {
          multiSelect = false;
        } else if (intersection(entityChildren, selection).length) {

          // do not allow selection
          return;
        }
      }
    }

    this.props.app.notifier.notify(new ToggleSelectAction(select, multiSelect));
  }

  toggleExpand(expand, event) {

    // store on the entity so that it can be serialized
    this.props.entity.setProperties({
      layerExpanded: expand !== void 0 ? expand : !this.props.entity.layerExpanded
    });

    if (event) event.stopPropagation();
  }

  onMouseOver(event) {
    this.setState({
      hover: true
    });

    // this.props.app.setProperties({
    //   hoverItem: this.props.entity
    // });
  }

  onMouseOut(event) {
    this.setState({
      hover: false
    });

    // this.props.app.setProperties({
    //   hoverItem: void 0
    // });
  }

  render() {
    const { connectDragSource, isDragging, connectDropTarget, isOver, canDrop } = this.props;

    const entity     = this.props.entity;
    const expanded   = entity.layerExpanded;
    const dependencies = this.props.dependencies;
    const selection = this.props.selection;

    const labelDependency = LayerLabelComponentFactoryDependency.find(entity.displayType || entity.type, dependencies);

    let labelSection;

    if (labelDependency)  {
      labelSection = labelDependency.create(Object.assign({}, this.props, {
        entity: entity,
        connectDragSource
      }));
    } else {
      labelSection = <span>
        <i className={"s s-" + entity.icon } />
        { entity.label || "Entity" }
      </span>;
    }

    const headerClassName = cx({
      "m-layers-pane-component-layer--header": true,
      "drag-over": isOver && canDrop,
      "hover": this.props.app.hoverItem === this.props.entity && !this.state.hover,
      ["m-layer-type-" + entity.type]: true,
      ["m-layer-component-type-" + entity.componentType]: true,
      "selected": selection && selection.includes(entity)
    });

    const expandButtonClassName = cx({
      "m-layers-pane-component-layer--expand-button": true,
      "expanded": !!expanded,
      "ion-arrow-right-b": !expanded,
      "ion-arrow-down-b": expanded
    });

    const expandButtonStyle = {
      "visibility": (entity.childNodes || []).length ? "visible" : "hidden"
    };

    labelSection =  <div
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

    return labelSection;
  }
}


@DropTarget("element", {
  canDrop() {
    return true;
  },
  drop({ entity, app, offset }, monitor, component) {
    app.notifier.notify(new SelectAction([], false));

    const data = monitor.getItem() as any;

    // model data is a pojo, so we need to find it somewhere from the root entity
    const item = app.rootEntity.find(function(entity) {
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

    app.notifier.notify(new SelectAction([item], false));
  },
  hover(props, monitor, component) {

  }
}, function(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
})
class DropLayerTargetComponent extends React.Component<any, any> {
  render() {
    const { accepts, isOver, canDrop, connectDropTarget, lastDroppedItem } = this.props;

    const className = cx({
      "m-layers-pane-component-layer--drop-target": true
    });

    const dropStyle: any = {};

    if (this.props.bottom) {
      dropStyle.top = "auto";
      dropStyle.bottom = -2;
    }

    const lineStyle = {
      display: isOver ? "block" : "none"
    };

    return connectDropTarget(<div  style={dropStyle} className={className}>
      <div style={lineStyle} className="m-layers-pane-component-layer--drop-target-line"></div>
    </div>);
  }
}


const layerSource = {
  beginDrag(props) {
    return props.entity.serialize();
  },
  canDrag() {
    return true;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

let LayerDndLabelComponent = DragSource("element", layerSource, collect)(LayerLabelComponent);
LayerDndLabelComponent = DropTarget('element', {
  canDrop({ entity }, monitor) {
    return entity.id !== (monitor.getItem() as any).props.id;
  },
  drop({ entity, app, offset }, monitor, component) {
    app.notifier.notify(new SelectAction([], false));
    var data = monitor.getItem() as any;
    var item = app.rootEntity.find(function(entity) {
      return entity.id === data.props.id;
    });
    entity.layerExpanded = true;
    entity.children.push(item);
    app.notifier.notify(new SelectAction([item], false));
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
})(LayerDndLabelComponent);

export default class LayerComponent extends React.Component<any, any> {

  render() {

    const entity     = this.props.entity;
    const expanded   = entity.layerExpanded || true;
    const depth = this.props.depth || 0;
    const paddingLeft =  17 + depth * 12;

    return <div className="m-layers-pane-component-layer">

      <LayerDndLabelComponent paddingLeft={paddingLeft} {...this.props} />

      { expanded ? (entity.childNodes || []).map((child, i) => {
        return <LayerComponent {...this.props} entity={child} key={i} depth={depth + 1}  />;
      }) : undefined }

    </div>;
  }
}
