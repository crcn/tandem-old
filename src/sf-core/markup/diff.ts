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
}

export abstract class NodeChange<T extends INode> implements INodeChange {
  constructor(readonly type:string) {

  }
}

export const MOVE_CURSOR = 'moveCursor';
export class MoveCursorChange extends NodeChange<INode> {
  constructor(readonly childIndex:number) {
    super(MOVE_CURSOR);
  }
}

export const REMOVE_CHILD = 'removeChild';
export class RemoveChildChange extends NodeChange<INode> {
  constructor(readonly index:number) {
    super(REMOVE_CHILD);
  }
}

export const ADD_CHILD = 'addChild';
export class AddChildChange extends NodeChange<INode> {
  constructor(readonly node:INode) {
    super(ADD_CHILD);
  }
}

export const SET_NODE_VALUE = 'setNodeValue';
export class SetNodeValueChange extends NodeChange<IValueNode> {
  constructor(readonly index:number, readonly nodeValue:any) {
    super(SET_NODE_VALUE);
  }
}

export const SET_ATTRIBUTE = 'setAttribute';
export class SetAttributeChange extends NodeChange<IElement> {
  constructor(readonly name:string, readonly value:any) {
    super(SET_ATTRIBUTE);
  }
}

export const REMOVE_ATTRIBUTE = 'removeAttribute';
export class RemoveAttributeChange extends NodeChange<IElement> {
  constructor(readonly name:string) {
    super(REMOVE_ATTRIBUTE);
  }
}

export const MOVE_CHILD = 'moveChild';
export class MoveChildChange extends NodeChange<INode> {
  constructor(readonly fromIndex:number, readonly toIndex:number) {
    super(MOVE_CHILD);
  }
}

export const INDEX_DOWN = 'indexDown';
export class IndexDownChange extends NodeChange<INode> {
  constructor(readonly index:number) {
    super(INDEX_DOWN);
  }
}

export const INDEX_UP = 'indexUp';
export class IndexUpChange extends NodeChange<INode> {
  constructor() {
    super(INDEX_UP);
  }
}

// TODO - use web workers to compute this
export function diff(oldNode:INode, newNode:INode):Array<INodeChange> {
  const changes = [];
  addChanges([oldNode], [newNode], changes);
  return changes;
};

function addChanges(unmatchedOldNodes:Array<INode>, unmatchedNewNodes:Array<INode>, changes:Array<INodeChange>) {

  const matchedNodes:Array<Array<INode>> = [];
  const oldOrderedChildNodes = unmatchedOldNodes.concat();
  const newOrderedChildNodes = unmatchedNewNodes.concat();

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

    if (isValueNodeType(newNode)) {
      bestCandidate = candidates[0];
      diffValueNode(<IValueNode>bestCandidate, <IValueNode>newNode, changes);
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

      if (bestCandidateChanges.length) {
        if (bestCandidate.parentNode) {
          bestCandidateChanges = [new IndexDownChange(getIndex(bestCandidate)), ...bestCandidateChanges, new IndexUpChange()];
        }
        changes.push(...bestCandidateChanges);
      }
    }

    if (bestCandidate) {
      matchedNodes.push([bestCandidate, newNode]);
      unmatchedNewNodes.splice(unmatchedNewNodes.indexOf(newNode), 1);
      unmatchedOldNodes.splice(unmatchedOldNodes.indexOf(bestCandidate), 1);
      i--;
    }
  }

  // next, remove the unmatched nodes
  // TODO - may need to reverse this
  for (const unmatchedNode of unmatchedOldNodes) {
    const index = oldOrderedChildNodes.indexOf(unmatchedNode)
    changes.push(new RemoveChildChange(index));
    oldOrderedChildNodes.splice(oldOrderedChildNodes.indexOf(unmatchedNode), 1);
  }

  // add the new nodes
  for (const unmatchedNode of unmatchedNewNodes) {
    changes.push(new AddChildChange(unmatchedNode));
    matchedNodes.push([unmatchedNode, unmatchedNode]);
    oldOrderedChildNodes.push(unmatchedNode);
  }

  // shift everything around
  for (const [oldNode, newNode] of matchedNodes) {
    const oldNodeIndex = oldOrderedChildNodes.indexOf(oldNode);
    const newNodeIndex = newOrderedChildNodes.indexOf(newNode);
    if (oldNodeIndex !== newNodeIndex) {
      oldOrderedChildNodes.splice(oldNodeIndex, 1);
      oldOrderedChildNodes.splice(newNodeIndex, 0, oldNode);
      changes.push(new MoveChildChange(oldNodeIndex, newNodeIndex))
    }
  }
}

function getIndex(node:INode) {
  return node.parentNode ? Array.prototype.indexOf.call(node.parentNode.childNodes, node) : undefined;
}

function diffElement(oldElement:IElement, newElement:IElement, changes:Array<INodeChange>) {
  const keepAttributes:any = {};

  // diff the attributes
  for (const attribute of newElement.attributes) {
    keepAttributes[attribute.name] = true;
    if (oldElement.getAttribute(attribute.name) !== attribute.value) {
      changes.push(new SetAttributeChange(attribute.name, attribute.value));
    }
  }

  for (const attribute of oldElement.attributes) {
    if (!keepAttributes[attribute.name]) {
      changes.push(new RemoveAttributeChange(attribute.name));
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
    changes.push(new SetNodeValueChange(getIndex(oldValueNode), newValueNode.nodeValue));
  }
}

function isValueNodeType(node:INode) {
  return [NodeTypes.COMMENT, NodeTypes.TEXT].indexOf(node.nodeType) !== -1;
}