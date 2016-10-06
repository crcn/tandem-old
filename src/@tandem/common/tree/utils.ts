import { TreeNode } from "./core";

export function traverseTree<T extends TreeNode<any>>(node: T, each: (node: T) => any) {
  each(node);
  node.children.forEach((child) => traverseTree(child, each));
};

export function filterTree<T extends TreeNode<any>>(node: T, filter: (node: T) => boolean): T[] {
  const nodes = [];
  traverseTree(node, (child) => {
    if (filter(child)) nodes.push(child);
  });
  return nodes;
};

export function flattenTree<T extends TreeNode<any>>(node: T, each: (node: T) => any) {
  return filterTree(node, child => true);
};

export function findTreeNode<T extends TreeNode<any>>(node: T, filter: (node: T) => boolean) {
  if (filter(node)) return node;
  return node.children.find(child => findTreeNode(child, filter));
};