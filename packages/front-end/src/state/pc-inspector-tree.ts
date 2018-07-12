import {
  DependencyGraph,
  PCNode,
  PCSourceTagNames,
  getPCNode,
  PCModule,
  PCChildrenOverride,
  PCComponentInstanceElement,
  PCComponent,
  extendsComponent
} from "../../node_modules/paperclip";
import {
  KeyValue,
  containsNestedTreeNodeById,
  EMPTY_ARRAY
} from "../../node_modules/tandem-common";

import { TreeNode, generateUID } from "tandem-common";
// import { SyntheticNode, PCNode, PCModule, PCComponent, DependencyGraph, PCComponentInstanceElement, PCSourceTagNames, PCOverride, PCChildrenOverride } from "paperclip";

// /**
//  * Inspector tree node combines source & synthetic nodes together
//  * for designing & debugging. This exists primarily because source nodes aren't
//  * the best representation for debugging (instances for instances have shadows, bindings, and other dynamic properties), and
//  * Synthetic nodes aren't the best representations either since they can be verbose (repeated items for example), and they don't map well
//  * back to their original source (slotted nodes for example are rendered to their slots, conditional elements may or may not exist).
//  */

export enum InspectorTreeNodeType {
  SOURCE_REP = "source-rep",
  SHADOW = "shadow",
  CONTENT = "content"
}

export type InspectorTreeBaseNode<TType extends InspectorTreeNodeType> = {
  expanded?: boolean;

  id: string;

  alt: boolean;
  sourceNodeId: string;
} & TreeNode<TType>;

export type InspectorSourceRep = {} & InspectorTreeBaseNode<
  InspectorTreeNodeType.SOURCE_REP
>;

export type InspectorShadow = {} & InspectorTreeBaseNode<
  InspectorTreeNodeType.SHADOW
>;

export type InspectorContent = {} & InspectorTreeBaseNode<
  InspectorTreeNodeType.CONTENT
>;

export type InspectorNode =
  | InspectorSourceRep
  | InspectorShadow
  | InspectorContent;

const createSourceRep = (
  name: InspectorTreeNodeType,
  alt: boolean,
  sourceNode: PCNode,
  graph: DependencyGraph
): InspectorTreeBaseNode<InspectorTreeNodeType> => {
  return {
    name: name,
    sourceNodeId: sourceNode.id,
    alt,
    id: generateUID(),
    children: EMPTY_ARRAY
  };
};

export const refreshInspectorTree = (
  node: InspectorNode,
  graph: DependencyGraph
) => {
  if (node.name === InspectorTreeNodeType.SHADOW) {
  }
  if (node.sourceNodeId) {
    const sourceNode = getPCNode(node.sourceNodeId, graph);
    if (!sourceNode) {
      return null;
    }

    return {
      ...node
    };
  }
};

// export const isInspectorNodeExpandable = (node: InspectorNode) => node.name !== InspectorTreeNodeType.TEXT;
// // export const isInspectorNodeMovable = (node: InspectorNode) => node.name !== InspectorTreeNodeType.CONTENT &&

// const createInspectorNodeChildren = (parentSourceNode: PCNode, graph: DependencyGraph): InspectorNode[]  => {
//   const children = [];
//   if (parentSourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE) {
//     return [
//       createInspectorComponentShadow(),
//       // TODO - get slots
//     ];
//   }

//   return children;
// };

// export const expandInspectorNode = (root: InspectorRoot, { id }: InspectorContentNode, graph: DependencyGraph) => {
//   const child = getNestedTreeNodeById(id, root);
//   if (child.expanded) {
//     return root;
//   }

//   return updateNestedNode(root, child, (child) => {
//     return {
//       ...child,
//       children:
//     }
//   });
// };

// export const collapseInspectorNode = (root: InspectorRoot, child: InspectorContentNode, graph: DependencyGraph) => {

// };
