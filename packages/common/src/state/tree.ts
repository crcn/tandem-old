import { memoize } from "../utils/memoization";
import { stringifyTreeNodeToXML } from "../utils/xml";
import * as crc32 from "crc32";
import { merge } from "lodash";
import { arraySplice } from "../utils/array";
import { UIDGenerator, createUIDGenerator } from "../utils/uid";
import { generateUID } from "../utils/uid";
import { EMPTY_ARRAY, EMPTY_OBJECT } from "../utils/object";
import { RecursivePartial } from "../utils/types";

export const DEFAULT_NAMESPACE = "undefined";

export enum TreeMoveOffset {
  APPEND = 0,
  BEFORE = -1,
  AFTER = 1
}

export type NamespacedAttributes = {
  namespace: string;
  name: string;
  value: any;
};

export type TreeNodeAttributes = {
  [identifier: string]: {
    [identifier: string]: any;
  };
  [DEFAULT_NAMESPACE]: {
    [identifier: string]: any;
  };
};

export type TreeNodeUpdater<TTree extends TreeNode<any, any>> = (
  node: TTree,
  index?: number,
  path?: number[]
) => TTree;

export type TreeNode<
  TName extends string,
  TAttributes extends TreeNodeAttributes
> = {
  id: string;
  children: TreeNode<any, any>[];
  name: TName;
  namespace?: string;
  attributes: TAttributes;
};

export type NodeFilter = (node: TreeNode<any, any>) => boolean;

export const findNestedNode = memoize(
  (current: TreeNode<any, any>, filter: NodeFilter) => {
    if (filter(current)) {
      return current;
    }
    const { children } = current;
    for (let i = 0, { length } = children; i < length; i++) {
      const foundChild = findNestedNode(children[i], filter);
      if (foundChild) {
        return foundChild;
      }
    }
  }
);

export const createTreeNode = (
  name: string,
  attributes: TreeNodeAttributes = {
    [DEFAULT_NAMESPACE]: {}
  },
  children: TreeNode<any, any>[] = [],
  namespace: string = DEFAULT_NAMESPACE
): TreeNode<any, any> => ({
  id: generateUID(),
  name,
  namespace,
  attributes,
  children
});

export const createNodeNameMatcher = memoize(
  (name: string, namespace?: string) => node =>
    node.name === name && node.namespace == namespace
);

export const filterNestedNodes = memoize(
  (
    current: TreeNode<any, any>,
    filter: NodeFilter,
    found: TreeNode<any, any>[] = []
  ) => {
    if (filter(current)) {
      found.push(current);
    }
    const { children } = current;
    for (let i = 0, { length } = children; i < length; i++) {
      filterNestedNodes(current.children[i], filter, found);
    }
    return found;
  }
);

export const getAttribute = (
  current: TreeNode<any, any>,
  name: string,
  namespace: string = DEFAULT_NAMESPACE
) => current.attributes[namespace] && current.attributes[namespace][name];

