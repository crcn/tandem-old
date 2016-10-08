import { WrapBus } from "mesh";
import { bindable } from "@tandem/common/decorators";
import { BubbleBus } from "@tandem/common/busses";
import { BoundingRect } from "@tandem/common/geom";
import { MarkupNodeType } from "./node-types";
import { evaluateMarkup } from "./evaluate";
import { getBoundingRect } from "@tandem/synthetic-browser";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { parse as parseMarkup } from "./parser.peg";
import { diffArray, patchArray } from "@tandem/common/utils";
import { SyntheticDOMContainer } from "./container";
import { SyntheticCSSStyleDeclaration } from "../css";
import { Action, PropertyChangeAction } from "@tandem/common/actions";
import {
  Observable,
  ArrayChangeAction,
  ObservableCollection,
} from "@tandem/common/observable";
import { MarkupElementExpression } from "./ast";

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

  toString() {
    return this.map((attribute) => {
      return ` ${attribute}`;
    }).join("");
  }
}

let _i = 0;

export class SyntheticDOMElement extends SyntheticDOMContainer {

  readonly nodeType: number = MarkupNodeType.ELEMENT;
  readonly attributes: SyntheticDOMAttributes;
  readonly expression: MarkupElementExpression;

  constructor(readonly namespaceURI: string, readonly tagName: string, ownerDocument: SyntheticDocument) {
    super(tagName, ownerDocument);
    this.attributes = new SyntheticDOMAttributes();
    this.setAttribute("data-uid", String(++_i));
    this.attributes.observe(new WrapBus(this.onAttributesAction.bind(this)));
  }

  getBoundingClientRect(): BoundingRect {
    return getBoundingRect(this);
  }

  // non-standard
  get uid(): string {
    return this.getAttribute("data-uid");
  }

  getAttribute(name: string) {
    return this.attributes.hasOwnProperty(name) ? this.attributes[name].value : null;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitElement(this);
  }

  patch(source: SyntheticDOMElement) {
    super.patch(source);
    patchArray(
      this.attributes,
      diffArray(this.attributes, source.attributes, (a, b) => a.name === b.name),
      (a, b) => {
        a.value = b.value;
        return a;
      }
    );
  }

  setAttribute(name: string, value: any) {
    if (this.attributes.hasOwnProperty(name)) {
      this.attributes[name].value = value;
    } else {
      this.attributes.push(new SyntheticDOMAttribute(name, value));
    }
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
    if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
      if (action.target instanceof SyntheticDOMAttribute) {
        (<SyntheticDOMAttribute>action.target).name === "style";
        // TODO - parse CSS
      }
    }

    // bubble
    this.notify(action);
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