import { INode, IContainerNode } from './base';

export function findNode(path:Array<number>, root:IContainerNode) {
  let currentNode:INode = root;
  for (let i = 0, n = path.length; i < n; i++) {
    currentNode = (<IContainerNode>currentNode).childNodes[path[i]];
  }
  return currentNode;
}

export function getNodePath(node:INode) {
  let currentNode = node;
  let parentNode:IContainerNode;
  const nodePath = [];
  let i = 0;
  while(parentNode = currentNode.parentNode) {
    nodePath.unshift(parentNode.childNodes.indexOf(currentNode));
    currentNode = parentNode;
  }
  return nodePath;
}