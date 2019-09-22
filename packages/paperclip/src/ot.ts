import { Mutation, getValue } from "immutable-ot";
import { PCNode } from "./dsl";

export const isNodeMutation = (mutation: Mutation) => {
  const childrenIndex = mutation.path.lastIndexOf("children");
  return childrenIndex === 0 || childrenIndex === mutation.path.length - 1;
};

export const getMutationTargetNode = (tree: PCNode, mutation: Mutation) => {
  const childrenIndex = mutation.path.lastIndexOf("children");
  return childrenIndex === -1
    ? tree
    : getValue(tree, mutation.path.slice(0, childrenIndex));
};
