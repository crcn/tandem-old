import { INode, IContainerNode } from './base';

export function findNode<T extends INode>(path:Array<number>, root:IContainerNode):T {
  let currentNode:INode = root;
  for (let i = 0, n = path.length; i < n; i++) {
    currentNode = (<IContainerNode>currentNode).childNodes[path[i]];
  }
  return <T>currentNode;
}

export function getNodePath(node:INode) {
  let currentNode = node;
  let parentNode:IContainerNode;
  const nodePath = [];
  let i = 0;
  while(parentNode = currentNode.parentNode) {
    nodePath.unshift(Array.prototype.indexOf.call(parentNode.childNodes, currentNode));
    currentNode = parentNode;
  }
  return nodePath;
}