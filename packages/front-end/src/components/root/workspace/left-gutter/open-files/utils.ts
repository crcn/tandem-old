import { InspectorNode } from "../../../../../state/pc-inspector-tree";
import { DependencyGraph, getPCNode, PCSourceTagNames } from "paperclip";

export const getContentNode = (
  inspectorNode: InspectorNode,
  contentNode: InspectorNode,
  graph: DependencyGraph
) => {
  return (
    contentNode ||
    (getPCNode(inspectorNode.sourceNodeId, graph).name !==
    PCSourceTagNames.MODULE
      ? inspectorNode
      : null)
  );
};
