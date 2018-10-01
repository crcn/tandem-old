import { DependencyGraph } from "./graph";
import {
  PCNode,
  PCSourceTagNames,
  getPCNode,
  extendsComponent,
  PCOverride,
  PCVariantOverride,
  PCComponentInstanceElement,
  PCComponent,
  getOverrides,
  PCVariant,
  isVisibleNode,
  isComponent,
  isSlot,
  PCModule,
  getComponentSlots,
  PCSlot,
  PCOverridablePropertyName,
  getSlotPlug,
  getPCNodeModule,
  getPCVariants,
  PCBaseValueOverride
} from "./dsl";
import { last } from "lodash";

import {
  getSyntheticSourceMap,
  getSyntheticDocumentsSourceMap,
  getSyntheticNodeById,
  SyntheticNode,
  SyntheticDocument,
  getSyntheticInstancePath,
  SyntheticVisibleNode,
  getSyntheticSourceNode
} from "./synthetic";

import { diffTreeNode, patchTreeNode } from "./ot";

import {
  TreeNode,
  generateUID,
  EMPTY_ARRAY,
  updateNestedNode,
  flattenTreeNode,
  findNestedNode,
  memoize,
  KeyValue,
  getParentTreeNode,
  findTreeNodeParent,
  appendChildNode,
  updateNestedNodeTrail,
  getTreeNodePath,
  getNestedTreeNodeById,
  containsNestedTreeNodeById
} from "tandem-common";
import { PCEditorState } from "./edit";
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
  graph: DependencyGraph,
  fromInstanceShadow?: boolean
) => {
  if (extendsComponent(parent)) {
    const component = getPCNode(
      (parent as PCComponent).is,
      graph
    ) as PCComponent;

    const shadowInstancePath =
      !fromInstanceShadow &&
      (parent.name === PCSourceTagNames.COMPONENT_INSTANCE ||
        getParentTreeNode(parent.id, getPCNodeModule(parent.id, graph)).name ===
          PCSourceTagNames.MODULE)
        ? addInstancePath(instancePath, parent)
        : instancePath;
    return [
      createInspectorShadow(
        component,
        shadowInstancePath,
        false,
        evaluateInspectorNodeChildren(
          component,
          shadowInstancePath,
          graph,
          true
        )
      ),
      ...getComponentSlots(component, graph).map(slot => {
        const plug = getSlotPlug(parent as PCComponent, slot);
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

type InstanceVariantInfo = {
  enabled: boolean;
  variant: PCVariant;
};

export const getInstanceVariantInfo = memoize(
  (
    node: InspectorNode,
    root: InspectorNode,
    graph: DependencyGraph,
    selectedVariantId?: string
  ): InstanceVariantInfo[] => {
    const instance = getInspectorSourceNode(
      node,
      root,
      graph
    ) as PCComponentInstanceElement;
    const component = getPCNode(instance.is, graph) as PCComponent;
    const variants = getPCVariants(component);

    const parentInstances = [
      instance,
      ...(node.instancePath
        ? node.instancePath
            .split(".")
            .reverse()
            .map(instanceId => {
              return getPCNode(instanceId, graph) as PCComponentInstanceElement;
            })
        : [])
    ];

    const enabled: KeyValue<boolean> = {};

    for (const parentInstance of parentInstances) {
      const variant = parentInstance.variant;
      const variantOverride = parentInstance.children.find(
        (child: PCNode) =>
          child.name === PCSourceTagNames.OVERRIDE &&
          child.propertyName === PCOverridablePropertyName.VARIANT &&
          (last(child.targetIdPath) === instance.id ||
            (child.targetIdPath.length === 0 &&
              parentInstance.id === instance.id)) &&
          child.variantId == selectedVariantId
      ) as PCBaseValueOverride<any, any>;
      Object.assign(enabled, variant, variantOverride && variantOverride.value);
    }

    return variants.map(variant => ({
      variant,
      enabled: enabled[variant.id]
    }));
  }
);
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

export const getInspectorNodeOwnerInstance = (
  node: InspectorNode,
  root: InspectorNode
) => {
  return findTreeNodeParent(
    node.id,
    root,
    (parent: InspectorNode) =>
      !inspectorNodeInShadow(parent, root) &&
      parent.name === InspectorTreeNodeName.SOURCE_REP
  );
};

const getInspectorNodeOwnerSlot = (
  node: InspectorNode,
  root: InspectorNode,
  graph: DependencyGraph
) => {
  return findTreeNodeParent(
    node.id,
    root,
    (parent: InspectorNode) =>
      getPCNode(parent.assocSourceNodeId, graph).name === PCSourceTagNames.SLOT
  );
};

export const getInsertableInspectorNode = (
  child: InspectorNode,
  root: InspectorNode,
  graph: DependencyGraph
) => {
  if (inspectorNodeInShadow(child, root)) {
    const slot = getInspectorNodeOwnerSlot(child, root, graph);
    const owner = getInspectorNodeOwnerInstance(child, root);
    return owner.children.find(child => {
      return (
        child.name === InspectorTreeNodeName.CONTENT &&
        child.assocSourceNodeId === slot.assocSourceNodeId
      );
    });
  } else {
    return child;
  }
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
  const sourceNodeId = node.sourceNodeId;

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

export const getInheritedOverridesOverrides = (
  inspectorNode: InspectorNode,
  rootInspectorNode: InspectorNode,
  graph: DependencyGraph
) => {
  const sourceNode = getPCNode(inspectorNode.assocSourceNodeId, graph);
  let overrides: PCOverride[] = getOverrides(sourceNode);
  const parent = getParentTreeNode(inspectorNode.id, rootInspectorNode);
  if (parent && parent.assocSourceNodeId) {
    overrides = [
      ...overrides,
      ...getInheritedOverridesOverrides(parent, rootInspectorNode, graph)
    ];
  }
  return overrides;
};

// TODO - move to paperclip
export const getInspectorNodeOverrides = memoize(
  (
    inspectorNode: InspectorNode,
    rootInspectorNode: InspectorNode,
    variant: PCVariant,
    graph: DependencyGraph
  ) => {
    let overrides: PCOverride[] = [];
    const sourceNode = getPCNode(inspectorNode.assocSourceNodeId, graph);
    const inheritedOverrides = getInheritedOverridesOverrides(
      inspectorNode,
      rootInspectorNode,
      graph
    );
    for (const override of inheritedOverrides) {
      const overrideModule = getPCNodeModule(override.id, graph);
      const matchesVariant =
        !override.variantId || override.variantId == (variant && variant.id);
      const overrideIsTarget =
        last(override.targetIdPath) === inspectorNode.assocSourceNodeId;
      const overrideTargetIsParent =
        override.targetIdPath.length === 0 &&
        getParentTreeNode(override.id, overrideModule).id === sourceNode.id;

      if (matchesVariant && (overrideIsTarget || overrideTargetIsParent)) {
        overrides.push(override);
      }
    }
    return overrides;
  }
);

export const getSyntheticNodeInspectorNode = <TState extends PCEditorState>(
  node: SyntheticNode,
  state: TState
) => {
  const sourceNode = getSyntheticSourceNode(node, state.graph);
  return findNestedNode(
    state.sourceNodeInspector,
    child => child.assocSourceNodeId === sourceNode.id
  );
};

export const getInspectorNodeByAssocId = <TState extends PCEditorState>(
  assocId: string,
  root: InspectorNode
) => {
  return findNestedNode(
    root,
    child => !child.instancePath && child.assocSourceNodeId === assocId
  );
};

export const getInspectorContentNodeContainingChild = memoize(
  (child: InspectorNode, root: InspectorNode) => {
    for (let i = 0, n1 = root.children.length; i < n1; i++) {
      const module = root.children[i];
      for (let j = 0, n2 = module.children.length; j < n2; j++) {
        const contentNode = module.children[j];
        if (
          contentNode.id !== child.id &&
          containsNestedTreeNodeById(child.id, contentNode)
        ) {
          return contentNode;
        }
      }
    }
  }
);

export const getInspectorInstanceShadow = memoize(
  (inspectorNode: InspectorNode) => {
    return inspectorNode.children[0];
  }
);

export const getInspectorInstanceShadowContentNode = (
  inspectorNode: InspectorNode
) => {
  const shadow = getInspectorInstanceShadow(inspectorNode);
  return shadow && shadow.children[0];
};

export const getInspectorNodeParentShadow = memoize(
  (inspectorNode: InspectorNode, root: InspectorNode) => {
    let current: InspectorNode = inspectorNode;
    while (current) {
      const parent = getParentTreeNode(current.id, root) as InspectorNode;
      if (parent && parent.name === InspectorTreeNodeName.SHADOW) {
        return parent;
      }
      current = parent;
    }
    return null;
  }
);

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
            child.assocSourceNodeId === node.sourceNodeId
        );
      }
    );
  }
);

export const getInspectorSyntheticNode = memoize(
  (
    node: InspectorNode,
    documents: SyntheticDocument[]
  ): SyntheticVisibleNode => {
    const instancePath = node.instancePath;
    const nodePath =
      (node.instancePath ? instancePath + "." : "") + node.assocSourceNodeId;

    const sourceMap = getSyntheticDocumentsSourceMap(documents);

    // doesn't exist for root, shadows, or content nodes
    const syntheticNodeId = sourceMap[nodePath];

    return syntheticNodeId && getSyntheticNodeById(syntheticNodeId, documents);
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
    const alt = flattened.indexOf(node) % 2 !== 0;

    let children = node.children;

    if (node.alt !== alt) {
    }

    if (node.expanded) {
      children = node.children.map(map);
    }

    if (node.alt !== alt || node.children !== children) {
      return {
        ...node,
        alt,
        children
      };
    }

    return node;
  };

  return map(root);
};
