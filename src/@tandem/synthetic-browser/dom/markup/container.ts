import { DOMNodeType } from "./node-types";
import { SyntheticDOMNode } from "./node";
import { SyntheticDOMText } from "./text-node";
import { isDOMMutationAction, DOMNodeAction } from "@tandem/synthetic-browser/actions";
import { diffArray, ITreeWalker, findTreeNode, Action } from "@tandem/common";
import { getSelectorTester, ISelectorTester, querySelector, querySelectorAll } from "../selector";
import { SyntheticDOMElement } from "./element";
import {
  EditAction,
  IContentEdit,
  BaseContentEdit,
  RemoveEditAction,
  MoveChildEditAction,
  RemoveChildEditAction,
  InsertChildEditAction,
} from "@tandem/sandbox";

export class SyntheticDOMContainerEdit<T extends SyntheticDOMContainer> extends BaseContentEdit<T> {

  static readonly INSERT_CHILD_NODE_EDIT = "insertChildNodeEdit";
  static readonly REMOVE_CHILD_NODE_EDIT = "removeChildNodeEdit";
  static readonly MOVE_CHILD_NODE_EDIT   = "moveChildNodeEdit";

  insertChild(newChild: SyntheticDOMNode, index: number) {
    return this.addAction(new InsertChildEditAction(SyntheticDOMContainerEdit.INSERT_CHILD_NODE_EDIT, this.target, newChild, index));
  }

  removeChild(child: SyntheticDOMNode) {
    return this.addAction(new RemoveChildEditAction(SyntheticDOMContainerEdit.REMOVE_CHILD_NODE_EDIT, this.target, child));
  }

  moveChild(child: SyntheticDOMNode, newIndex: number) {
    return this.addAction(new MoveChildEditAction(SyntheticDOMContainerEdit.MOVE_CHILD_NODE_EDIT, this.target, child, newIndex));
  }

  appendChild(newChild: SyntheticDOMNode) {
    return this.insertChild(newChild, Infinity);
  }

  remove() {
    return this.addAction(new RemoveEditAction(this.target));
  }

  protected addDiff(newContainer: SyntheticDOMContainer) {
    diffArray(this.target.childNodes, newContainer.childNodes, (oldNode, newNode) => {
      if (oldNode.nodeName !== newNode.nodeName) return -1;
      return 0;

      // expensive
      // return (newContainer.childNodes.indexOf(newNode) - this.target.childNodes.indexOf(oldNode)) + oldNode.createEdit().fromDiff(newNode).actions.length;
    }).accept({
      visitInsert: ({ index, value }) => {
        this.insertChild(value, index);
      },
      visitRemove: ({ index }) => {
        this.removeChild(this.target.childNodes[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, newIndex }) => {
        if (patchedOldIndex !== newIndex) {
          this.moveChild(this.target.childNodes[originalOldIndex], newIndex);
        }
        const oldValue = this.target.childNodes[originalOldIndex];
        this.addChildEdit(oldValue.createEdit().fromDiff(newValue));
      }
    });
    return this;
  }
}

export abstract class SyntheticDOMContainer extends SyntheticDOMNode {

  createEdit(): SyntheticDOMContainerEdit<any> {
    return new SyntheticDOMContainerEdit(this);
  }

  getNodeByUID(uid) {
    return findTreeNode(this, child => child.uid === uid);
  }

  // TODO - insertBefore here
  appendChild(child: SyntheticDOMNode) {
    if (child.nodeType === DOMNodeType.DOCUMENT_FRAGMENT) {
      return child.children.concat().forEach((child) => this.appendChild(child));
    }
    return super.appendChild(child);
  }

  get textContent() {
    return this.childNodes.map(child => child.textContent).join("");
  }

  set textContent(value) {
    this.removeAllChildren();
    this.appendChild(this.ownerDocument.createTextNode(value));
  }

  toString() {
    return this.childNodes.map(child => child.toString()).join("");
  }

  public querySelector(selector: string, deep?: boolean): SyntheticDOMElement {
    return querySelector(this, selector);
  }

  public querySelectorAll(selector: string, deep?: boolean): SyntheticDOMElement[] {
    return querySelectorAll(this, selector);
  }

  applyEditAction(action: EditAction) {
    switch(action.type) {
      case SyntheticDOMContainerEdit.REMOVE_CHILD_NODE_EDIT:
        const removeAction = <InsertChildEditAction>action;
        this.removeChild(this.getNodeByUID(removeAction.child.uid));
      break;
      case SyntheticDOMContainerEdit.MOVE_CHILD_NODE_EDIT:
        const moveAction = <InsertChildEditAction>action;
        this.replaceChild(this.getNodeByUID(moveAction.child.uid), this.childNodes[moveAction.index]);
      break;
      case SyntheticDOMContainerEdit.INSERT_CHILD_NODE_EDIT:
        const insertAction = <InsertChildEditAction>action;
        this.insertChildAt(insertAction.child as SyntheticDOMNode, insertAction.index);
      break;
    }
  }

  visitWalker(walker: ITreeWalker) {
    this.childNodes.forEach(child => walker.accept(child));
  }
}

function isShadowRootOrDocument(node: SyntheticDOMNode) {
  return (node.nodeType === DOMNodeType.DOCUMENT_FRAGMENT || node.nodeType === DOMNodeType.DOCUMENT);
}