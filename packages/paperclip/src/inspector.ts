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
  PCBaseValueOverride,
  getPCNodeContentNode,
  getInstanceShadow,
  getPCNodeDependency
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

import {
  diffTreeNode,
  TreeNodeOperationalTransformType,
  patchTreeNode
} from "./ot";

import {
  TreeNode,
  generateUID,
  EMPTY_ARRAY,
  updateNestedNode,
  flattenTreeNode,
  memoize,
  KeyValue,
  getParentTreeNode,
  findTreeNodeParent,
  appendChildNode,
  updateNestedNodeTrail,
  getTreeNodePath,
  containsNestedTreeNodeById,
  getTreeNodeAncestors,
  EMPTY_OBJECT,
  getTreeNodeFromPath,
  arraySplice,
  getNestedTreeNodeById,
  replaceNestedNode,
  insertChildNode,
  removeNestedTreeNode
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

  // May not exist in some cases like plugs
  sourceNodeId: null | string;
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

export type InspectorContent = {
  // must exist
  sourceSlotNodeId: string;
} & InspectorTreeBaseNode<InspectorTreeNodeName.CONTENT>;

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
  sourceNodeId: null
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
  sourceNodeId: assocSourceNode.id
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
  sourceNodeId: assocSourceNode.id
});

const createInstanceContent = (
  sourceSlotNodeId: string,
  instancePath: string,
  expanded: boolean = false,
  children?: InspectorNode[]
): InspectorContent => ({
  id: generateUID(),
  name: InspectorTreeNodeName.CONTENT,
  children: children || EMPTY_ARRAY,
  instancePath,
  expanded,
  sourceSlotNodeId: sourceSlotNodeId,
  sourceNodeId: null
});

export const evaluateModuleInspector = (
  module: PCModule,
  graph: DependencyGraph,
  sourceMap?: KeyValue<string[]>
): [InspectorNode, KeyValue<string[]>] => {
  let inspectorChildren: InspectorNode[];

  [inspectorChildren, sourceMap] = evaluateInspectorNodeChildren(
    module,
    "",
    graph,
    false,
    sourceMap
  );

  let inspectorNode = createInspectorSourceRep(
    module,
    "",
    true,
    inspectorChildren
  );

  sourceMap = addSourceMap(inspectorNode, sourceMap);

  return [inspectorNode, sourceMap];
};

const addSourceMap = (
  inspectorNode: InspectorNode,
  map: KeyValue<string[]>
) => {
  map = { ...map };

  if (!inspectorNode.sourceNodeId) {
    return map;
  }
  if (!map[inspectorNode.sourceNodeId]) {
    map[inspectorNode.sourceNodeId] = [];
  }

  map[inspectorNode.sourceNodeId] = [
    ...map[inspectorNode.sourceNodeId],
    inspectorNode.id
  ];
  return map;
};

const removeSourceMap = (
  inspectorNode: InspectorNode,
  map: KeyValue<string[]>
) => {
  if (!inspectorNode.sourceNodeId) {
    return map;
  }
  const index = map[inspectorNode.sourceNodeId].indexOf(inspectorNode.id);
  return index !== -1
    ? {
        ...map,
        [inspectorNode.sourceNodeId]: arraySplice(
          map[inspectorNode.sourceNodeId],
          index,
          1
        )
      }
    : map;
};

const getShadowInstance = (shadow: InspectorNode, root: InspectorNode) => {
  let current = shadow;
  const contentNode = getInspectorContentNode(shadow, root);
  while (inspectorNodeInShadow(current, contentNode)) {
    current = getParentTreeNode(current.id, root);
  }
  return current;
};

