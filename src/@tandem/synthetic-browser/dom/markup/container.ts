import { diffArray } from "@tandem/common";
import { DOMNodeType } from "./node-types";
import { SyntheticDOMNode } from "./node";
import { SyntheticDOMText } from "./text-node";
import { querySelector, querySelectorAll } from "../selector";
import {
  BaseContentEdit,
  IContentEdit,
  EditAction,
  RemoveEditAction,
  RemoveChildEditAction,
  InsertChildEditAction,
  MoveChildEditAction,
} from "@tandem/sandbox";

export class AppendChildEditAction extends EditAction {
  static readonly APPEND_CHILD_EDIT = "appendChildEdit";
  constructor(target: SyntheticDOMContainer, readonly newChild: SyntheticDOMNode) {
    super(AppendChildEditAction.APPEND_CHILD_EDIT, target);
  }
}

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
    return this.addAction(new AppendChildEditAction(this.target, newChild));
  }

  remove() {
    return this.addAction(new RemoveEditAction(this.target));
  }

  addDiff(newContainer: SyntheticDOMContainer) {
    diffArray(this.target.childNodes, newContainer.childNodes, (oldNode, newNode) => {
      if (oldNode.nodeName !== newNode.nodeName) return -1;
      return (newContainer.childNodes.indexOf(newNode) - this.target.childNodes.indexOf(oldNode)) + oldNode.createEdit().addDiff(newNode).actions.length;
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
        this.addChildEdit(oldValue.createEdit().addDiff(newValue));
      }
    });
    return this;
  }
}

export abstract class SyntheticDOMContainer extends SyntheticDOMNode {

  createEdit(): SyntheticDOMContainerEdit<any> {
    return new SyntheticDOMContainerEdit(this);
  }

  // TODO - insertBefore here
  appendChild(child: SyntheticDOMNode) {
    if (child.nodeType === DOMNodeType.DOCUMENT_FRAGMENT) {
      return child.children.concat().forEach((child) => this.appendChild(child));
    }
    return super.appendChild(child);
  }

  get textContent() {
    return this.childNodes.map((child) => child.textContent).join("");
  }

  set textContent(value) {
    this.removeAllChildren();
    this.appendChild(this.ownerDocument.createTextNode(value));
  }

  toString() {
    return this.childNodes.map((child) => child.toString()).join("");
  }

  public querySelector(selector: string) {
    return querySelector(this, selector);
  }

  public querySelectorAll(selector: string, deep?: boolean) {
    return querySelectorAll(this, selector);
  }
}