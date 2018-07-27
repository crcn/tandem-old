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
  isPCPlug,
  PCPlug,
  SyntheticVisibleNode,
  PCModule,
  getComponentSlots,
  PCSlot,
  diffTreeNode,
  patchTreeNode,
  getSlotPlug
} from "paperclip";

import {
  TreeNode,
  generateUID,
  EMPTY_ARRAY,
  updateNestedNode,
  flattenTreeNode,
  findNestedNode,
  memoize,
  getParentTreeNode,
  findTreeNodeParent,
  appendChildNode,
  updateNestedNodeTrail,
  getTreeNodePath
} from "tandem-common";
// import { SyntheticNode, PCNode, PCModule, PCComponent, DependencyGraph, PCComponentInstanceElement, PCSourceTagNames, PCOverride, PCChildrenOverride } from "paperclip";

// /**
//  * Inspector tree node combines source & synthetic nodes together
//  * for designing & debugging. This exists primarily because source nodes aren't
//  * the best representation for debugging (instances for instances have shadows, bindings, and other dynamic properties), and
//  * Synthetic nodes aren't the best representations either since they can be verbose (repeated items for example), and they don't map well
//  * back to their original source (slotted nodes for example are rendered to their slots, conditional elements may or may not exist).
//  */

export enum InspectorTreeNodeName {
  ROOT = "root",
  SOURCE_REP = "source-rep",
  SHADOW = "shadow",
  CONTENT = "content"
}

export type InspectorTreeBaseNode<TType extends InspectorTreeNodeName> = {
  expanded?: boolean;
  id: string;
  instancePath: string;
  alt?: boolean;
  assocSourceNodeId: string;
  children: InspectorTreeBaseNode<any>[];
} & TreeNode<TType>;

export type InspectorRoot = {} & InspectorTreeBaseNode<
  InspectorTreeNodeName.ROOT
>;

export type InspectorSourceRep = {} & InspectorTreeBaseNode<
  InspectorTreeNodeName.SOURCE_REP
>;

export type InspectorShadow = {} & InspectorTreeBaseNode<
  InspectorTreeNodeName.SHADOW
>;

export type InspectorContent = {} & InspectorTreeBaseNode<
  InspectorTreeNodeName.CONTENT
>;

export type InspectorNode =
  | InspectorRoot
  | InspectorSourceRep
  | InspectorShadow
  | InspectorContent;

export const createRootInspectorNode = (): InspectorRoot => ({
  id: generateUID(),
  name: InspectorTreeNodeName.ROOT,
  children: EMPTY_ARRAY,
  expanded: true,
  instancePath: null,
  assocSourceNodeId: null
});

const createInspectorSourceRep = (
  assocSourceNode: PCNode,
  instancePath: string = null,
  expanded: boolean = false,
  children?: InspectorNode[]
): InspectorSourceRep => ({
  id: generateUID(),
  name: InspectorTreeNodeName.SOURCE_REP,
  children: children || EMPTY_ARRAY,
  instancePath,
  expanded,
  assocSourceNodeId: assocSourceNode.id
});

const createInspectorShadow = (
  assocSourceNode: PCComponent,
  instancePath: string,
  expanded: boolean = false,
  children?: InspectorNode[]
): InspectorShadow => ({
  id: generateUID(),
  name: InspectorTreeNodeName.SHADOW,
  children: children || EMPTY_ARRAY,
  instancePath,
  expanded,
  assocSourceNodeId: assocSourceNode.id
});

const createInstanceContent = (
  sourceSlot: PCSlot,
  instancePath: string,
  expanded: boolean = false,
  children?: InspectorNode[]
): InspectorContent => ({
  id: generateUID(),
  name: InspectorTreeNodeName.CONTENT,
  children: children || EMPTY_ARRAY,
  instancePath,
  expanded,
  assocSourceNodeId: sourceSlot.id
});

export const addModuleInspector = (
  module: PCModule,
  root: InspectorRoot,
  graph: DependencyGraph
) => {
  return updateAlts(
    appendChildNode(evaluateModuleInspector(module, graph), root)
  );
};

export const evaluateModuleInspector = (
  module: PCModule,
  graph: DependencyGraph
) => {
  return createInspectorSourceRep(
    module,
    "",
    true,
    evaluateInspectorNodeChildren(module, "", graph)
  );
};