const evaluateInspectorNodeChildren = (
  parent: PCNode,
  instancePath: string,
  graph: DependencyGraph,
  fromInstanceShadow: boolean = false,
  sourceMap: KeyValue<string[]> = {}
): [InspectorNode[], KeyValue<string[]>] => {
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

    let shadowChildren: InspectorNode[];

    [shadowChildren, sourceMap] = evaluateInspectorNodeChildren(
      component,
      shadowInstancePath,
      graph,
      true,
      sourceMap
    );

    const shadow = createInspectorShadow(
      component,
      shadowInstancePath,
      false,
      shadowChildren
    );

    sourceMap = addSourceMap(shadow, sourceMap);

    let plugs: InspectorNode[];

    [plugs, sourceMap] = getComponentSlots(component, graph).reduce(
      (
        [plugs, sourceMap]: [InspectorNode[], KeyValue<string[]>],
        slot
      ): [InspectorNode[], KeyValue<string[]>] => {
        const plug = getSlotPlug(parent as PCComponent, slot);

        let inspectorChildren: InspectorNode[] = [];

        [inspectorChildren, sourceMap] = plug
          ? evaluateInspectorNodeChildren(
              plug,
              instancePath,
              graph,
              false,
              sourceMap
            )
          : [EMPTY_ARRAY, sourceMap];
        const inspector = createInstanceContent(
          slot.id,
          instancePath,
          false,
          inspectorChildren
        );

        sourceMap = addSourceMap(inspector, sourceMap);

        return [[...plugs, inspector], sourceMap];
      },
      [EMPTY_ARRAY, sourceMap]
    ) as [InspectorNode[], KeyValue<string[]>];

    const children = [shadow, ...plugs];

    return [children, sourceMap];
  } else {
    const usablePCChildren = parent.children.filter(child => {
      return isVisibleNode(child) || isSlot(child) || isComponent(child);
    });

    return usablePCChildren.reduce(
      ([ret, sourceMap]: [InspectorNode[], KeyValue<string[]>], child) => {
        let inspectorChildren: InspectorNode[];

        [inspectorChildren, sourceMap] = evaluateInspectorNodeChildren(
          child,
          instancePath,
          graph,
          false,
          sourceMap
        );

        const inspector = createInspectorSourceRep(
          child,
          instancePath,
          false,
          inspectorChildren
        );

        sourceMap = addSourceMap(inspector, sourceMap);

        return [[...ret, inspector], sourceMap];
      },
      [EMPTY_ARRAY, sourceMap]
    ) as [InspectorNode[], KeyValue<string[]>];

    // return parent.children
    //   .filter(child => {
    //     return isVisibleNode(child) || isSlot(child) || isComponent(child);
    //   })
    //   .map(child => {
    //     return createInspectorSourceRep(
    //       child,
    //       instancePath,
    //       false,
    //       evaluateInspectorNodeChildren(child, instancePath, graph)
    //     );
    //   });
  }
};

export const isInspectorNode = (node: TreeNode<any>): node is InspectorNode => {
  return (
    node.name === InspectorTreeNodeName.SOURCE_REP ||
    node.name === InspectorTreeNodeName.CONTENT ||
    node.name === InspectorTreeNodeName.SHADOW
  );
};

export const refreshInspectorTree = (
  root: InspectorTreeBaseNode<any>,
  newGraph: DependencyGraph,
  moduleUris: string[],
  sourceMap: KeyValue<string[]> = EMPTY_OBJECT,
  oldGraph: DependencyGraph = EMPTY_OBJECT
): [InspectorNode, KeyValue<string[]>] => {
  let newSourceMap: KeyValue<string[]> = {};

  // 1. remove source map info
  for (const moduleInspectorNode of root.children) {
    const dep = getPCNodeDependency(
      (moduleInspectorNode as InspectorNode).sourceNodeId,
      oldGraph
    );
    if (dep && sourceMap[dep.content.id]) {
      const uri = dep.uri;
      const module = dep.content;
      if (moduleUris.indexOf(uri) !== -1) {
        for (const nestedChild of flattenTreeNode(module)) {
          newSourceMap[nestedChild.id] = sourceMap[nestedChild.id];
        }
      } else {
        root = {
          ...root,
          children: root.children.filter(
            child => child.sourceNodeId !== module.id
          )
        };
      }
    }
  }

  // 2. patch trees based on moduleUris
  for (const uri of moduleUris) {
    const oldDependency = oldGraph[uri];
    const newDep = newGraph[uri];

    if (!newDep) {
      continue;
    }

    const newModule = newDep.content;
    if (!oldDependency || !sourceMap[oldDependency.content.id]) {
      let moduleInspector: InspectorNode;
      [moduleInspector, newSourceMap] = evaluateModuleInspector(
        newModule,
        newGraph,
        newSourceMap
      );
      root = appendChildNode(moduleInspector, root);
    } else {
      [root, newSourceMap] = patchInspectorTree2(
        root,
        newGraph,
        uri,
        sourceMap,
        oldGraph
      );
    }
  }

  root = updateAlts(root);

  return [root, newSourceMap];
};

