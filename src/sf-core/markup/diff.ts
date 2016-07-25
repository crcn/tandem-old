import { findNode, getNodePath } from './utils';

import {
  INode,
  IValueNode,
  ITextNode,
  IElement,
  IAttribute,
  ICommentNode,
  NodeTypes,
  ContainerNode
} from './base';

/*
TODOS:
*/

interface INodeChange {
  readonly type:string;
  readonly nodePath:Array<number>;
  readonly node:INode;
}

export abstract class NodeChange<T extends INode> implements INodeChange {
  readonly nodePath:Array<number>;
  constructor(readonly type:string, readonly node:T) {
    this.nodePath = getNodePath(node);
  }
}

export const REMOVE_CHILD = 'removeChild';
export class RemoveChildChange extends NodeChange<INode> {
  constructor(readonly node:INode) {
    super(REMOVE_CHILD, node);
  }
}

export const ADD_CHILD = 'addChild';
export class AddChildChange extends NodeChange<INode> {
  constructor(readonly node:INode) {
    super(ADD_CHILD, node);
  }
}

export const SET_NODE_VALUE = 'setNodeValue';
export class SetNodeValueChange extends NodeChange<IValueNode> {
  constructor(node:IValueNode, readonly nodeValue:any) {
    super(SET_NODE_VALUE, node);
  }
}

export const SET_ATTRIBUTE = 'setAttribute';
export class SetAttributeChange extends NodeChange<IElement> {
  constructor(node:IElement, readonly key:string, readonly value:any) {
    super(SET_ATTRIBUTE, node);
  }
}

export const REMOVE_ATTRIBUTE = 'removeAttribute';
export class RemoveAttributeChange extends NodeChange<IElement> {
  constructor(node:IElement, readonly key:string) {
    super(REMOVE_ATTRIBUTE, node);
  }
}

export const MOVE_CHILD = 'moveChild';
export class MoveChildChange extends NodeChange<INode> {
  readonly toPath:Array<number>;
  constructor(node:INode, newNode:INode) {
    super(MOVE_CHILD, node);
    this.toPath = getNodePath(newNode);
  }
}

class VNode extends ContainerNode {
  constructor(readonly target:INode) {
    super();
    if (target.nodeType === NodeTypes.ELEMENT) {
      Array.prototype.forEach.apply((<IElement>target).childNodes, (child) => {
        this.appendChild(new VNode(target));
      });
    }
  }
  cloneNode(deep?:boolean) {
    const clone = new VNode(this.target);
    if (deep) {
      for (const child of this.childNodes) {
        clone.appendChild(child.cloneNode(deep));
      }
    }
    return clone;
  }
}


// TODO - use web workers to compute this
export function diff(oldNode:INode, newNode:INode):Array<INodeChange> {
  const changes = [];
  // const anode = new VNode(oldNode);
  // const bnode = new VNode(newNode);

  addChanges([oldNode], [newNode], changes);
  return changes;
};

function addChanges(unmatchedOldNodes:Array<INode>, unmatchedNewNodes:Array<INode>, changes:Array<INodeChange>) {

  const mutationChanges:Array<INodeChange> = [];
  // const newChildNodes = unmatchedOldNodes.concat();

  // first match up the old and new nodes
  for (let i = 0; i < unmatchedNewNodes.length; i++) {
    const newNode = unmatchedNewNodes[i];
    const candidates:Array<INode> = [];

    for (const oldNode of unmatchedOldNodes) {
      // node names must be identical for them to be candidates
      if (oldNode.nodeName !== newNode.nodeName) continue;
      candidates.push(oldNode);
    }

    if (!candidates.length) continue;

    // next, score the candidates according to the position, children,
    // and attributes

    let bestCandidate:INode;
    let newNodeChanges = [];

    if (isValueNodeType(newNode)) {
      bestCandidate = candidates[0];
      diffValueNode(<IValueNode>bestCandidate, <IValueNode>newNode, newNodeChanges);
    } else {
      let bestCandidateChanges = [];
      for (const candidate of candidates) {
        const candidateChanges = [];

        // TODO - add depth here so that this isn't so expensive. This is
        // kind of ratchet...
        diffElement(<IElement>candidate, <IElement>newNode, candidateChanges);

        // grab the candidate with the fewest changes
        // TODO - possibly weight each change as well -- adding attributes for instance is weighted
        // less than adding or removing elements
        if (!bestCandidate || candidateChanges.length < bestCandidateChanges.length) {
          bestCandidate        = candidate;
          bestCandidateChanges = candidateChanges;
        }
      }

      newNodeChanges = bestCandidateChanges;
    }

    if (bestCandidate) {

      // move the node
      if (bestCandidate.parentNode) {

        // may be working with the DOM here -- indexOf doesn't exist in childNodes prop  - use Array
        // prototype work-around
        if (Array.prototype.indexOf.call(bestCandidate.parentNode.childNodes, bestCandidate) !== Array.prototype.indexOf.call(newNode.parentNode.childNodes, newNode)) {
          newNodeChanges.push(new MoveChildChange(bestCandidate, newNode));
        }
      }

      mutationChanges.push(...newNodeChanges);

      unmatchedNewNodes.splice(unmatchedNewNodes.indexOf(newNode), 1);
      unmatchedOldNodes.splice(unmatchedOldNodes.indexOf(bestCandidate), 1);
      i--;
    }
  }

  // next, remove the unmatched nodes
  // TODO - may need to reverse this
  for (const unmatchedNode of unmatchedOldNodes) {
    changes.push(new RemoveChildChange(unmatchedNode));
  }

  // next, add the new nodes
  for (const unmatchedNode of unmatchedNewNodes) {
    changes.push(new AddChildChange(unmatchedNode));
  }

  changes.push(...mutationChanges);
}

function diffElement(oldElement:IElement, newElement:IElement, changes:Array<INodeChange>) {
  const keepAttributes:any = {};

  // diff the attributes
  for (const attribute of newElement.attributes) {
    keepAttributes[attribute.name] = true;
    if (oldElement.getAttribute(attribute.name) !== attribute.value) {
      changes.push(new SetAttributeChange(newElement, attribute.name, attribute.value));
    }
  }

  for (const attribute of oldElement.attributes) {
    if (!keepAttributes[attribute.name]) {
        changes.push(new RemoveAttributeChange(newElement, attribute.name));
    }
  }

  // diff children
  addChanges(
    Array.prototype.slice.call(oldElement.childNodes),
    Array.prototype.slice.call(newElement.childNodes),
    changes
  );
}

function diffValueNode(oldValueNode:IValueNode, newValueNode:IValueNode, changes:Array<INodeChange>) {
  if (oldValueNode.nodeValue !== newValueNode.nodeValue) {
    changes.push(new SetNodeValueChange(newValueNode, newValueNode.nodeValue));
  }
}

function isValueNodeType(node:INode) {
  return [NodeTypes.COMMENT, NodeTypes.TEXT].indexOf(node.nodeType) !== -1;
}