export const getChildParentMap = memoize((current: TreeNode<any, any>): {
  [identifier: string]: TreeNode<any, any>;
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
  [identifier: string]: TreeNode<any, any>;
};

export const getTreeNodeIdMap = memoize(
  (current: TreeNode<any, any>): TreeNodeIdMap => {
    if (!current.id) {
      throw new Error(`ID missing from node`);
    }

    const map = {
      [current.id]: current
    };
    Object.assign(map, ...current.children.map(getTreeNodeIdMap));
    return map;
  }
);

export const flattenTreeNode = memoize((current: TreeNode<any, any>) =>
  Object.values(getTreeNodeIdMap(current))
);

export const getTreeNodePath = memoize(
  (nodeId: string, root: TreeNode<any, any>) => {
    const childParentMap = getChildParentMap(root);
    const idMap = getTreeNodeIdMap(root);
    let current = idMap[nodeId];
    const path: number[] = [];
    while (1) {
      const parent = childParentMap[current.id];
      if (!parent) break;
      const i = parent.children.indexOf(current);
      if (i === -1) {
        throw new Error(`parent child mismatch. Likely id collision`);
      }
      path.unshift(i);
      current = parent;
    }

    return path;
  }
);

export const findTreeNodeParent = (
  nodeId: string,
  root: TreeNode<any, any>,
  filter: (node: TreeNode<any, any>) => boolean
) => {
  const path = getTreeNodePath(nodeId, root);
  if (!path.length) return null;
  for (let i = path.length; i--; ) {
    const parent = getTreeNodeFromPath(path.slice(0, i), root);
    if (filter(parent)) {
      return parent;
    }
  }
};

export const findNodeByTagName = memoize(
  (root: TreeNode<any, any>, name: string, namespace?: string) => {
    return findNestedNode(
      root,
      child => child.name === name && child.namespace == namespace
    );
  }
);

export const getTreeNodeFromPath = memoize(
  <TNode extends TreeNode<any, any>>(path: number[], root: TNode) => {
    let current: TreeNode<any, any> = root;
    for (let i = 0, { length } = path; i < length; i++) {
      current = current.children[path[i]];
    }
    return current as TNode;
  }
);

export const getNestedTreeNodeById = memoize(
  <TNode extends TreeNode<any, any>>(id: string, root: TNode) => {
    return getTreeNodeIdMap(root)[id];
  }
);

export const getTreeNodeHeight = memoize(
  <TNode extends TreeNode<any, any>>(id: string, root: TNode) =>
    getTreeNodePath(id, root).length
);

export const generateTreeChecksum = memoize((root: TreeNode<any, any>) =>
  crc32(stringifyTreeNodeToXML(root))
);
export const getTreeNodeUidGenerator = memoize((root: TreeNode<any, any>) => {
  const rightMostTreeNode = getRightMostTreeNode(root);
  return createUIDGenerator(crc32(rightMostTreeNode.id));
});

export const getRightMostTreeNode = (current: TreeNode<any, any>) => {
  return current.children.length
    ? getRightMostTreeNode(current.children[current.children.length - 1])
    : current;
};

export const removeNestedTreeNode = (
  nestedChild: TreeNode<any, any>,
  current: TreeNode<any, any>
) =>
  removeNestedTreeNodeFromPath(
    getTreeNodePath(nestedChild.id, current),
    current
  );

export const removeNestedTreeNodeFromPath = (
  path: number[],
  current: TreeNode<any, any>
) => updateNestedNodeFromPath(path, current, child => null);

export const updateNestedNode = <
  TTree extends TreeNode<any, any>,
  TParent extends TreeNode<any, any>
>(
  nestedChild: TTree,
  current: TParent,
  updater: TreeNodeUpdater<TTree>
) =>
  updateNestedNodeFromPath(
    getTreeNodePath(nestedChild.id, current),
    current,
    updater
  ) as TParent;
export const replaceNestedNode = (
  newChild: TreeNode<any, any>,
  oldChildId: string,
  root: TreeNode<any, any>
) =>
  updateNestedNodeFromPath(
    getTreeNodePath(oldChildId, root),
    root,
    () => newChild
  );

export const updateNestedNodeFromPath = (
  path: number[],
  current: TreeNode<any, any>,
  updater: TreeNodeUpdater<any>,
  depth: number = 0
) => {
  if (depth === path.length) {
    return updater(current);
  }

  const updatedChild = updateNestedNodeFromPath(
    path,
    current.children[path[depth]],
    updater,
    depth + 1
  );

  return {
    ...current,
    children: updatedChild
      ? arraySplice(current.children, path[depth], 1, updatedChild)
      : arraySplice(current.children, path[depth], 1)
  };
};

export const updateNestedNodeTrail = (
  path: number[],
  current: TreeNode<any, any>,
  updater: TreeNodeUpdater<any>,
  depth: number = 0
) => {
  if (depth !== path.length) {
    const updatedChild = updateNestedNodeTrail(
      path,
      current.children[path[depth]],
      updater,
      depth + 1
    );
    current = {
      ...current,
      children: updatedChild
        ? arraySplice(current.children, path[depth], 1, updatedChild)
        : arraySplice(current.children, path[depth], 1)
    };
  }
  return updater(current, depth, path);
};

export const setNodeAttribute = <TTree extends TreeNode<any, any>>(
  node: TTree,
  name: string,
  value: any,
  namespace: string = DEFAULT_NAMESPACE
): TTree => ({
  ...(node as any),
  attributes: {
    ...node.attributes,
    [namespace]: {
      ...node.attributes[namespace],
      [name]: value
    }
  }
});

export const mergeNodeAttributes = <
  N extends string,
  P extends TreeNodeAttributes
>(
  node: TreeNode<N, P>,
  attributes: RecursivePartial<P>
): TreeNode<N, P> => ({
  ...node,
  attributes: merge({}, node.attributes, attributes)
});

export const appendChildNode = <TTree extends TreeNode<any, any>>(
  child: TreeNode<any, any>,
  parent: TTree
): TTree => insertChildNode(child, parent.children.length, parent);

export const insertChildNode = <TTree extends TreeNode<any, any>>(
  child: TreeNode<any, any>,
  index: number,
  parent: TTree
): TTree => ({
  ...(parent as any),
  children: arraySplice(parent.children, index, 1, child)
});

export const cloneTreeNode = <TTree extends TreeNode<any, any>>(
  node: TTree
) => ({
  ...(node as any),
  id: generateUID(),
  children: node.children.map(child => cloneTreeNode(child))
});

export const getParentTreeNode = memoize(
  (nodeId: string, root: TreeNode<any, any>) => getChildParentMap(root)[nodeId]
);

export const addTreeNodeIds = <TTree extends TreeNode<any, any>>(
  node: TTree,
  seed: string = ""
): TTree => {
  return node.id ? node : cloneTreeNode(node);
};