const isUnreppedSourceNode = (node: PCNode) =>
  node.name === PCSourceTagNames.VARIABLE ||
  node.name === PCSourceTagNames.OVERRIDE ||
  node.name === PCSourceTagNames.VARIANT;

const patchInspectorTree2 = (
  rootInspectorNode: InspectorTreeBaseNode<any>,
  newGraph: DependencyGraph,
  uri: string,
  sourceMap: KeyValue<string[]>,
  oldGraph: DependencyGraph
): [InspectorNode, KeyValue<string[]>] => {
  const newModule = newGraph[uri].content;
  const oldModule = oldGraph[uri].content;
  let tmpModule = oldModule;
  const ots = diffTreeNode(tmpModule, newModule);

  let newSourceMap = { ...sourceMap };

  for (const ot of ots) {
    const targetNode = getTreeNodeFromPath(ot.nodePath, tmpModule) as PCNode;

    if (isUnreppedSourceNode(targetNode as PCNode)) {
      continue;
    }

    tmpModule = patchTreeNode([ot], tmpModule);
    const patchedTarget = getTreeNodeFromPath(ot.nodePath, tmpModule) as PCNode;

    const targetinspectorNodeInstanceIds = newSourceMap[patchedTarget.id];


    for (const inspectorNodeId of targetinspectorNodeInstanceIds) {
      const targetInspectorNode = getNestedTreeNodeById(inspectorNodeId, rootInspectorNode);
      let newInspectorNode = targetInspectorNode;
      const shadow = getInspectorNodeParentShadow(targetInspectorNode, rootInspectorNode);
      switch(ot.type) {
        case TreeNodeOperationalTransformType.INSERT_CHILD: {
          const {child} = ot;
          const pcChild = child as PCNode;
          const reppedChildren = patchedTarget.children.filter(child => !isUnreppedSourceNode(child));
          let reppedIndex = reppedChildren.indexOf(pcChild);

          if (reppedIndex === -1) {
            break;
          }

          let inspectorChildren;
          let newInspectorChild: InspectorNode;
          [inspectorChildren, newSourceMap] = evaluateInspectorNodeChildren(pcChild, targetInspectorNode.instancePath, newGraph, Boolean(shadow), newSourceMap);

          if (pcChild.name === PCSourceTagNames.PLUG) {
            const existingInspectorPlug = targetInspectorNode.children.find((child: InspectorNode) => child.name === InspectorTreeNodeName.CONTENT && child.sourceSlotNodeId === pcChild.slotId);
            newInspectorNode = removeNestedTreeNode(existingInspectorPlug, newInspectorNode);
            newSourceMap = removeSourceMap(existingInspectorPlug, newSourceMap);
            newInspectorChild = createInstanceContent(pcChild.slotId, targetInspectorNode.instancePath, false, inspectorChildren);

            // need to increment index by 1 to ensure that the child is
            // inserted _after_ the shadow inspector node.
            reppedIndex++;
          } else {
            newInspectorChild = createInspectorSourceRep(pcChild, targetInspectorNode.instancePath, false, inspectorChildren);
          }

          newInspectorNode = insertChildNode(newInspectorChild, reppedIndex, newInspectorNode);
          newSourceMap = addSourceMap(newInspectorChild, newSourceMap);

          break;
        }
        case TreeNodeOperationalTransformType.REMOVE_CHILD: {
          const {index} = ot;
          const pcChild = targetNode.children[index] as PCNode;
          const reppedChildren = targetNode.children.filter(child => !isUnreppedSourceNode(child));
          const reppedIndex = reppedChildren.indexOf(pcChild);

          if (reppedIndex === -1) {
            break;
          }

          const inspectorChild = newInspectorNode.children[reppedIndex];
          newInspectorNode = removeNestedTreeNode(inspectorChild, newInspectorNode);
          newSourceMap = removeSourceMap(inspectorChild, newSourceMap);

          break;

        }

        case TreeNodeOperationalTransformType.MOVE_CHILD: {
          const {oldIndex, newIndex} = ot;
          const pcChild = targetNode.children[oldIndex] as PCNode;
          const beforeChild = targetNode.children[newIndex] as PCNode;

          const reppedChildren = targetNode.children.filter(child => !isUnreppedSourceNode(child));
          const reppedIndex = reppedChildren.indexOf(pcChild);
          const reppedBeforeIndex = beforeChild ? reppedChildren.indexOf(beforeChild) : reppedChildren.length;

          if (reppedIndex === -1) {
            break;
          }

          const inspectorChild = newInspectorNode.children[reppedIndex];
          newInspectorNode = removeNestedTreeNode(inspectorChild, newInspectorNode);
          newInspectorNode = insertChildNode(inspectorChild, reppedBeforeIndex, newInspectorNode);

          break;
        }
      }

      if (targetInspectorNode !== newInspectorNode) {
        rootInspectorNode = replaceNestedNode(newInspectorNode, targetInspectorNode.id, rootInspectorNode);
      }
    }
  }




  return [rootInspectorNode, newSourceMap];
};

