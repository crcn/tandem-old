import { findNode, getNodePath } from './utils';
import { thread } from '../workers';

import {
  INode,
  IValueNode,
  ITextNode,
  IElement,
  ICommentNode,
  NodeTypes,
  ContainerNode
} from './base';

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


class VNode extends ContainerNode {
  constructor(readonly target:INode) {
    super();
    if (target instanceof ContainerNode) {
      // (<ContainerNode>(target.appendChild)
    }
  }
}


// TODO - use web workers to compute this
export default thread(function(oldNode:INode, newNode:INode):Array<INodeChange> {
  return [];
});

