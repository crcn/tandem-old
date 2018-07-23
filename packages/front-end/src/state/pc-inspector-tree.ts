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
  isSlot,
  isPCContent,
  PCContent,
  getInstanceSlots,
  SyntheticVisibleNode
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
  memoize,
  getParentTreeNode,
  findTreeNodeParent
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
  assocSourceNodeId: string;
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
  parent: InspectorNode,
  sourceNode: PCNode,
  graph: DependencyGraph
): InspectorTreeBaseNode<InspectorTreeNodeType> => {
  let node: InspectorTreeBaseNode<InspectorTreeNodeType> = {
    name: name,
    expanded: false,
    assocSourceNodeId: sourceNode && sourceNode.id,
    instancePath,
    id: generateUID(),
    children: EMPTY_ARRAY
  };

  if (sourceNode && graph) {
    console.log(node, parent);
    node.children = createInspectorChildren(
      instancePath,
      node as InspectorNode,
      getInspectorSourceNode(node as InspectorNode, parent, graph),
      sourceNode,
      graph
    );
  }

  return node;
};

export const isInspectorNode = (node: TreeNode<any>): node is InspectorNode => {
  return (
    node.name === InspectorTreeNodeType.SOURCE_REP ||
    node.name === InspectorTreeNodeType.CONTENT ||
    node.name === InspectorTreeNodeType.SHADOW
  );
};

export const refreshInspectorTree = (
  root: InspectorTreeBaseNode<any>,
  graph: DependencyGraph
): InspectorTreeBaseNode<InspectorTreeNodeType> => {
  return updateAlts(_refreshInspectorTree(root, root, graph) as InspectorNode);
};

export const getInspectorSourceNode = (
  node: InspectorNode,
  ancestor: InspectorNode,
  graph: DependencyGraph
): PCNode => {
  if (node.name === InspectorTreeNodeType.CONTENT) {
    const parent = getParentTreeNode(node.id, ancestor);
    return getSlotContent(
      node.assocSourceNodeId,
      parent.assocSourceNodeId,
      graph
    );
  } else {
    return getPCNode(node.assocSourceNodeId, graph);
  }
};