// const patchInspectorTree = (
//   rootInspectorNode: InspectorTreeBaseNode<any>,
//   newGraph: DependencyGraph,
//   uri: string,
//   sourceMap: KeyValue<string[]>,
//   oldGraph: DependencyGraph
// ): [InspectorNode, KeyValue<string[]>] => {
//   const newModule = newGraph[uri].content;
//   const oldModule = oldGraph[uri].content;
//   let tmpModule = oldModule;
//   const ots = diffTreeNode(tmpModule, newModule);

//   let newSourceMap = { ...sourceMap };

//   for (const ot of ots) {
//     const targetNode = getTreeNodeFromPath(ot.nodePath, tmpModule) as PCNode;

//     if (isUnreppedSourceNode(targetNode as PCNode)) {
//       continue;
//     }

//     tmpModule = patchTreeNode([ot], tmpModule);
//     const patchedTarget = getTreeNodeFromPath(ot.nodePath, tmpModule) as PCNode;

//     const assocId =
//       targetNode.name === PCSourceTagNames.PLUG
//         ? targetNode.slotId
//         : targetNode.id;
//     const assocInspectorNodeIds = sourceMap[assocId] || EMPTY_ARRAY;
//     for (const assocInspectorNodeId of assocInspectorNodeIds) {
//       let assocInspectorNode = getNestedTreeNodeById(
//         assocInspectorNodeId,
//         rootInspectorNode
//       ) as InspectorNode;

//       if (!assocInspectorNode) {
//         console.error(
//           `No inspector node assoc found for`,
//           targetNode,
//           assocInspectorNodeId
//         );
//       }
//       const inShadow = inspectorNodeInShadow(
//         assocInspectorNode,
//         getInspectorContentNode(assocInspectorNode, rootInspectorNode)
//       );
//       const shadow =
//         assocInspectorNode.name === InspectorTreeNodeName.SHADOW
//           ? assocInspectorNode
//           : inShadow
//             ? getInspectorNodeParentShadow(
//                 assocInspectorNode,
//                 rootInspectorNode
//               )
//             : null;
//       switch (ot.type) {
//         case TreeNodeOperationalTransformType.INSERT_CHILD: {
//           const { child } = ot;

