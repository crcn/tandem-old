import { InspectorNode } from "paperclip";
import { DependencyGraph, getPCNode, PCSourceTagNames } from "paperclip";

// export const getContentNode = (
//   inspectorNode: InspectorNode,
//   contentNode: InspectorNode,
//   graph: DependencyGraph
// ) => {
//   return (
//     contentNode ||
//     (getPCNode(inspectorNode.assocSourceNodeId, graph).name !==
//     PCSourceTagNames.MODULE
//       ? inspectorNode
//       : null)
//   );
// };
