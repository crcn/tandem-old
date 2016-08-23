import "./layer.scss";

import * as cx from "classnames";
import * as React from "react";
import { Action } from "sf-core/actions";
import { Workspace } from "sf-front-end/models";
import { MetadataKeys } from "sf-front-end/constants";
import { Dependencies } from "sf-core/dependencies";
import { FrontEndApplication } from "sf-front-end/application";
import { flatten, intersection } from "lodash";
import { IEntity, IContainerEntity, IVisibleEntity } from "sf-core/entities";
import { SelectAction, ToggleSelectAction, SELECT } from "sf-front-end/actions";
import { LayerLabelComponentFactoryDependency } from "sf-front-end/dependencies";
import { DragSource, DropTarget, DndComponent } from "react-dnd";

interface ILayerLabelProps {
  paddingLeft?: number;
  dependencies: Dependencies;
  workspace: Workspace;
  app: FrontEndApplication;
  entity: IEntity;
  connectDragSource: Function;
  isDragging: boolean;
  connectDropTarget: Function;
  isOver: boolean;
  canDrop: boolean;
}

class LayerLabelComponent extends React.Component<ILayerLabelProps, any> {

  constructor() {
    super();
    this.state = {};
  }

  onClick(event) {

    const { entity, workspace } = this.props;
    const rootEntity = workspace.file.document.root;

    const selection = workspace.selection || [];
    let select  = [];
    let multiSelect = false;

    // shift select range
    if (event.shiftKey && selection.length) {

      const allEntities = [];

      // capture only open entities
      function each(entity: IEntity) {
        allEntities.push(entity);
        if (entity.metadata.get(MetadataKeys.LAYER_EXPANDED) && entity.hasOwnProperty("childNodes")) {
          (entity as IContainerEntity).childNodes.forEach(each);
        }
      }

      (rootEntity as IContainerEntity).childNodes.forEach(each);

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

        const entityChildren = flatten((entity as IContainerEntity).childNodes.map(function(entity) {
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

    this.props.app.bus.execute(new ToggleSelectAction(select, multiSelect));
  }

  toggleExpand(expand, event) {

    // store on the entity so that it can be serialized
    this.props.entity.metadata.toggle(MetadataKeys.LAYER_EXPANDED);

    if (event) event.stopPropagation();
  }

  onMouseOver = (event) => {
    this.setState({
      hover: true
    });
    this.props.app.metadata.set(MetadataKeys.HOVER_ITEM, this.props.entity);
  }

  onMouseOut = (event) => {
    this.setState({
      hover: false
    });

    this.props.app.metadata.set(MetadataKeys.HOVER_ITEM, undefined);
  }

  render() {
    const { connectDragSource, isDragging, connectDropTarget, isOver, canDrop, entity, dependencies, workspace } = this.props;

    const expanded   = entity.metadata.get(MetadataKeys.LAYER_EXPANDED);

    const selection = workspace.selection;
    const displayType = (entity as IVisibleEntity).displayType;

    const labelDependency = LayerLabelComponentFactoryDependency.find(displayType || entity.type, dependencies);

    let labelSection;

    if (labelDependency)  {
      labelSection = labelDependency.create(Object.assign({}, this.props, {
        entity: entity,
        connectDragSource
      }));
    } else {
      labelSection = <span>
        { entity.nodeName }
      </span>;
    }

    const headerClassName = cx({
      "m-layers-pane-component-layer--header": true,
      "drag-over": isOver && canDrop,
      "hover": this.props.app.metadata.get(MetadataKeys.HOVER_ITEM) === this.props.entity && !this.state.hover,
      ["m-layer-type-" + entity.type]: true,
      ["m-layer-component-type-" + displayType]: true,
      "selected": selection && selection.indexOf(entity) !== -1
    });

    const expandButtonClassName = cx({
      "m-layers-pane-component-layer--expand-button": true,
      "expanded": !!expanded,
      "ion-arrow-right-b": !expanded,
      "ion-arrow-down-b": expanded
    });

    const expandButtonStyle = {
      "visibility": ((entity as IContainerEntity).childNodes || []).length ? "visible" : "hidden"
    };

    labelSection =  <div
      style={{paddingLeft: this.props.paddingLeft}}
      tabIndex="0"
      onClick={this.onClick.bind(this)}
      onMouseOver={this.onMouseOver}
      onMouseOut={this.onMouseOut}
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
  drop(args: { entity: IEntity, app: FrontEndApplication, offset: any }, monitor, component) {
    const { entity, app, offset } = args;

    app.bus.execute(new SelectAction([], false));

    const data = monitor.getItem() as any;

    const item = app.workspace.file.document.root.flatten().find(function(entity: IEntity) {
      return entity.metadata.get("dragSourceId") === data.id;
    }) as IEntity;

    if (entity === item) return;


    (item.parentNode as any as IEntity).source.removeChild(item.source);

    // then add it
    (entity.parentNode as IContainerEntity).source.childNodes.splice(
      (entity.parentNode as IContainerEntity).source.childNodes.indexOf(entity.source) + offset,
      0,
      item.source
    );

    app.workspace.file.save();

    app.bus.execute(new SelectAction([item], false));
  },
  hover(props, monitor, component) {
    // props.app.metadata.set(MetadataKeys.HOVER_ITEM, props.entity);
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
    props.entity.metadata.set("dragSourceId", Date.now());
    return { id: props.entity.metadata.get("dragSourceId") };
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
LayerDndLabelComponent = DropTarget("element", {
  canDrop({ entity }, monitor) {
    return entity.metadata.get("dragSourceId") !== (monitor.getItem() as any).id;
  },
  drop(props: { entity: IEntity, app: FrontEndApplication, offset }, monitor, component) {

    const { entity, app } = props;
    app.bus.execute(new SelectAction([], false));
    const data = monitor.getItem() as any;
    const item = app.workspace.file.document.root.flatten().find(function(entity: IEntity) {
      return entity.metadata.get("dragSourceId") === data.id;
    }) as IEntity;

    entity.metadata.set(MetadataKeys.LAYER_EXPANDED, true);
    (item.parentNode as any as IEntity).source.removeChild(item.source);
    (entity as IContainerEntity).source.appendChildNodes(item.source);
    app.workspace.file.save();
    app.bus.execute(new SelectAction([item], false));
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
})(LayerDndLabelComponent);

export default class LayerComponent extends React.Component<{ app: FrontEndApplication, entity: IEntity, depth: number }, any> {

  componentDidMount() {
    this.props.app.bus.register(this);
  }

  execute(action: Action) {

    // when the select action is executed, take all items
    // and ensure that the parent is expanded. Not pretty, encapsulated, and works.
    if (action.type === SELECT) {
      (action as SelectAction).items.forEach((item: IEntity) => {
        let p = item;
        while (p) {
          p.metadata.set(MetadataKeys.LAYER_EXPANDED, true);
          p = p.parentNode as any as IEntity;
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.app.bus.unregister(this);
  }

  render() {

    const entity     = this.props.entity;
    const expanded   = entity.metadata.get(MetadataKeys.LAYER_EXPANDED);
    const depth = this.props.depth || 0;
    const paddingLeft =  17 + depth * 12;

    return <div className="m-layers-pane-component-layer">

      <LayerDndLabelComponent paddingLeft={paddingLeft} {...this.props} />

      { expanded ? ((entity as IContainerEntity).childNodes || []).map((child: IEntity, i) => {
        return <LayerComponent {...this.props} entity={child} key={i} depth={depth + 1}  />;
      }) : undefined }

    </div>;
  }
}
