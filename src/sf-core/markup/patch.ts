import { findNode } from "./utils";

import {
  INode,
  IElement,
  IValueNode,
  IContainerNode,
} from "./base";


import {
  INDEX_UP,
  ADD_CHILD,
  MOVE_CHILD,
  INDEX_DOWN,
  NodeChange,
  REMOVE_CHILD,
  SET_ATTRIBUTE,
  IndexUpChange,
  AddChildChange,
  SET_NODE_VALUE,
  IndexDownChange,
  MoveChildChange,
  MoveCursorChange,
  REMOVE_ATTRIBUTE,
  RemoveChildChange,
  SetNodeValueChange,
  SetAttributeChange,
  RemoveAttributeChange,
} from "./diff";

function _cloneNode(node: INode) {
  return node.cloneNode(true);
}

export function patch(node: INode, changes: Array<NodeChange>, cloneNode: Function = undefined) {

  if (cloneNode == null) {
    cloneNode = _cloneNode;
  }

  let parentNode = <IElement>node;
  let child;
  for (const change of changes) {
    switch (change.type) {
      case INDEX_UP:
        const bc = <IndexUpChange>change;
        parentNode = <IElement>parentNode.parentNode;
        break;
      case INDEX_DOWN:
        const dc = <IndexDownChange>change;
        parentNode = <IElement>parentNode.childNodes[dc.index];
        break;
      case REMOVE_CHILD:
        const rc = <RemoveChildChange>change;
        parentNode.removeChild(parentNode.childNodes[rc.index]);
        break;
      case SET_ATTRIBUTE:
        const sc = <SetAttributeChange>change;
        parentNode.setAttribute(sc.name, sc.value);
        break;
      case REMOVE_ATTRIBUTE:
        const sa = <SetAttributeChange>change;
        parentNode.removeAttribute(sa.name);
        break;
      case ADD_CHILD:
        const ac = <AddChildChange>change;
        parentNode.appendChild(cloneNode(<INode>ac.node));
        break;
      case MOVE_CHILD:
        const mc = <MoveChildChange>change;
        parentNode.insertBefore(parentNode.childNodes[mc.fromIndex], parentNode.childNodes[mc.toIndex]);
        break;
      case SET_NODE_VALUE:
        const svc = <SetNodeValueChange>change;
        (<IValueNode>parentNode.childNodes[svc.index]).nodeValue = svc.nodeValue;
        break;
    }
  }
}