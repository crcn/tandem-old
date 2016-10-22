import { WrapBus } from "mesh";
import { bindable } from "@tandem/common/decorators";
import { IDOMNode } from "./node";
import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { parse as parseMarkup } from "./parser.peg";
import { MarkupElementExpression } from "./ast";
import { syntheticElementClassType } from "./types";
import { SyntheticDocumentFragment } from "./document-fragment";
import { SyntheticCSSStyleDeclaration } from "../css";
import { SyntheticDOMNode, SyntheticDOMNodeSerializer } from "./node";
import { SyntheticDOMContainer, SyntheticDOMContainerEdit } from "./container";
import {
  Action,
  BubbleBus,
  serialize,
  diffArray,
  Observable,
  deserialize,
  ISerializer,
  BoundingRect,
  serializable,
  ArrayChangeAction,
  ISerializedContent,
  PropertyChangeAction,
  ObservableCollection,
} from "@tandem/common";

import { Bundle } from "@tandem/sandbox";
import { BaseContentEdit, EditAction, EditKind } from "@tandem/sandbox";

export interface ISerializedSyntheticDOMAttribute {
  name: string;
  value: string;
}

class SyntheticDOMAttributeSerializer implements ISerializer<SyntheticDOMAttribute, ISerializedSyntheticDOMAttribute> {
  serialize({ name, value }: SyntheticDOMAttribute) {
    return { name, value }
  }
  deserialize({ name, value }: ISerializedSyntheticDOMAttribute) {
    return new SyntheticDOMAttribute(name, value);
  }
}

@serializable(new SyntheticDOMAttributeSerializer())
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

export interface ISerializedSyntheticDOMElement {
  nodeName: string;
  namespaceURI: string;
  shadowRoot: ISerializedContent<any>;
  attributes: Array<ISerializedContent<ISerializedSyntheticDOMAttribute>>;
  childNodes: Array<ISerializedContent<any>>;
}

export class SyntheticDOMElementSerializer implements ISerializer<SyntheticDOMElement, ISerializedSyntheticDOMElement> {
  serialize({ nodeName, namespaceURI, shadowRoot, attributes, childNodes }: any): any {
    return {
      nodeName,
      namespaceURI,
      shadowRoot: serialize(shadowRoot),
      attributes: [].concat(attributes).map(serialize),
      childNodes: [].concat(childNodes).map(serialize)
    };
  }
  deserialize({ nodeName, shadowRoot, namespaceURI, attributes, childNodes }, dependencies, ctor) {
    const element = new ctor(namespaceURI, nodeName);

    for (let i = 0, n = attributes.length; i < n; i++) {
      const { name, value } = <SyntheticDOMAttribute>deserialize(attributes[i], dependencies);
      element.setAttribute(name, value);
    }

    for (let i = 0, n = childNodes.length; i < n; i++) {
      const child = <SyntheticDOMNode>deserialize(childNodes[i], dependencies);
      element.appendChild(child);
    }

    const shadowRootFragment = deserialize(shadowRoot, dependencies);
    if (shadowRootFragment) {
      element.attachShadow({ mode: "open" }).appendChild(shadowRootFragment);
    }

    // NOTE - $createdCallback is not called here for a reason -- serialized
    // must store the entire state of an object.
    return element;
  }
}

export class SetElementAttributeEditAction extends EditAction {
  static readonly SET_ELEMENT_ATTRIBUTE_EDIT = "setElementAttributeEdit";
  constructor(target: SyntheticDOMElement, readonly attributeName: string, readonly newAttributeValue: string, readonly newAttributeName?: string) {
    super(SetElementAttributeEditAction.SET_ELEMENT_ATTRIBUTE_EDIT, EditKind.UPDATE, target);
  }
}

export class SetElementTagNameEditAction extends EditAction {
  static readonly SET_ELEMENT_TAG_NAME_EDIT = "setElementTagNameEdit";
  constructor(target: SyntheticDOMElement, readonly newName: string) {
    super(SetElementTagNameEditAction.SET_ELEMENT_TAG_NAME_EDIT, EditKind.UPDATE, target);
  }
}

export class SyntheticDOMElementEdit extends SyntheticDOMContainerEdit<SyntheticDOMElement> {

  setAttribute(name: string, value: string, newName?: string) {
    return this.addAction(new SetElementAttributeEditAction(this.target, name, value, newName));
  }

  setTagName(newName: string) {
    return this.addAction(new SetElementTagNameEditAction(this.target, newName));
  }

  /**
   * Adds diff actions from the new element
   *
   * @param {SyntheticDOMElement} newElement
   */

  addDiff(newElement: SyntheticDOMElement) {
    if (this.target.nodeName !== newElement.nodeName) {
      this.setTagName(newElement.nodeName);
    }
  }
}


@serializable(new SyntheticDOMNodeSerializer(new SyntheticDOMElementSerializer()))
export class SyntheticDOMElement extends SyntheticDOMContainer {

  readonly nodeType: number = DOMNodeType.ELEMENT;
  readonly attributes: SyntheticDOMAttributes;
  readonly expression: MarkupElementExpression;
  readonly dataset: any = {};
  private _shadowRoot: SyntheticDocumentFragment;
  private _createdCallbackCalled: boolean;

  constructor(readonly namespaceURI: string, readonly tagName: string) {
    super(tagName);
    this.attributes = new SyntheticDOMAttributes();
    this.attributes.observe(new WrapBus(this.onAttributesAction.bind(this)));

    // todo - proxy this
    this.dataset = {};
  }

  createEdit() {
    return new SyntheticDOMElementEdit(this);
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
    this._shadowRoot = new SyntheticDocumentFragment();
    this._shadowRoot.$setOwnerDocument(this.ownerDocument);
    return this._shadowRoot;
  }

  get shadowRoot(): SyntheticDocumentFragment {
    return this._shadowRoot;
  }

  renderAttributes() {
    const attribs = {};
    for (let i = 0, n = this.attributes.length; i < n; i++) {
      const attribute = this.attributes[i];
      attribs[attribute.name] = attribute.value;
    }
    return attribs;
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

  $setOwnerDocument(document: SyntheticDocument) {
    super.$setOwnerDocument(document);
    if (this._shadowRoot) {
      this._shadowRoot.$setOwnerDocument(document);
    }
    if (document) {
      this.attachedCallback();
    } else {
      this.detachedCallback();
    }
  }

  protected attributeChangedCallback(name: string, oldValue: any, newValue: any) {

  }

  protected createdCallback() {

  }

  protected attachedCallback() {
    // override me
  }

  protected detachedCallback() {
    // override me
  }

  protected addPropertiesToClone(clone: SyntheticDOMElement, deep: boolean) {
    for (const attribute of this.attributes) {
      clone.setAttribute(attribute.name, attribute.value);
    }

    if (deep === true) {
      for (const child of this.childNodes) {
        clone.appendChild(child.clone(deep));
      }
    }
  }

  clone(deep?: boolean) {
    const constructor = this.constructor as syntheticElementClassType;
    const clone = new constructor(this.namespaceURI, this.tagName);
    this.linkClone(clone);
    this.addPropertiesToClone(clone, deep);
    clone.$createdCallback();

    return clone;
  }
}