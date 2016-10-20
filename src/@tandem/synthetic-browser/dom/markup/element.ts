import { WrapBus } from "mesh";
import { bindable } from "@tandem/common/decorators";
import { IDOMNode } from "./node";
import { BubbleBus } from "@tandem/common/busses";
import { BoundingRect } from "@tandem/common/geom";
import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { parse as parseMarkup } from "./parser.peg";
import { SyntheticDOMContainer } from "./container";
import { syntheticElementClassType } from "./types";
import { SyntheticCSSStyleDeclaration } from "../css";
import { Action, PropertyChangeAction } from "@tandem/common/actions";
import {
  Observable,
  ArrayChangeAction,
  ObservableCollection,
} from "@tandem/common/observable";
import { SyntheticDOMNode } from "./node";
import { MarkupElementExpression } from "./ast";
import { SyntheticDocumentFragment } from "./document-fragment";

export class SyntheticDOMAttribute extends Observable {

  @bindable()
  public value: any;

  constructor(readonly name: string, value: any) {
    super();
    this.value = value;
  }

  toString() {
    return `${this.name}="${this.value}"`;
  }

  clone() {
    return new SyntheticDOMAttribute(this.name, this.value);
  }
}

export class SyntheticDOMAttributes extends ObservableCollection<SyntheticDOMAttribute> {
  splice(start: number, deleteCount: number = 0, ...items: SyntheticDOMAttribute[]) {
    for (let i = start, n = start + deleteCount; i < n; i++) {
      const rmAttribute = this[i];

      // delete the attribute to ensure that hasOwnProperty returns false
      delete this[rmAttribute.name];
    }

    for (let i = 0, n = items.length; i < n; i++) {
      const newAttribute = items[i];
      this[newAttribute.name] = newAttribute;
    }

    return super.splice(start, deleteCount, ...items);
  }

  toObject(...only: string[]) {
    const ret = {};
    for (let i = 0, n = this.length; i < n; i++) {
      const attribute = this[i];
      if (only.length !== 0 && only.indexOf(attribute.name) === -1) {
        continue;
        }
      ret[attribute.name] = attribute.value;
    }
    return ret;
  }

  toString() {
    return this.map((attribute) => {
      return ` ${attribute}`;
    }).join("");
  }
}

let _i = 0;

export interface IDOMNodeEntityCapabilities {
  movable: boolean;
  resizable: boolean;
}

export interface IDOMElement extends IDOMNode {
  attributes: SyntheticDOMAttributes;
  accept(visitor: IMarkupNodeVisitor);
  getAttribute(name: string);
  cloneNode(): IDOMElement;
  setAttribute(name: string, value: any);
}

export class SyntheticDOMElement extends SyntheticDOMContainer {

  readonly nodeType: number = DOMNodeType.ELEMENT;
  readonly attributes: SyntheticDOMAttributes;
  readonly expression: MarkupElementExpression;
  private _shadowRoot: SyntheticDocumentFragment;
  private _createdCallbackCalled: boolean;

  constructor(readonly namespaceURI: string, readonly tagName: string, ownerDocument: SyntheticDocument) {
    super(tagName, ownerDocument);
    this.attributes = new SyntheticDOMAttributes();
    this.attributes.observe(new WrapBus(this.onAttributesAction.bind(this)));
  }

  getAttribute(name: string) {
    return this.hasAttribute(name) ? this.attributes[name].value : null;
  }

  hasAttribute(name: string) {
    return this.attributes.hasOwnProperty(name);
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitElement(this);
  }

  attachShadow({ mode }: { mode: "open"|"close" }) {
    return this._shadowRoot = this.ownerDocument.createDocumentFragment();
  }

  get shadowRoot(): SyntheticDocumentFragment {
    return this._shadowRoot;
  }

  setAttribute(name: string, value: any) {

    let oldValue;
    const attribute = this.attributes[name];

    if (attribute) {
      oldValue = attribute.value;
      attribute.value = value;
    } else {
      this.attributes.push(new SyntheticDOMAttribute(name, value));
    }

    // W3C standard
    this.attributeChangedCallback(name, oldValue, value);
  }

  toString(): string {
    return [
      "<",
      this.nodeName,
      this.attributes,
      ">",
      this.childNodes.map((child) => child.toString()).join(""),
      "</",
      this.nodeName,
      ">"
    ].join("");
  }

  $createdCallback() {

    if (this._createdCallbackCalled) {
      throw new Error(`createdCallback() has already been called.`);
    }

    this._createdCallbackCalled = true;
    this.createdCallback();
  }

  protected onAttributesAction(action: Action) {
    this.notify(action);
  }

  protected createdCallback() {

  }


  protected attributeChangedCallback(name: string, oldValue: any, newValue: any) {

  }

  protected attachedCallback() {
    // TODO
  }

  protected detachedCallback() {
    // TODO
  }

  protected addPropertiesToClone(clone: SyntheticDOMElement, deep: boolean) {
    for (const attribute of this.attributes) {
      clone.setAttribute(attribute.name, attribute.value);
    }

    if (deep === true) {
      for (const child of this.childNodes) {
        clone.appendChild(child.cloneNode(deep));
      }
    }
  }

  cloneNode(deep?: boolean) {
    const constructor = this.constructor as syntheticElementClassType;
    const clone = new constructor(this.namespaceURI, this.tagName, this.ownerDocument);
    this.addPropertiesToClone(clone, deep);
    clone.$module     = this.module;
    clone.$expression = this.expression;
    clone.$createdCallback();

    return clone;
  }
}