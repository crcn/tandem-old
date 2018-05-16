import { memoize } from "../utils/memoization";
import { stringifyTreeNodeToXML } from "../utils/xml";
import * as crc32 from "crc32";
import { arraySplice } from "../utils/array";
import { UIDGenerator, createUIDGenerator } from "../utils/uid";

export const DEFAULT_NAMESPACE = "undefined";

export type NamespacedAttributes = {
  namespace: string;
  name: string;
  value: any;
};

export type TreeNodeAttributes = {
  [identifier: string]: {
    [identifier: string]: any
  }
};

export type TreeNodeUpdater = (node: TreeNode, index?: number, path?: number[]) => TreeNode;

export type TreeNode = {
  id?: string;
  children: TreeNode[];
  name: string;
  namespace?: string;
  attributes: TreeNodeAttributes
};

export type NodeFilter = (node: TreeNode) => boolean;

export const findNestedNode = memoize((current: TreeNode, filter: NodeFilter) => {
  if (filter(current)) {
    return current;
  }
  const {children} = current;
  for (let i = 0, {length} = children; i < length; i++) {
    const foundChild = findNestedNode(children[i], filter);
    if (foundChild) {
      return foundChild;
    }
  }
});


export const createNodeNameMatcher = memoize((name: string, namespace?: string) => node => node.name
 === name && node.namespace == namespace);

export const filterNestedNodes = memoize((current: TreeNode, filter: NodeFilter, found: TreeNode[] = []) => {
  if (filter(current)) {
    found.push(current);
  }
  const {children} = current;
  for (let i = 0, {length} = children; i < length; i++) {
    filterNestedNodes(current.children[i], filter, found);
  }
  return found;
});

export const getAttribute = (current: TreeNode, name: string, namespace: string = DEFAULT_NAMESPACE) => current.attributes[namespace] && current.attributes[namespace][name];

export const getChildParentMap = memoize((current: TreeNode): {
  [identifier: string]: TreeNode
} => {
  const idMap = getTreeNodeIdMap(current);
  const parentChildMap: any = {};


  for (const id in idMap) {
    const parent = idMap[id];
    for (const child of parent.children) {
      parentChildMap[child.id] = parent;
    }
  }
  return parentChildMap;
});

export type TreeNodeIdMap = {
  [identifier: string]: TreeNode
}

export const getTreeNodeIdMap = memoize((current: TreeNode): TreeNodeIdMap => {

  if (!current.id) {
    throw new Error(`ID missing from node`);
  }

  const map = {
    [current.id]: current
  };
  Object.assign(map, ...current.children.map(getTreeNodeIdMap));
  return map;
});

export const flattenTreeNode = memoize((current: TreeNode) => Object.values(getTreeNodeIdMap(current)));


export const getTreeNodePath = memoize((nodeId: string, root: TreeNode) => {
  const childParentMap = getChildParentMap(root);
  const idMap = getTreeNodeIdMap(root);
  let current = idMap[nodeId];
  const path: number[] = [];
  while(1) {
    const parent = childParentMap[current.id];
    if (!parent) break;
    path.unshift(parent.children.indexOf(current));
    current = parent;
  }

  return path;
});

export const findTreeNodeParent = (nodeId: string, root: TreeNode, filter: (node: TreeNode) => boolean) => {
  const path = getTreeNodePath(nodeId, root);
  if (!path.length) return null;
  for (let i = path.length; i--;) {
    const parent = getTreeNodeFromPath(path.slice(0, i), root);
    if (filter(parent)) {
      return parent;
    }
  }
}

export const findNodeByTagName = memoize((root: TreeNode, name: string, namespace?: string) => {
  return findNestedNode(root, child => child.name === name && child.namespace == namespace)
});

export const getTreeNodeFromPath = memoize(<TNode extends TreeNode>(path: number[], root: TNode) => {
  let current: TreeNode = root;
  for (let i = 0, {length} = path; i < length; i++) {
    current = current.children[path[i]];
  }
  return current;
});

export const getNestedTreeNodeById = memoize(<TNode extends TreeNode>(id: string, root: TNode) => {
  return getTreeNodeIdMap(root)[id];
});

export const generateTreeChecksum = memoize((root: TreeNode) => crc32(stringifyTreeNodeToXML(root)));
export const getTreeNodeUidGenerator = memoize((root: TreeNode) => {
  const rightMostTreeNode = getRightMostTreeNode(root);
  return createUIDGenerator(crc32(rightMostTreeNode.id));
});

export const getRightMostTreeNode = (current: TreeNode) => {
  return current.children.length ? getRightMostTreeNode(current.children[current.children.length - 1]) : current;
};

export const removeNestedTreeNode = (nestedChild: TreeNode, current: TreeNode) => removeNestedTreeNodeFromPath(getTreeNodePath(nestedChild.id, current), current);

export const removeNestedTreeNodeFromPath = (path: number[], current: TreeNode) => updateNestedNodeFromPath(path, current, (child) => null);

export const updateNestedNode = (nestedChild: TreeNode, current: TreeNode, updater: TreeNodeUpdater) => updateNestedNodeFromPath(getTreeNodePath(nestedChild.id, current), current, updater);
export const replaceNestedNode = (newChild: TreeNode, oldChildId: string, root: TreeNode) => updateNestedNodeFromPath(getTreeNodePath(oldChildId, root), root, () => newChild);

export const updateNestedNodeFromPath = (path: number[], current: TreeNode, updater: TreeNodeUpdater, depth: number = 0) => {
  if (depth === path.length) {
    return updater(current);
  }

  const updatedChild = updateNestedNodeFromPath(path, current.children[path[depth]], updater, depth + 1);


  return {
    ...current,
    children: updatedChild ? arraySplice(current.children, path[depth], 1, updatedChild) : arraySplice(current.children, path[depth], 1)
  };
};

export const updateNestedNodeTrail = (path: number[], current: TreeNode, updater: TreeNodeUpdater, depth: number = 0) => {
  if (depth !== path.length) {
    const updatedChild = updateNestedNodeTrail(path, current.children[path[depth]], updater, depth + 1);
    current = {
      ...current,
      children: updatedChild ? arraySplice(current.children, path[depth], 1, updatedChild) : arraySplice(current.children, path[depth], 1)
    };
  }
  return updater(current, depth, path);
};


export const setNodeAttribute = <TTree extends TreeNode>(node: TTree, name: string, value: any, namespace: string = DEFAULT_NAMESPACE): TTree => ({
  ...(node as any),
  attributes: {
    ...node.attributes,
    [namespace]: {
      ...node.attributes[namespace],
      [name]: value
    }
  }
});

export const appendChildNode = <TTree extends TreeNode>(child: TTree, parent: TTree): TTree => ({
  ...(parent as any),
  children: [
    ...parent.children,
    child
  ]
});

export const cloneNode = <TTree extends TreeNode>(node: TTree, generateUID: UIDGenerator) => ({
  ...(node as any),
  id: generateUID(),
  children: node.children.map(child => cloneNode(child, generateUID))
});

export const getParentTreeNode = memoize((nodeId: string, root: TreeNode) => getChildParentMap(root)[nodeId]);

export const addTreeNodeIds = <TTree extends TreeNode>(node: TTree, seed: string = ""): TTree => {
  return node.id ? node : cloneNode(node, createUIDGenerator(seed + generateTreeChecksum(node)));
};

export const stripTreeNodeIds = (node: TreeNode) => ({
  ...node,
  id: undefined,
  children: node.children.map(stripTreeNodeIds)
});