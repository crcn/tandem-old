import {
  INode,
  IElement,
  IValueNode,
  ITextNode,
  ICommentNode,
  IContainerNode
} from './base';

import {
  findNode
} from './utils';

import {
  NodeChange,
  SetAttributeChange,
  SET_ATTRIBUTE,
  SET_NODE_VALUE,
  MOVE_CHILD,
  SetNodeValueChange,
  REMOVE_CHILD,
  ADD_CHILD,
  AddChildChange,
  RemoveChildChange,
  REMOVE_ATTRIBUTE,
  MoveChildChange,
  RemoveAttributeChange
} from './diff';

export function patch(node:INode, changes:Array<NodeChange<any>>) {
  for (const change of changes) {

    const parentPath = change.nodePath.slice(change.nodePath.length - 1);
    const childIndex = change.nodePath[change.nodePath.length - 1];

    switch(change.type) {
      case REMOVE_CHILD:
        const target = findNode<INode>(change.nodePath, <IContainerNode>node);
        target.parentNode.removeChild(target);
        break;
      case SET_ATTRIBUTE:
        const sc = <SetAttributeChange>change;
        findNode<IElement>(change.nodePath, <IContainerNode>node).setAttribute(sc.key, sc.value);
        break;
      case REMOVE_ATTRIBUTE:
        const rc = <SetAttributeChange>change;
        findNode<IElement>(change.nodePath, <IContainerNode>node).removeAttribute(rc.key);
        break;
      case ADD_CHILD:
        const ac = <AddChildChange>change;
        const parentNode = findNode<IElement>(parentPath, <IContainerNode>node);
        if (parentNode.childNodes.length > childIndex) {
          parentNode.insertBefore(ac.node, parentNode.childNodes[childIndex]);
        } else {
          parentNode.appendChild(ac.node.cloneNode(true));
        }
        break;
      case SET_NODE_VALUE:
        findNode<IValueNode>(change.nodePath, <IContainerNode>node).nodeValue = (<SetNodeValueChange>change).nodeValue;
        break;
    }
  }
}