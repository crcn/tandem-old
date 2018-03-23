import { memoize } from "common/utils";

// Note that Element types are only provided for simplification

export type TreeNodeAttribute = {
  namespace: string;
  name: string;
  value: string;
}

export type TreeNode = {
  children: TreeNode[];
  name: string;
  namespace?: string;
  attributes: TreeNodeAttribute[]
};

export type NodeFilter = (node: TreeNode) => boolean;

export const findNestedNode = memoize((current: TreeNode, filter: NodeFilter) => {
  if (filter(current)) {
    return current;
  }
  const {children} = current;
  for (let i = 0, {length} = children; i < length; i++) {
    const foundChild = findNestedNode(current, filter);
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
    filterNestedNodes(current, filter, found);
  }
  return found;
});

export const getAttributesWithNamespace = memoize((current: TreeNode, namespace: string) => current.attributes.filter(attribute => attribute.namespace === namespace));

export const getAttribute = memoize((current: TreeNode, name: string, namespace?: string) => {
  const attr = current.attributes.find(attr => attr.name === name && attr.namespace == namespace);
  return attr;
});

export const getAttributeValue = (current: TreeNode, name: string, namespace?: string) => {
  const attr = getAttribute(current, name, namespace);
  return attr && attr.value;
};