//           if (isUnreppedSourceNode(child as PCNode)) {
//             break;
//           }

//           const index = patchedTarget.children
//             .filter(child => !isUnreppedSourceNode(child))
//             .indexOf(child as PCNode);

//           const pcChild = child as PCNode;
//           const instancePath = assocInspectorNode.instancePath;

//           // Note that SLOT will only have one associated inspector node
//           if (child.name === PCSourceTagNames.SLOT) {
//             let inspectorChildren: InspectorNode[];
//             [inspectorChildren, newSourceMap] = evaluateInspectorNodeChildren(
//               pcChild,
//               instancePath,
//               newGraph,
//               inShadow,
//               newSourceMap
//             );
//             const newChild = createInspectorSourceRep(
//               pcChild,
//               instancePath,
//               false,
//               inspectorChildren
//             );
//             newSourceMap = addSourceMap(newChild, newSourceMap);
//             assocInspectorNode = insertChildNode(
//               newChild,
//               index,
//               assocInspectorNode
//             );
//             rootInspectorNode = replaceNestedNode(
//               assocInspectorNode,
//               assocInspectorNode.id,
//               rootInspectorNode
//             );

//             // if in a shadow, then create a new plug as well in the instance
//             if (shadow) {
//               let shadowParent = getParentTreeNode(
//                 shadow.id,
//                 rootInspectorNode
//               );
//               const newChild = createInstanceContent(
//                 pcChild as PCSlot,
//                 instancePath,
//                 false
//               );
//               newSourceMap = addSourceMap(newChild, newSourceMap);
//               shadowParent = appendChildNode(newChild, shadowParent);
//               rootInspectorNode = replaceNestedNode(
//                 shadowParent,
//                 shadowParent.id,
//                 rootInspectorNode
//               );
//             }
//           } else {
//             let inspectorChildren: InspectorNode[];
//             [inspectorChildren, newSourceMap] = evaluateInspectorNodeChildren(
//               pcChild,
//               instancePath,
//               newGraph,
//               inShadow,
//               newSourceMap
//             );

//             if (targetNode.name === PCSourceTagNames.PLUG) {
//               if (assocInspectorNode.name === InspectorTreeNodeName.CONTENT) {
//                 const newChild = createInspectorSourceRep(
//                   pcChild,
//                   instancePath,
//                   false,
//                   inspectorChildren
//                 );
//                 newSourceMap = addSourceMap(newChild, sourceMap);
//                 assocInspectorNode = insertChildNode(
//                   newChild,
//                   index,
//                   assocInspectorNode
//                 );
//                 rootInspectorNode = replaceNestedNode(
//                   assocInspectorNode,
//                   assocInspectorNode.id,
//                   rootInspectorNode
//                 );
//               }
//             } else if (pcChild.name === PCSourceTagNames.PLUG) {
//               const slot = getPCNode(pcChild.slotId, newGraph) as PCSlot;
//               const newChild = createInstanceContent(
//                 slot,
//                 instancePath,
//                 false,
//                 inspectorChildren
//               );
//               newSourceMap = addSourceMap(newChild, newSourceMap);
//               const existingPlug = assocInspectorNode.children.find(
//                 child => child.sourceNodeId === slot.id
//               );
//               newSourceMap = removeSourceMap(existingPlug, newSourceMap);
//               rootInspectorNode = replaceNestedNode(
//                 newChild,
//                 existingPlug.id,
//                 rootInspectorNode
//               );
//             } else {
//               const newChild = createInspectorSourceRep(
//                 pcChild,
//                 instancePath,
//                 false,
//                 inspectorChildren
//               );
//               newSourceMap = addSourceMap(newChild, newSourceMap);
//               assocInspectorNode = insertChildNode(
//                 newChild,
//                 index,
//                 assocInspectorNode
//               );
//               rootInspectorNode = replaceNestedNode(
//                 assocInspectorNode,
//                 assocInspectorNode.id,
//                 rootInspectorNode
//               );
//             }
//           }
//           break;
//         }
//         case TreeNodeOperationalTransformType.MOVE_CHILD: {
//           if (
//             targetNode.name !== PCSourceTagNames.PLUG ||
//             assocInspectorNode.name === InspectorTreeNodeName.CONTENT
//           ) {
//             const { oldIndex, newIndex } = ot;
//             const schild = targetNode.children[oldIndex];
//             const nchild = targetNode.children[newIndex];
//             const fixedChild = assocInspectorNode.children.find(
//               child => child.sourceNodeId === schild.id
//             );

