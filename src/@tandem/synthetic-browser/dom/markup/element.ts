import { WrapBus } from "mesh";
import { bindable } from "@tandem/common/decorators";
import { IDOMNode } from "./node";
import { BubbleBus } from "@tandem/common/busses";
import { BoundingRect } from "@tandem/common/geom";
import { MarkupNodeType } from "./node-types";
import { evaluateMarkup } from "./evaluate";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { parse as parseMarkup } from "./parser.peg";
import { SyntheticDOMContainer } from "./container";
import { SyntheticCSSStyleDeclaration } from "../css";
import { Action, PropertyChangeAction } from "@tandem/common/actions";
import {
  Observable,
  ArrayChangeAction,
  ObservableCollection,
} from "@tandem/common/observable";
import { MarkupElementExpression } from "./ast";
import { SyntheticDOMNode } from "./node";

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
}

export class SyntheticDOMAttributes extends ObservableCollection<SyntheticDOMAttribute> {
  splice(start: number, deleteCount: number = 0, ...items: SyntheticDOMAttribute[]) {
    for (let i = start, n = start + deleteCount; i < n; i++) {
      const rmAttribute = this[i];

      // delete the attribute to ensure that hasOwnProperty returns false
      delete this[rmAttribute.name];
    }

    for (const newAttribute of items) {
      this[newAttribute.name] = newAttribute;
    }

    return super.splice(start, deleteCount, ...items);
  }

  toObject(...only: string[]) {
    const ret = {};
    for (const attribute of this) {
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

export interface ISyntheticDOMCapabilities {
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

  readonly nodeType: number = MarkupNodeType.ELEMENT;
  readonly attributes: SyntheticDOMAttributes;
  readonly expression: MarkupElementExpression;

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

  setAttribute(name: string, value: any) {
    if (this.hasAttribute(name)) {
      this.attributes[name].value = value;
    } else {
      this.attributes.push(new SyntheticDOMAttribute(name, value));
    }

    this.onAttributeChange(name, value);
  }

  toString(): string {
    return [
      "<",
      this.nodeName,
      this.attributes,
      ">",
      this.childrenToString(),
      "</",
      this.nodeName,
      ">"
    ].join("");
  }

  childrenToString(): string {
    return super.toString();
  }

  attributesToString(...include: string[]): string {
    return this.attributes.filter((attr) => include.indexOf(attr.name) !== -1).join(" ");
  }

  protected onAttributesAction(action: Action) {
    this.notify(action);
  }

  protected onAttributeChange(name: string, value: any) {

  }

  cloneNode() {
    const element = new SyntheticDOMElement(this.namespaceURI, this.tagName, this.ownerDocument);
    for (const attribute of this.attributes) {
      element.setAttribute(attribute.name, attribute.value);
    }
    for (const child of this.childNodes) {
      element.appendChild(child.cloneNode());
    }
    return element;
  }
}