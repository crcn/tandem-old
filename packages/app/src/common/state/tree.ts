import { memoize } from "../utils/memoization";
import { stringifyTreeNodeToXML } from "../utils/xml";
import * as crc32 from "crc32";
import { arraySplice } from "../utils/array";

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

export const getChildParentMap = memoize((current: TreeNode): Map<TreeNode, TreeNode> => {
  let parentChildMap: Map<TreeNode, TreeNode> = new Map();
  for (let i = current.children.length; i--;) {
    parentChildMap.set(current.children[i], current);
    const nestedMap = getChildParentMap(current.children[i]);
    for (const [nc, np] of Array.from(nestedMap.entries())) {
      parentChildMap.set(nc, np);
    }
  }
  return parentChildMap;
});

export type TreeNodeIdMap = {
  [identifier: string]: TreeNode
}

export const getTreeNodeIdMap = memoize((current: TreeNode): TreeNodeIdMap => {

  const map = {
    [current.id]: current
  };
  Object.assign(map, ...current.children.map(getTreeNodeIdMap));
  return map;
});


export const getTeeNodePath = memoize((node: TreeNode, root: TreeNode) => {
  const childParentMap = getChildParentMap(root);
  let current = node;
  const path: number[] = [];
  while(1) {
    const parent = childParentMap.get(current);
    if (!parent) break;
    path.push(parent.children.indexOf(current));
    current = parent;
  }
  return path;
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

export const generateTreeChecksum = memoize((root: TreeNode) => crc32(stringifyTreeNodeToXML(root)))

export const removeNestedTreeNode = (nestedChild: TreeNode, current: TreeNode) => removeNestedTreeNodeFromPath(getTeeNodePath(nestedChild, current), current);

export const removeNestedTreeNodeFromPath = (path: number[], current: TreeNode) => updatedNestedNodeFromPath(path, current, (child) => null);

export const updatedNestedNode = (nestedChild: TreeNode, current: TreeNode, updater: (child: TreeNode) => TreeNode) => updatedNestedNodeFromPath(getTeeNodePath(nestedChild, current), current, updater);

export const updatedNestedNodeFromPath = (path: number[], current: TreeNode, updater: (child: TreeNode) => TreeNode, depth: number = 0) => {
  if (depth === path.length) {
    return updater(current);
  }

  const updatedChild = updatedNestedNodeFromPath(path, current.children[path[depth]], updater, depth + 1);

  return {
    ...current,
    children: updatedChild ? arraySplice(current.children, path[depth], 1, updatedChild) : arraySplice(current.children, path[depth], 1)
  };
};

export const setNodeAttribute = (node: TreeNode, name: string, value: any, namespace: string = DEFAULT_NAMESPACE) => ({
  ...node,
  attributes: {
    ...node.attributes,
    [namespace]: {
      ...node.attributes[namespace],
      [name]: value
    }
  }
})

export const getParentTreeNode = memoize((node: TreeNode, root: TreeNode) => getChildParentMap(root).get(node));
