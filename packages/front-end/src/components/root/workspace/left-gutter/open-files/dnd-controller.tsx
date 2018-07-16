import { LayerControllerOuterProps } from "./layer-controller";
import { getContentNode } from "./utils";
import { TreeMoveOffset, containsNestedTreeNodeById } from "tandem-common";
import { DropTarget } from "react-dnd";
import { InspectorNode } from "../../../../../state/pc-inspector-tree";
import { getPCNode } from "paperclip";

export const withNodeDropTarget = (offset: TreeMoveOffset) =>
  DropTarget(
    "INSPECTOR_NODE",
    {
      canDrop: (
        { inspectorNode, contentNode, graph }: LayerControllerOuterProps,
        monitor
      ) => {
        contentNode = getContentNode(inspectorNode, contentNode, graph);
        const draggingNode = monitor.getItem() as InspectorNode;
        const contentSourceNode =
          contentNode && getPCNode(contentNode.sourceNodeId, graph);

        const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);
        return (
          !contentSourceNode ||
          containsNestedTreeNodeById(sourceNode.id, contentSourceNode)
        );
      },
      drop: ({ dispatch, inspectorNode }, monitor) => {
        // dispatch(
        //   treeLayerDroppedNode(
        //     monitor.getItem() as TreeNode<any>,
        //     node,
        //     offset
        //   )
        // );
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
