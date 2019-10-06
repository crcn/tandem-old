import { Mutation, getValue, diff, defaultAdapter, patch } from "immutable-ot";
import { PCNode } from "./dsl";
import { TreeNode } from "tandem-common";

export const getMutationTargetNode = (tree: PCNode, mutation: Mutation) => {
  const childrenIndex = mutation.path.lastIndexOf("children");
  return childrenIndex === -1
    ? tree
    : getValue(tree, mutation.path.slice(0, childrenIndex));
};

const diffAdapter = {
  ...defaultAdapter,
  diffable(a: TreeNode<any>, b: TreeNode<any>) {
    return a && a.id ? a.id === b.id : true;
  },
  equals(a: TreeNode<any>, b: TreeNode<any>) {
    return a === b || (a && b && a.id === b.id);
  },
  typeEquals(a: TreeNode<any>, b: TreeNode<any>) {
    return a.name === b.name;
  }
};

export const diffTreeNode = <TNode extends TreeNode<any>>(
  oldNode: TNode,
  newNode: TNode
) => diff(oldNode, newNode, { adapter: diffAdapter });
export const patchTreeNode = <TNode extends TreeNode<any>>(
  oldNode: TNode,
  mutations: Mutation[]
) => patch(oldNode, mutations);
