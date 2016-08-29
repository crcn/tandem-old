
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

function _clone(node: INode) {
  return node.clone();
}

export function patch(node: INode, changes: Array<NodeChange>, clone: Function = undefined) {

  if (clone == null) {
    clone = _clone;
  }

  let parent = <IElement>node;
  let child;
  for (const change of changes) {
    switch (change.type) {
      case INDEX_UP:
        const bc = <IndexUpChange>change;
        parent = <IElement>parent.parent;
        break;
      case INDEX_DOWN:
        const dc = <IndexDownChange>change;
        parent = <IElement>parent.children[dc.index];
        break;
      case REMOVE_CHILD:
        const rc = <RemoveChildChange>change;
        parent.removeChild(parent.children[rc.index]);
        break;
      case SET_ATTRIBUTE:
        const sc = <SetAttributeChange>change;
        parent.setAttribute(sc.name, sc.value);
        break;
      case REMOVE_ATTRIBUTE:
        const sa = <SetAttributeChange>change;
        parent.removeAttribute(sa.name);
        break;
      case ADD_CHILD:
        const ac = <AddChildChange>change;
        parent.appendChild(clone(<INode>ac.node));
        break;
      case MOVE_CHILD:
        const mc = <MoveChildChange>change;
        parent.insertBefore(parent.children[mc.fromIndex], parent.children[mc.toIndex]);
        break;
      case SET_NODE_VALUE:
        const svc = <SetNodeValueChange>change;
        (<IValueNode>parent.children[svc.index]).value = svc.value;
        break;
    }
  }
}