import * as React from "react";
import * as cx from "classnames";
import { LayerControllerOuterProps } from "./layer-controller";
import { getContentNode } from "./utils";
import {
  TreeMoveOffset,
  containsNestedTreeNodeById,
  getNestedTreeNodeById,
  getParentTreeNode
} from "tandem-common";
import { DropTarget } from "react-dnd";
import { InspectorNode } from "../../../../../state/pc-inspector-tree";
import { getPCNode, PCSourceTagNames } from "paperclip";
import { compose } from "redux";
import { sourceInspectorLayerDropped } from "../../../../../actions";

export const withNodeDropTarget = (offset: TreeMoveOffset) =>
  DropTarget(
    "INSPECTOR_NODE",
    {
      canDrop: (
        { inspectorNode, contentNode, graph }: LayerControllerOuterProps,
        monitor
      ) => {
        contentNode = getContentNode(inspectorNode, contentNode, graph);
        const draggingInspectorNode = monitor.getItem() as InspectorNode;
        const draggedSourceNode = getPCNode(
          draggingInspectorNode.sourceNodeId,
          graph
        );
        const contentSourceNode =
          contentNode && getPCNode(contentNode.sourceNodeId, graph);
        const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);

        if (draggedSourceNode.name === PCSourceTagNames.COMPONENT) {
          return !contentSourceNode;
        }

        if (
          offset === TreeMoveOffset.APPEND ||
          offset === TreeMoveOffset.PREPEND
        ) {
          return (
            !contentSourceNode ||
            containsNestedTreeNodeById(sourceNode.id, contentSourceNode)
          );
        } else {
          // const parentSourceNode = getParentTreeNode()
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
  );

export const withHoverVariant = compose(
  Base => ({ isOver, canDrop, connectDropTarget, ...rest }) => {
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
