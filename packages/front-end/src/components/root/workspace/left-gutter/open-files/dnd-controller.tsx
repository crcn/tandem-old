import * as React from "react";
import * as cx from "classnames";
import {
  TreeMoveOffset,
  containsNestedTreeNodeById,
  getNestedTreeNodeById,
  getParentTreeNode
} from "tandem-common";
import { DropTarget } from "react-dnd";
import {
  InspectorNode,
  InspectorTreeNodeName,
  inspectorNodeInShadow
} from "../../../../../state/pc-inspector-tree";
import {
  getPCNode,
  PCSourceTagNames,
  PCNode,
  extendsComponent,
  DependencyGraph,
  getPCNodeModule
} from "paperclip";
import { compose, Dispatch } from "redux";
import { sourceInspectorLayerDropped } from "../../../../../actions";
import { withLayersPaneContext, LayersPaneContextProps } from "./contexts";
import { shouldUpdate } from "recompose";
import {
  getSyntheticNodeInspectorNode,
  getInspectorContentNodeContainingChild
} from "../../../../../state";

export type WithNodeDropTargetProps = {
  inspectorNode: InspectorNode;
};

type WithNodeDropTargetInnerProps = {
  draggedSourceNode: PCNode;
  dispatch: Dispatch;
  graph: DependencyGraph;
  contentNode: InspectorNode;
} & WithNodeDropTargetProps;

export const withDndContext = withLayersPaneContext(
  (
    { inspectorNode }: WithNodeDropTargetProps,
    { dispatch, graph, rootInspectorNode }: LayersPaneContextProps
  ) => {
    getInspectorContentNodeContainingChild;
    getSyntheticNodeInspectorNode;
    return {
      dispatch,
      graph,
      contentNode: getInspectorContentNodeContainingChild(
        inspectorNode,
        rootInspectorNode
      )
    };
  }
);

export const withNodeDropTarget = (offset: TreeMoveOffset) =>
  compose(
    DropTarget(
      "INSPECTOR_NODE",
      {
        canDrop: (
          { inspectorNode, contentNode, graph }: WithNodeDropTargetInnerProps,
          monitor
        ) => {
          const contentSourceNode =
            contentNode && getPCNode(contentNode.assocSourceNodeId, graph);
          const draggingInspectorNode = monitor.getItem() as InspectorNode;
          const draggedSourceNode = getPCNode(
            draggingInspectorNode.assocSourceNodeId,
            graph
          );
          const sourceNode = getPCNode(inspectorNode.assocSourceNodeId, graph);
          const parentSourceNode: PCNode = getParentTreeNode(
            sourceNode.id,
            getPCNodeModule(inspectorNode.assocSourceNodeId, graph)
          );

          if (draggedSourceNode.name === PCSourceTagNames.COMPONENT) {
            return !contentSourceNode;
          }

          if (
            offset === TreeMoveOffset.BEFORE ||
            offset === TreeMoveOffset.AFTER
          ) {
            return (
              parentSourceNode &&
              (parentSourceNode.name !== PCSourceTagNames.COMPONENT_INSTANCE &&
                !extendsComponent(parentSourceNode))
            );
          }

          if (
            offset === TreeMoveOffset.APPEND ||
            offset === TreeMoveOffset.PREPEND
          ) {
            if (
              sourceNode.name === PCSourceTagNames.TEXT ||
              sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE ||
              extendsComponent(sourceNode)
            ) {
              return false;
            }

            return (
              !contentSourceNode ||
              containsNestedTreeNodeById(sourceNode.id, contentSourceNode) ||
              (inspectorNode.name === InspectorTreeNodeName.CONTENT &&
                !inspectorNodeInShadow(inspectorNode, contentNode))
            );
          } else {
            return true;
          }
        },
        drop: ({ dispatch, inspectorNode }, monitor) => {
          dispatch(
            sourceInspectorLayerDropped(
              monitor.getItem() as InspectorNode,
              inspectorNode,
              offset
            )
          );
        }
      },
      (connect, monitor) => {
        return {
          connectDropTarget: connect.dropTarget(),
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop()
        };
      }
    )
  );

export const withHoverVariant = compose(
  shouldUpdate((props: any, next: any) => {
    return (
      props.isOver !== next.isOver ||
      props.connectDropTarget !== next.connectDropTarget
    );
  }),
  (Base: React.ComponentClass<any>) => ({
    isOver,
    canDrop,
    contentNode,
    connectDropTarget,
    ...rest
  }) => {
    return connectDropTarget(
      <div>
        <Base
          {...rest}
          variant={cx({
            hover: canDrop && isOver
          })}
        />
      </div>
    );
  }
);
