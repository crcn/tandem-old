import "./layer.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/models";
import { MetadataKeys } from "@tandem/editor/constants";
import { FrontEndApplication } from "@tandem/editor/application";
import { flatten, intersection } from "lodash";
import { LayerLabelComponentFactoryDependency } from "@tandem/editor/dependencies";
import { DragSource, DropTarget, DndComponent } from "react-dnd";
import { SelectAction, ToggleSelectAction } from "@tandem/editor/actions";
import {
  Action,
  IActor,
  IEntity,
  CallbackBus,
  Dependencies,
  flattenTree,
  METADATA_CHANGE,
  traverseTree,
  findTreeNode,
  MetadataChangeAction,
  appendSourceChildren,
  insertSourceChildren,
} from "@tandem/common";

import {
  SyntheticDOMNode
} from "@tandem/synthetic-browser";

interface ILayerLabelProps {
  paddingLeft?: number;
  dependencies: Dependencies;
  app: FrontEndApplication;
  node: SyntheticDOMNode;
  connectDragSource: Function;
  isDragging: boolean;
  connectDropTarget: Function;
  isOver: boolean;
  canDrop: boolean;
}

function getLayerChildren(entity: IEntity) {
  return entity[entity.metadata.get(MetadataKeys.CHILD_LAYER_PROPERTY) || "children"];
}

class LayerLabelComponent extends React.Component<ILayerLabelProps, any> {

  constructor() {
    super();
    this.state = {};
  }

  onClick = (event) => {

    const { node, app } = this.props;
    const { editor } = app;

    const selection = editor.selection || [];
    let select  = [];
    let multiSelect = false;

    // shift select range
    if (event.shiftKey && selection.length) {

      const allEntities = [];

      traverseTree(editor.document, (child) => {
        allEntities.push(child);
        return child.metadata.get(MetadataKeys.LAYER_EXPANDED);
      });


      const currentlySelectedEntity = selection[selection.length - 1];
      const index1 = allEntities.indexOf(node);
      const index2 = allEntities.indexOf(currentlySelectedEntity);
      select = allEntities.slice(Math.min(index1, index2), Math.max(index1, index2) + 1);

    } else {

      select = [node];

      // selecting individual components
      multiSelect = event.metaKey;

      if (multiSelect) {

        const allSelectedChildren = flatten(selection.map(function(entity) {
          return entity;
        }));

        const entityChildren = flatten((node).children.map(function(entity) {
          return flattenTree(entity);
        }));

        // selecting a child
        if (~allSelectedChildren.indexOf(node) && !~selection.indexOf(node)) {
          multiSelect = false;
        } else if (intersection(entityChildren, selection).length) {

          // do not allow selection
          return;
        }
      }
    }

    this.props.app.bus.execute(new SelectAction(select, multiSelect, false));
  }

  onHeaderKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 13 || event.keyCode === 27) {
      if (!this.props.node.metadata.toggle(MetadataKeys.EDIT_LAYER)) {

        // re-focus on header so that the user hit enter again to edit
        // the input
        (this.refs as any).header.focus();
      }
    }
  }

  toggleExpand(expand, event) {

    // store on the entity so that it can be serialized
    this.props.node.metadata.toggle(MetadataKeys.LAYER_EXPANDED);

    if (event) event.stopPropagation();
  }

  onMouseOver = (event) => {
    this.setState({
      hover: true
    });
    this.props.node.metadata.set(MetadataKeys.HOVERING, true);
  }

  onMouseOut = (event) => {
    this.setState({
      hover: false
    });

    this.props.node.metadata.set(MetadataKeys.HOVERING, false);
  }

  addNewChild = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("add new child button. Make this a drop menu with options");
  }

  render() {
    const { connectDragSource, isDragging, connectDropTarget, isOver, canDrop, node, dependencies, app } = this.props;

    const expanded   = node.metadata.get(MetadataKeys.LAYER_EXPANDED);

    const selection = app.editor.selection;
    const layerName = node.metadata.get(MetadataKeys.LAYER_DEPENDENCY_NAME); // || node.source.constructor.name;

    const labelDependency = LayerLabelComponentFactoryDependency.find(layerName, dependencies) || LayerLabelComponentFactoryDependency.find(node.constructor.name, dependencies);

    let labelSection;

    if (labelDependency)  {
      labelSection = labelDependency.create(Object.assign({}, this.props, {
        node: node,
        connectDragSource
      }));
    } else {
      labelSection = <span>
        { /*node.source.constructor.name */ }
      </span>;
    }

    const selected = selection && selection.indexOf(node) !== -1;

    const headerClassName = cx({
      "layer": true,
      "m-layers-pane-component-layer--header": true,
      "drag-over": isOver && canDrop,
      "hover": this.props.node.metadata.get(MetadataKeys.HOVERING) && !this.state.hover && !selected,
      ["m-layer-component-type-" + layerName]: true,
      "selected": selected
    });

    const expandButtonClassName = cx({
      "m-layers-pane-component-layer--expand-button": true,
      "expand-arrow": true,
      "expanded": !!expanded,
      "ion-arrow-right-b": !expanded,
      "ion-arrow-down-b": expanded
    });

    const expandButtonStyle = {
      "visibility": node.children.length ? "visible" : "hidden"
    };

    labelSection =  <div
      style={{paddingLeft: this.props.paddingLeft}}
      tabIndex="0"
      ref="header"
      onClick={this.onClick}
      onKeyDown={this.onHeaderKeyDown}
      onMouseOver={this.onMouseOver}
      onMouseOut={this.onMouseOut}
      className={headerClassName}>
      <DropLayerTargetComponent {...this.props} offset={0} />
      {
        connectDropTarget(<span>
          <i onClick={this.toggleExpand.bind(this, !expanded)} className={expandButtonClassName} style={expandButtonStyle} />
          { labelSection }
          <span className="m-layers-pane-component-layer--add-child-button" onClick={this.addNewChild}>+</span>
        </span>)
      }

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

    const item = null; // findTreeNode(app.editor.document, (node) => node )


    if (entity === item) return;

    (async () => {
      (item.parent as any as IEntity).source.removeChild(item.source);
      const newChildren = await insertSourceChildren(entity.parent as IEntity, (entity.parent as IEntity).source.children.indexOf(entity.source) + offset, item.source);
      app.bus.execute(new SelectAction(newChildren, false));
    })();
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
    const item = null; // TODO - find

    // wrap so that react-dnd doesn't barf on a promise return
    (async () => {
      entity.metadata.set(MetadataKeys.LAYER_EXPANDED, true);
      (item.parent as any as IEntity).source.removeChild(item.source);
      app.bus.execute(new SelectAction(await appendSourceChildren(entity as IEntity, item.source), false));
    })();
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

export default class LayerComponent extends React.Component<{ app: FrontEndApplication, node: SyntheticDOMNode, depth: number }, any> {

  private _entityObserver: IActor;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.app.bus.register(this);
    // this.props.entity.observe(this._entityObserver);
  }

  execute(action: Action) {
    // when the select action is executed, take all items
    // and ensure that the parent is expanded. Not pretty, encapsulated, and works.
    if (action.type === SelectAction.SELECT) {
      (action as SelectAction).items.forEach((item: IEntity) => {
        let p = item.parent as IEntity;
        while (p) {
          p.metadata.set(MetadataKeys.LAYER_EXPANDED, true);
          p = p.parent as IEntity;
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.app.bus.unregister(this);
    this.props.node.unobserve(this);
  }

  render() {

    const node            = this.props.node;

    if (!node) return null;

    const expanded          = node.metadata.get(MetadataKeys.LAYER_EXPANDED);
    const hidden            = node.metadata.get(MetadataKeys.HIDDEN);
    const depth = this.props.depth || 0;
    const paddingLeft =  17 + depth * 12;

    const renderChildren = (depth: number) => {
      return node.children.map((child: SyntheticDOMNode, i) => {
        return <LayerComponent {...this.props} node={child} key={i} depth={depth}  />;
      });
    };

    if (hidden) {
      return <span>{renderChildren(depth)}</span>;
    }

    return <div className="m-layers-pane-component-layer">
      <LayerDndLabelComponent paddingLeft={paddingLeft} {...this.props} />
      { expanded ? renderChildren(depth + 1) : undefined }
    </div>;
  }
}