//             // Ick. Plugs sourceNodeId's point to slots, so there's no good way
//             // to match source node plugs with inspector node plugins except to check surounding
//             // children. Better fix would be to make assocNodeId _optional_, then add a separate sourceSlotId prop.
//             if (!fixedChild) {
//               break;
//             }

//             const fixedNewIndex = nchild
//               ? assocInspectorNode.children.findIndex(
//                   child => child.sourceNodeId === nchild.id
//                 )
//               : assocInspectorNode.children.length;

//             assocInspectorNode = removeNestedTreeNode(
//               fixedChild,
//               assocInspectorNode
//             );
//             assocInspectorNode = insertChildNode(
//               fixedChild,
//               fixedNewIndex,
//               assocInspectorNode
//             );
//             rootInspectorNode = replaceNestedNode(
//               assocInspectorNode,
//               assocInspectorNode.id,
//               rootInspectorNode
//             );
//           }
//           break;
//         }
//         case TreeNodeOperationalTransformType.REMOVE_CHILD: {
//           if (
//             targetNode.name !== PCSourceTagNames.PLUG ||
//             assocInspectorNode.name === InspectorTreeNodeName.CONTENT
//           ) {
//             const { index } = ot;
//             const child = targetNode.children[index];

//             if (isUnreppedSourceNode(child)) {
//               break;
//             }

//             const inspectorIndex = targetNode.children
//               .filter(child => !isUnreppedSourceNode(child))
//               .indexOf(child);

//             const childInspectorNode =
//               assocInspectorNode.children[inspectorIndex];

//             const pcChild = targetNode.children[index];

//             rootInspectorNode = removeNestedTreeNode(
//               childInspectorNode,
//               rootInspectorNode
//             );

//             newSourceMap = flattenTreeNode(pcChild).reduce((map, node) => {
//               return {
//                 ...map,
//                 [node.id]: undefined
//               };
//             }, newSourceMap);

//             // if content is removed & slot still exists, re-add slot
//             if (childInspectorNode.name === InspectorTreeNodeName.CONTENT) {
//               const slot = getPCNode(
//                 childInspectorNode.sourceNodeId,
//                 newGraph
//               ) as PCSlot;
//               if (slot) {
//                 const content = createInstanceContent(
//                   slot,
//                   childInspectorNode.instancePath
//                 );
//                 assocInspectorNode = insertChildNode(
//                   content,
//                   inspectorIndex,
//                   assocInspectorNode
//                 );
//                 rootInspectorNode = replaceNestedNode(
//                   assocInspectorNode,
//                   assocInspectorNode.id,
//                   rootInspectorNode
//                 );
//                 newSourceMap = addSourceMap(assocInspectorNode, newSourceMap);
//               }
//             }
//           }
//           break;
//         }
//         case TreeNodeOperationalTransformType.SET_PROPERTY: {
//           break;
//         }
//       }
//     }
//   }

//   return [rootInspectorNode, newSourceMap];
// };

export const getInspectorSourceNode = (
  node: InspectorNode,
  ancestor: InspectorNode,
  graph: DependencyGraph
): PCNode | null => {
  if (node.name === InspectorTreeNodeName.CONTENT) {
    const nodeSource = getPCNode(node.sourceSlotNodeId, graph);
    const parent = getParentTreeNode(node.id, ancestor);
    return getSlotPlug(
      getPCNode(parent.sourceNodeId, graph) as PCComponentInstanceElement,
      nodeSource as PCSlot
    );
  } else {
    return getPCNode(node.sourceNodeId, graph);
  }
};

