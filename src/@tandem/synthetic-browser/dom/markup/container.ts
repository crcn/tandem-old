import { DOMNodeType } from "./node-types";
import { SyntheticDOMNode } from "./node";
import { SyntheticDOMText } from "./text-node";
import { querySelector, querySelectorAll } from "../selector";
import { BaseContentEdit, EditAction, RemoveEditAction } from "@tandem/sandbox";

export class AppendChildEditAction extends EditAction {
  static readonly APPEND_CHILD_EDIT = "appendChildEdit";
  constructor(target: SyntheticDOMContainer, readonly newChild: SyntheticDOMNode) {
    super(AppendChildEditAction.APPEND_CHILD_EDIT, target);
  }
}

export class SyntheticDOMContainerEdit<T extends SyntheticDOMContainer> extends BaseContentEdit<T> {
  appendChild(newChild: SyntheticDOMNode) {
    return this.addAction(new AppendChildEditAction(this.target, newChild));
  }
  remove() {
    return this.addAction(new RemoveEditAction(this.target));
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