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
  isComponent,
  getSyntheticInstancePath,
  getOverrides,
  PCChildrenOverride,
  PCOverridablePropertyName
} from "paperclip";

import { last } from "lodash";

import {
  TreeNode,
  generateUID,
  EMPTY_ARRAY,
  updateNestedNode,
  flattenTreeNode,
  containsNestedTreeNodeById,
  getNestedTreeNodeById,
  findNestedNode,
  memoize
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
  ROOT = "root",
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
  children: InspectorTreeBaseNode<any>[];
} & TreeNode<TType>;

export type InspectorRoot = {} & InspectorTreeBaseNode<
  InspectorTreeNodeType.ROOT
>;

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
  | InspectorRoot
  | InspectorSourceRep
  | InspectorShadow
  | InspectorContent;

export const createInspectorNode = <TName extends InspectorTreeNodeType>(
  name: TName,
  instancePath: string,
  sourceNode?: PCNode
): InspectorTreeBaseNode<InspectorTreeNodeType> => {
  return {
    name: name,
    sourceNodeId: sourceNode && sourceNode.id,
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
  return updateAlts(_refreshInspectorTree(node, graph) as InspectorNode);
};

const _refreshInspectorTree = (
  node: InspectorTreeBaseNode<any>,
  graph: DependencyGraph
): InspectorTreeBaseNode<InspectorTreeNodeType> => {
  if (!node.expanded) {
    return { ...node };
  }

  const sourceNode = node.sourceNodeId && getPCNode(node.sourceNodeId, graph);

  // if no source node, then it's likely the root
  if (!sourceNode) {
    return {
      ...node,
      children: node.children.map(child => refreshInspectorTree(child, graph))
    };
  }

  if (containsShadow(sourceNode)) {
    const [shadow, ...contents] = node.children as InspectorTreeBaseNode<any>[];
    return {
      ...node,
      children: [
        refreshInspectorTree(shadow, graph),
        ...refreshChildren(
          node,
          contents,
          getInstanceContents(sourceNode),
          graph
        )
        // TODO - content
      ]
    };
  }

  return {
    ...node,
    children: refreshChildren(
      node,
      node.children,
      sourceNode.children.filter(
        node => isVisibleNode(node) || isComponent(node)
      ),
      graph
    )
  };
};

const refreshChildren = (
  inspectorNode: InspectorTreeBaseNode<any>,
  inspectorChildren: InspectorTreeBaseNode<any>[],
  sourceNodeChildren: PCNode[],
  graph: DependencyGraph
) =>
  sourceNodeChildren.map(child => {
    const existing = inspectorChildren.find(
      inspectorChild => inspectorChild.sourceNodeId === child.id
    );

    if (existing) {
      return refreshInspectorTree(existing, graph);
    }

    if (child.name === PCSourceTagNames.OVERRIDE) {
      return createInspectorNode(
        InspectorTreeNodeType.CONTENT,
        inspectorNode.instancePath,
        child
      );
    }

    return createInspectorNode(
      InspectorTreeNodeType.SOURCE_REP,
      inspectorNode.name === InspectorTreeNodeType.SHADOW
        ? addInstancePath(inspectorNode, graph)
        : inspectorNode.instancePath,
      child
    );
  });

const containsShadow = (
  sourceNode: PCNode
): sourceNode is PCComponent | PCComponentInstanceElement => {
  return (
    sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE ||
    (sourceNode.name === PCSourceTagNames.COMPONENT &&
      extendsComponent(sourceNode))
  );
};

const getInstanceContents = (
  instance: PCComponentInstanceElement | PCComponent
) => {
  return getOverrides(instance).filter(
    override =>
      override.targetIdPath.length === 1 &&
      override.propertyName === PCOverridablePropertyName.CHILDREN
  ) as PCChildrenOverride[];
};

export const expandInspectorNode = (
  node: InspectorNode,
  root: InspectorNode,
  graph: DependencyGraph
) => {
  if (node.expanded) {
    return root;
  }

  return updateAlts(
    updateNestedNode(node, root, node => {
      const sourceNode = getPCNode(node.sourceNodeId, graph);
      let children: InspectorTreeBaseNode<any>[] = [];

      if (containsShadow(sourceNode)) {
        children = [
          createInspectorNode(
            InspectorTreeNodeType.SHADOW,
            addInstancePath(node, graph),
            getPCNode(sourceNode.is, graph)
          ),
          ...getInstanceContents(sourceNode).map(child =>
            createInspectorNode(
              InspectorTreeNodeType.CONTENT,
              node.instancePath,
              child
            )
          )
        ];
      } else {
        children = sourceNode.children
          .filter(child => isVisibleNode(child) || isComponent(child))
          .map(child =>
            createInspectorNode(
              InspectorTreeNodeType.SOURCE_REP,
              node.instancePath,
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

export const expandSyntheticInspectorNode = (
  node: SyntheticNode,
  document: SyntheticDocument,
  rootInspectorNode: InspectorNode,
  graph: DependencyGraph
) => {
  const nodePath = [
    ...getSyntheticInstancePath(node, document, graph),
    node.source.nodeId
  ];
  const lastId = last(nodePath);
  let current = rootInspectorNode;
  for (const instanceId of nodePath) {
    while (1) {
      current = (current.children as InspectorTreeBaseNode<any>[]).find(child =>
        containsNestedTreeNodeById(
          instanceId,
          getPCNode(child.sourceNodeId, graph)
        )
      );
      rootInspectorNode = expandInspectorNode(
        current,
        rootInspectorNode,
        graph
      );
      current = getNestedTreeNodeById(current.id, rootInspectorNode);

      if (current.sourceNodeId === instanceId) {
        if (instanceId !== lastId) {
          current = current.children[0];
          rootInspectorNode = expandInspectorNode(
            current,
            rootInspectorNode,
            graph
          );
          current = getNestedTreeNodeById(current.id, rootInspectorNode);
        }
        break;
      }
    }
  }

  return rootInspectorNode;
};

export const getSyntheticInspectorNode = memoize(
  (
    node: SyntheticNode,
    document: SyntheticDocument,
    rootInspector: InspectorNode,
    graph: DependencyGraph
  ) => {
    const instancePath = getSyntheticInstancePath(node, document, graph).join(
      "."
    );

    return findNestedNode(
      rootInspector,
      (child: InspectorTreeBaseNode<any>) => {
        return (
          child.instancePath === instancePath &&
          child.sourceNodeId === node.source.nodeId
        );
      }
    );
  }
);

export const getInspectorSyntheticNode = memoize(
  (
    node: InspectorNode,
    documents: SyntheticDocument[],
    graph: DependencyGraph
  ) => {
    const instancePath: string = node.instancePath;

    for (const document of documents) {
      const syntheticNode = findNestedNode(document, (child: SyntheticNode) => {
        return (
          getSyntheticInstancePath(child, document, graph).join(".") ===
            instancePath && child.source.nodeId === node.sourceNodeId
        );
      });
      if (syntheticNode) {
        return syntheticNode;
      }
    }

    // doesn't exist for root, shadows, or content nodes
    return null;
  }
);

const addInstancePath = (parent: InspectorNode, graph: DependencyGraph) => {
  const sourceNode = getPCNode(parent.sourceNodeId, graph);
  return parent.instancePath + (parent.instancePath ? "." : "") + sourceNode.id;
};

export const collapseInspectorNode = (
  node: InspectorNode,
  root: InspectorNode
) => {
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
