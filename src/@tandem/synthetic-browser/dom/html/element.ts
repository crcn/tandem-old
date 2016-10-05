import { Action, PropertyChangeAction } from "@tandem/common/actions";
import { bindable } from "@tandem/common/decorators";
import { BubbleBus } from "@tandem/common/busses";
import { HTMLNodeType } from "./node-types";
import { evaluateHTML } from "./evaluate";
import { parse as parseHTML } from "./parser.peg";
import { diffArray, patchArray } from "@tandem/common/utils";
import { SyntheticHTMLDocument } from "./document";
import { SyntheticHTMLContainer } from "./container";
import { SyntheticCSSStyleDeclaration } from "../css";
import { WrapBus } from "mesh";
import { IHTMLNodeVisitor } from "./visitor";
import {
  Observable,
  ArrayChangeAction,
  ObservableCollection,
} from "@tandem/common/observable";

export class SyntheticHTMLAttribute extends Observable {

  @bindable()
  public value: any;

  constructor(readonly name: string, value: any) {
    super();
    this.value = value;
  }
}

export class SyntheticHTMLAttributes extends ObservableCollection<SyntheticHTMLAttribute> {
  splice(start: number, deleteCount: number = 0, ...items: SyntheticHTMLAttribute[]) {
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
}

export class SyntheticHTMLElement extends SyntheticHTMLContainer {

  readonly nodeType: number = HTMLNodeType.ELEMENT;
  readonly attributes: SyntheticHTMLAttributes;
  private _style: SyntheticCSSStyleDeclaration;

  constructor(readonly tagName: string, ownerDocument: SyntheticHTMLDocument) {
    super(tagName, ownerDocument);
    this._style = new SyntheticCSSStyleDeclaration();
    this.attributes = new SyntheticHTMLAttributes();
    this.attributes.observe(new WrapBus(this.onAttributesAction.bind(this)));
  }

  get text(): string {
    return this.getAttribute("text");
  }

  get class(): string {
    return this.getAttribute("class");
  }

  set class(value: string) {
    this.setAttribute("class", value);
  }

  set text(value: string) {
    this.setAttribute("text", value);
  }

  get style(): SyntheticCSSStyleDeclaration {
    return this._style;
  }

  set style(value: SyntheticCSSStyleDeclaration) {
    const style = this._style = new SyntheticCSSStyleDeclaration();
    Object.assign(style, value);
  }

  get innerHTML(): string {
    return this.childNodes.map((child) => child.outerHTML).join("");
  }

  set innerHTML(value: string) {
    this.removeAllChildren();
    this.appendChild(evaluateHTML(parseHTML(value), this.ownerDocument));
  }

  getAttribute(name: string) {
    return this.attributes.hasOwnProperty(name) ? this.attributes[name].value : null;
  }

  accept(visitor: IHTMLNodeVisitor) {
    return visitor.visitElement(this);
  }

  patch(source: SyntheticHTMLElement) {
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
      this.attributes.push(new SyntheticHTMLAttribute(name, value));
    }
  }

  get outerHTML(): string {
    return [
      "<",
      this.nodeName,
      ...this.attributes.map((attribute) => {
        return ` ${attribute.name}="${attribute.value}"`;
      }),
      ">",
      this.innerHTML,
      "</",
      this.nodeName,
      ">"
    ].join("");
  }

  protected onAttributesAction(action: Action) {
    if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
      if (action.target instanceof SyntheticHTMLAttribute) {
        (<SyntheticHTMLAttribute>action.target).name === "style";
        // TODO - parse CSS
      }
    }

    // bubble
    this.notify(action);
  }

  cloneNode() {
    const element = new SyntheticHTMLElement(this.tagName, this.ownerDocument);
    for (const attribute of this.attributes) {
      element.setAttribute(attribute.name, attribute.value);
    }
    for (const child of this.childNodes) {
      element.appendChild(child.cloneNode());
    }
    return element;
  }
}