const evaluateInspectorNodeChildren = (
  parent: PCNode,
  instancePath: string,
  graph: DependencyGraph
) => {
  if (extendsComponent(parent)) {
    const component = getPCNode(parent.is, graph) as PCComponent;
    const shadowInstancePath =
      parent.name === PCSourceTagNames.COMPONENT_INSTANCE
        ? addInstancePath(instancePath, parent)
        : instancePath;
    return [
      createInspectorShadow(
        component,
        shadowInstancePath,
        false,
        evaluateInspectorNodeChildren(component, shadowInstancePath, graph)
      ),
      ...getComponentSlots(component, graph).map(slot => {
        const plug = getSlotPlug(parent, slot);
        return createInstanceContent(
          slot,
          instancePath,
          false,
          plug
            ? evaluateInspectorNodeChildren(plug, instancePath, graph)
            : EMPTY_ARRAY
        );
      })
    ];
  } else {
    return parent.children
      .filter(child => {
        return isVisibleNode(child) || isSlot(child) || isComponent(child);
      })
      .map(child => {
        return createInspectorSourceRep(
          child,
          instancePath,
          false,
          evaluateInspectorNodeChildren(child, instancePath, graph)
        );
      });
  }
};

export const isInspectorNode = (node: TreeNode<any>): node is InspectorNode => {
  return (
    node.name === InspectorTreeNodeName.SOURCE_REP ||
    node.name === InspectorTreeNodeName.CONTENT ||
    node.name === InspectorTreeNodeName.SHADOW
  );
};

const compareInspectorTreeNodes = (a: InspectorNode, b: InspectorNode) =>
  a.assocSourceNodeId === b.assocSourceNodeId ? 0 : -1;

export const refreshInspectorTree = (
  root: InspectorTreeBaseNode<any>,
  graph: DependencyGraph
): InspectorTreeBaseNode<InspectorTreeNodeName> => {
  const sourceNode = getPCNode(root.assocSourceNodeId, graph) as PCModule;
  const moduleInspector = evaluateModuleInspector(sourceNode, graph);
  const ots = diffTreeNode(
    root,
    moduleInspector,
    { expanded: true, alt: true },
    compareInspectorTreeNodes
  );
  root = patchTreeNode(ots, root);

  return root;
};

export const getInspectorSourceNode = (
  node: InspectorNode,
  ancestor: InspectorNode,
  graph: DependencyGraph
): PCNode => {
  const nodeSource = getPCNode(node.assocSourceNodeId, graph);
  if (node.name === InspectorTreeNodeName.CONTENT) {
    const parent = getParentTreeNode(node.id, ancestor);
    return getSlotPlug(
      getPCNode(parent.assocSourceNodeId, graph) as PCComponentInstanceElement,
      nodeSource as PCSlot
    );
  } else {
    return nodeSource;
  }
};

export const inspectorNodeInShadow = (
  node: InspectorNode,
  contentNode: InspectorNode
) => {
  return Boolean(
    findTreeNodeParent(
      node.id,
      contentNode,
      parent => parent.name === InspectorTreeNodeName.SHADOW
    )
  );
};

export const expandInspectorNode = (
  node: InspectorNode,
  root: InspectorNode
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
  const instancePath = getSyntheticInstancePath(node, document, graph).join(
    "."
  );
  const sourceNodeId = node.source.nodeId;

  const relatedInspectorNode = findNestedNode(
    rootInspectorNode,
    (child: InspectorNode) => {
      return (
        child.instancePath === instancePath &&
        child.assocSourceNodeId === sourceNodeId
      );
    }
  );

  if (!relatedInspectorNode) {
    console.error(`Inspector node ${instancePath}.${sourceNodeId} not found`);
    return rootInspectorNode;
  }

  rootInspectorNode = updateNestedNodeTrail(
    getTreeNodePath(relatedInspectorNode.id, rootInspectorNode),
    rootInspectorNode,
    (node: InspectorNode) => {
      return {
        ...node,
        expanded: true
      };
    }
  );

  return updateAlts(rootInspectorNode);
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
          child.name === InspectorTreeNodeName.SOURCE_REP,
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
  return (instancePath || "") + (instancePath ? "." : "") + parentAssocNode.id;
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
