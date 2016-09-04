
export function findNode<T extends Node>(path: Array<number>, root: Node): T {
  let currentNode: Node = root;
  for (let i = 0, n = path.length; i < n; i++) {
    currentNode = currentNode.childNodes[path[i]];
  }
  return <T>currentNode;
}

export function getNodePath(node: Node) {
  let currentNode = node;
  let parent: Node;
  const nodePath = [];
  let i = 0;
  while (parent = currentNode.parentNode) {
    nodePath.unshift(Array.prototype.indexOf.call(parent.childNodes, currentNode));
    currentNode = parent;
  }
  return nodePath;
}