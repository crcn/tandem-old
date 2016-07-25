import { findNode, getNodePath } from './utils';
import { INode, IValueNode, ITextNode, IElement, ICommentNode, NodeTypes } from './base';

/*
TODOS:
*/

interface INodeChange {
  readonly nodePath:Array<number>;
  readonly node:INode;
}

export abstract class NodeChange<T extends INode> implements INodeChange {
  readonly nodePath:Array<number>;
  constructor(readonly node:T) {
    this.nodePath = getNodePath(node);
  }
}

export class ValueNodeChange extends NodeChange<ITextNode> {
  constructor(readonly node:ITextNode, readonly nodeValue:any) {
    super(node);
  }
}

export default function diff(oldNode:INode, newNode:INode):Array<INodeChange> {
  const changes = [];
  addNodeChanges(oldNode, newNode, changes);
  return changes;
}

function addNodeChanges(oldNode:INode, newNode:INode, changes:Array<INodeChange>) {
  switch(oldNode.nodeType) {
    case NodeTypes.TEXT: return addValueNodeChange(<IValueNode>oldNode, <IValueNode>newNode, changes);
    case NodeTypes.COMMENT: return addValueNodeChange(<IValueNode>oldNode, <IValueNode>newNode, changes);
  }
}

function addValueNodeChange(oldNode:IValueNode, newNode:IValueNode, changes:Array<INodeChange>) {
  if (oldNode.nodeValue !== newNode.nodeValue) {
    changes.push(new ValueNodeChange(oldNode, newNode.nodeValue));
  }
}