export type InstanceVariantInfo = {
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
      getPCNode(parent.sourceNodeId, graph) &&
      getPCNode(parent.sourceNodeId, graph).name === PCSourceTagNames.SLOT
  );
};

export const getTopMostInspectorInstance = (
  current: InspectorNode,
  root: InspectorNode
) => {
  while (
    inspectorNodeInShadow(current, root) ||
    current.name === InspectorTreeNodeName.SHADOW
  ) {
    current = getParentTreeNode(current.id, root);
  }

  return current;
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
        child.sourceNodeId === slot.sourceNodeId
      );
    });
  } else {
    return child;
  }
};

/**
 * Used primarily to check for circular references
 */

export const inspectorNodeInInstanceOfComponent = (
  componentId: string,
  inspectorNode: InspectorNode,
  root: InspectorNode
) => {
  return [inspectorNode, ...getTreeNodeAncestors(inspectorNode.id, root)].some(
    (parent: InspectorNode) => {
      return (
        parent.name === InspectorTreeNodeName.SOURCE_REP &&
        parent.sourceNodeId === componentId
      );
    }
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
  const sourceNodeId = node.sourceNodeId;

  const relatedInspectorNode = flattenTreeNode(rootInspectorNode).find(child => (
    child.instancePath === instancePath &&
    child.sourceNodeId === sourceNodeId
  ));

  if (!relatedInspectorNode) {
    console.error(`Inspector node ${instancePath}.${sourceNodeId} not found`);
    return rootInspectorNode;
  }

  rootInspectorNode = expandInspectorNodeById(
    relatedInspectorNode.id,
    rootInspectorNode
  );

  return updateAlts(rootInspectorNode);
};

export const expandInspectorNodeById = (
  id: string,
  rootInspectorNode: InspectorNode
) => {
  return updateAlts(
    updateNestedNodeTrail(
      getTreeNodePath(id, rootInspectorNode),
      rootInspectorNode,
      (node: InspectorNode) => {
        return {
          ...node,
          expanded: true
        };
      }
    )
  );
};

export const getInheritedOverridesOverrides = (
  inspectorNode: InspectorNode,
  rootInspectorNode: InspectorNode,
  graph: DependencyGraph
) => {
  if (!inspectorNode.sourceNodeId) {
    return null;
  }
  const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);
  let overrides: PCOverride[] = getOverrides(sourceNode);
  const parent = getParentTreeNode(inspectorNode.id, rootInspectorNode);
  if (parent && parent.sourceNodeId) {
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
    if (!inspectorNode.sourceNodeId) {
      return overrides;
    }
    const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);
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
        last(override.targetIdPath) === inspectorNode.sourceNodeId;
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
  return flattenTreeNode(state.sourceNodeInspector).find(child => child.sourceNodeId === sourceNode.id);
};

export const getInspectorNodeBySourceNodeId = <TState extends PCEditorState>(
  sourceNodeId: string,
  root: InspectorNode
) => {
  return flattenTreeNode(root).find(child => !child.instancePath && child.sourceNodeId === sourceNodeId);
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

export const getInspectorContentNode = memoize(
  (node: InspectorNode, root: InspectorNode) => {
    return getInspectorContentNodeContainingChild(node, root) || node;
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

    return flattenTreeNode(rootInspector).find((child: InspectorTreeBaseNode<any>) => {
      return (
        child.name === InspectorTreeNodeName.SOURCE_REP,
        child.instancePath === instancePath &&
          child.sourceNodeId === node.sourceNodeId
      );
    });
  }
);

export const getInspectorSyntheticNode = memoize(
  (
    node: InspectorNode,
    documents: SyntheticDocument[]
  ): SyntheticVisibleNode => {
    const instancePath = node.instancePath;
    const nodePath =
      (node.instancePath ? instancePath + "." : "") + node.sourceNodeId;

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

/*

Considerations:

- components
- slots
- plugs

To ignore:

- overrides


*/
