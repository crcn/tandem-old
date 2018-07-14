import {
  DependencyGraph,
  PCNode,
  PCSourceTagNames,
  getPCNode,
  extendsComponent,
  SyntheticNode,
  SyntheticDocument,
  PCComponentInstanceElement,
  PCComponent,
  isVisibleNode,
  isComponent
} from "paperclip";

import {
  TreeNode,
  generateUID,
  EMPTY_ARRAY,
  updateNestedNode,
  flattenTreeNode
} from "tandem-common";
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
  instancePath: string;
  alt?: boolean;
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

export const createInspectorNode = <TName extends InspectorTreeNodeType>(
  name: TName,
  instancePath: string,
  sourceNode: PCNode
): InspectorTreeBaseNode<InspectorTreeNodeType> => {
  return {
    name: name,
    sourceNodeId: sourceNode.id,
    instancePath,
    id: generateUID(),
    children: EMPTY_ARRAY
  };
};

export const isInspectorNode = (node: TreeNode<any>): node is InspectorNode => {
  return (
    node.name === InspectorTreeNodeType.SOURCE_REP ||
    node.name === InspectorTreeNodeType.CONTENT ||
    node.name === InspectorTreeNodeType.SHADOW
  );
};

export const refreshInspectorTree = (
  node: InspectorTreeBaseNode<any>,
  graph: DependencyGraph
): InspectorTreeBaseNode<InspectorTreeNodeType> => {
  const sourceNode = getPCNode(node.sourceNodeId, graph);

  if (!node.expanded) {
    return node;
  }

  if (containsShadow(sourceNode)) {
    const [shadow, ...contents] = node.children as InspectorTreeBaseNode<any>[];
    return {
      ...node,
      children: [
        refreshInspectorTree(shadow, graph)
        // TODO - content
      ]
    };
  }

  return {
    ...node,
    children: sourceNode.children.map(child => {
      const existing = (node.children as InspectorTreeBaseNode<any>[]).find(
        inspectorChild => inspectorChild.sourceNodeId === child.id
      );
      return (
        existing ||
        createInspectorNode(
          InspectorTreeNodeType.SOURCE_REP,
          maybeAddInstancePath(node, graph),
          child
        )
      );
    })
  };
};

const containsShadow = (
  sourceNode: PCNode
): sourceNode is PCComponent | PCComponentInstanceElement => {
  return (
    sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE ||
    (sourceNode.name === PCSourceTagNames.COMPONENT &&
      extendsComponent(sourceNode))
  );
};

const getShadowSlots = (shadow: PCNode) => {
  // TODO - scan for prop bindings
  // return getOverrides(sourceNode).map(override => override.propertyName === PCOverridablePropertyName.CHILDREN);
};

export const expandInspectorNode = (
  node: InspectorNode | SyntheticNode,
  root: InspectorNode,
  graph: DependencyGraph
) => {
  if (!isInspectorNode(node)) {
    throw new Error("TODO");
  }

  if (node.expanded) {
    return root;
  }

  return updateAlts(
    updateNestedNode(node, root, node => {
      const sourceNode = getPCNode(node.sourceNodeId, graph);
      let children: InspectorTreeBaseNode<any>[] = [];

      const childInstancePath = maybeAddInstancePath(node, graph);

      if (containsShadow(sourceNode)) {
        children = [
          createInspectorNode(
            InspectorTreeNodeType.SHADOW,
            childInstancePath,
            getPCNode(sourceNode.is, graph)
          )
          // TODO - get slots here
        ];
      } else {
        children = sourceNode.children
          .filter(child => isVisibleNode(child) || isComponent(child))
          .map(child =>
            createInspectorNode(
              InspectorTreeNodeType.SOURCE_REP,
              childInstancePath,
              child
            )
          );
      }

      return {
        ...node,
        expanded: true,
        children
      };
    })
  );
};

const maybeAddInstancePath = (
  parent: InspectorNode,
  graph: DependencyGraph
) => {
  const sourceNode = getPCNode(parent.sourceNodeId, graph);
  return (
    parent.instancePath +
    (sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE
      ? (parent.instancePath ? "." : "") + sourceNode.id
      : "")
  );
};

export const collapseInspectorNode = (
  node: InspectorNode | SyntheticNode,
  root: InspectorNode
) => {
  if (!isInspectorNode(node)) {
    throw new Error("TODO");
  }

  if (!node.expanded) {
    return node;
  }

  return updateAlts(
    updateNestedNode(node, root, node => {
      return {
        ...node,
        expanded: false,
        children: []
      };
    })
  );
};

export const updateAlts = (root: InspectorNode) => {
  const flattened = flattenTreeNode(root);

  const map = (node: InspectorNode) => {
    return {
      ...node,
      alt: flattened.indexOf(node) % 2 !== 0,
      children: node.children.map(map)
    };
  };

  return map(root);
};