const _refreshInspectorTree = (
  node: InspectorTreeBaseNode<any>,
  root: InspectorTreeBaseNode<any>,
  graph: DependencyGraph
): InspectorTreeBaseNode<InspectorTreeNodeType> => {
  if (!node.expanded) {
    return { ...node };
  }

  const sourceNode =
    node.assocSourceNodeId &&
    getInspectorSourceNode(node, getParentTreeNode(node.id, root), graph);

  // if no source node, then it's likely the root, or deleted
  if (!sourceNode) {
    if (node.name !== InspectorTreeNodeType.ROOT) {
      return null;
    }
    return {
      ...node,
      children: node.children
        .map(child => _refreshInspectorTree(child, root, graph))
        .filter(Boolean)
    };
  }

  if (containsShadow(sourceNode)) {
    const [shadow, ...contents] = node.children as InspectorTreeBaseNode<any>[];
    return {
      ...node,
      children: [
        _refreshInspectorTree(shadow, root, graph),
        ...refreshChildren(
          root,
          node,
          contents,
          getInstanceSlots(sourceNode, graph),
          graph
        )
      ]
    };
  }

  return {
    ...node,
    children: refreshChildren(
      root,
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
  root: InspectorNode,
  inspectorNode: InspectorTreeBaseNode<any>,
  inspectorChildren: InspectorTreeBaseNode<any>[],
  sourceNodeChildren: PCNode[],
  graph: DependencyGraph
) =>
  sourceNodeChildren
    .map(child => {
      const existing = inspectorChildren.find(
        inspectorChild => inspectorChild.assocSourceNodeId === child.id
      );

      if (existing) {
        return _refreshInspectorTree(existing, root, graph);
      }

      const inspectorSourceNode = getInspectorSourceNode(
        inspectorNode,
        getParentTreeNode(inspectorNode.id, root),
        graph
      );

      if (!containsNestedTreeNodeById(child.id, inspectorSourceNode)) {
        return createInspectorNode(
          InspectorTreeNodeType.CONTENT,
          inspectorNode.instancePath,
          inspectorNode,
          child,
          graph
        );
      }

      return createInspectorNode(
        InspectorTreeNodeType.SOURCE_REP,
        inspectorNode.name === InspectorTreeNodeType.SHADOW
          ? addInstancePath(
              inspectorNode.instancePath,
              getPCNode(inspectorNode.assocSourceNodeId, graph)
            )
          : inspectorNode.instancePath,
        inspectorNode,
        child,
        graph
      );
    })
    .filter(Boolean);

const containsShadow = (
  sourceNode: PCNode
): sourceNode is PCComponent | PCComponentInstanceElement => {
  return (
    sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE ||
    (sourceNode.name === PCSourceTagNames.COMPONENT &&
      extendsComponent(sourceNode))
  );
};

// const getInstanceContents = (
//   instance: PCComponentInstanceElement | PCComponent,
//   graph: DependencyGraph
// ) => {
//   return findSlottableElements(instance, graph);
// };

const getSlotContent = (
  assocSourceNodeId: string,
  instanceNodeId: string,
  graph: DependencyGraph
): PCContent => {
  const instance = getPCNode(instanceNodeId, graph);
  return instance.children.find(
    child => isPCContent(child) && child.slotId === assocSourceNodeId
  ) as PCContent;
};

export const inspectorNodeInShadow = (
  node: InspectorNode,
  contentNode: InspectorNode
) => {
  return Boolean(
    findTreeNodeParent(
      node.id,
      contentNode,
      parent => parent.name === InspectorTreeNodeType.SHADOW
    )
  );
};

export const createInspectorChildren = (
  instancePath: string,
  node: InspectorNode,
  parentSourceNode: PCNode,
  parentAssocNode: PCNode,
  graph: DependencyGraph
) => {
  if (containsShadow(parentSourceNode)) {
    return [
      createInspectorNode(
        InspectorTreeNodeType.SHADOW,
        addInstancePath(instancePath, parentAssocNode),
        node,
        getPCNode(parentSourceNode.is, graph),
        graph
      ),
      ...getInstanceSlots(parentSourceNode, graph).map(child =>
        createInspectorNode(
          InspectorTreeNodeType.CONTENT,
          instancePath,
          node,
          child,
          graph
        )
      )
    ];
  } else {
    return parentSourceNode.children
      .filter(
        child => isVisibleNode(child) || isComponent(child) || isSlot(child)
      )
      .map(child =>
        createInspectorNode(
          InspectorTreeNodeType.SOURCE_REP,
          instancePath,
          node,
          child,
          graph
        )
      );
  }
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
      return {
        ...node,
        expanded: true
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

  if (!getPCNode(lastId, graph)) {
    return rootInspectorNode;
  }

  let current = rootInspectorNode;
  for (const instanceId of nodePath) {
    while (1) {
      current = (current.children as InspectorTreeBaseNode<any>[]).find(
        child => {
          const sourceNode = getInspectorSourceNode(
            child,
            getParentTreeNode(node.id, rootInspectorNode),
            graph
          );
          return (
            sourceNode && containsNestedTreeNodeById(instanceId, sourceNode)
          );
        }
      );
      rootInspectorNode = expandInspectorNode(
        current,
        rootInspectorNode,
        graph
      );
      current = getNestedTreeNodeById(current.id, rootInspectorNode);

      if (current.assocSourceNodeId === instanceId) {
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
          child.name === InspectorTreeNodeType.SOURCE_REP,
          child.instancePath === instancePath &&
            child.assocSourceNodeId === node.source.nodeId
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
  ): SyntheticVisibleNode => {
    const instancePath: string = node.instancePath;

    for (const document of documents) {
      const syntheticNode = findNestedNode(document, (child: SyntheticNode) => {
        return (
          getSyntheticInstancePath(child, document, graph).join(".") ===
            instancePath && child.source.nodeId === node.assocSourceNodeId
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

const addInstancePath = (instancePath: string, parentAssocNode: PCNode) => {
  return instancePath + (instancePath ? "." : "") + parentAssocNode.id;
};

export const collapseInspectorNode = (
  node: InspectorNode,
  root: InspectorNode
) => {
  if (!node.expanded) {
    return node;
  }

  const collapse = (node: InspectorNode) => {
    if (!node.expanded) {
      return node;
    }
    return {
      ...node,
      expanded: false,
      children: node.children.map(collapse)
    };
  };

  return updateAlts(updateNestedNode(node, root, collapse));
};

export const updateAlts = (root: InspectorNode) => {
  const flattened = flattenTreeNode(root).filter(
    node =>
      getParentTreeNode(node.id, root) &&
      getParentTreeNode(node.id, root).expanded
  );

  const map = (node: InspectorNode) => {
    return {
      ...node,
      alt: flattened.indexOf(node) % 2 !== 0,
      children: node.children.map(map)
    };
  };

  return map(root);
};
