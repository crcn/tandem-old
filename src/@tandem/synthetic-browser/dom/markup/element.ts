import { WrapBus } from "mesh";
import { bindable } from "@tandem/common/decorators";
import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { parse as parseMarkup } from "./parser.peg";
import { selectorMatchesElement } from "../selector";
import { AttributeChangeAction } from "@tandem/synthetic-browser/actions";
import { MarkupElementExpression } from "./ast";
import { syntheticElementClassType } from "./types";
import { SyntheticDocumentFragment } from "./document-fragment";
import { SyntheticCSSStyleDeclaration } from "../css";
import { SyntheticDOMNode, SyntheticDOMNodeSerializer } from "./node";
import { SyntheticDOMContainer, SyntheticDOMContainerEdit } from "./container";
import {
  IActor,
  Action,
  BubbleBus,
  serialize,
  diffArray,
  Observable,
  deserialize,
  ISerializer,
  BoundingRect,
  ITreeWalker,
  serializable,
  ArrayChangeAction,
  ISerializedContent,
  PropertyChangeAction,
  ObservableCollection,
} from "@tandem/common";

import { BundleDependency } from "@tandem/sandbox";
import {
  EditAction,
  BaseContentEdit,
  SetValueEditActon,
  InsertChildEditAction,
  SetKeyValueEditAction,
} from "@tandem/sandbox";

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

  @bindable(true)
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
  deserialize({ nodeName, shadowRoot, namespaceURI, attributes, childNodes }, injector, ctor) {
    const element = new ctor(namespaceURI, nodeName);

    for (let i = 0, n = attributes.length; i < n; i++) {
      const { name, value } = <SyntheticDOMAttribute>deserialize(attributes[i], injector);
      element.setAttribute(name, value);
    }

    for (let i = 0, n = childNodes.length; i < n; i++) {
      const child = <SyntheticDOMNode>deserialize(childNodes[i], injector);
      element.appendChild(child);
    }

    const shadowRootFragment = deserialize(shadowRoot, injector);
    if (shadowRootFragment) {
      element.attachShadow({ mode: "open" }).appendChild(shadowRootFragment);
    }

    // NOTE - $createdCallback is not called here for a reason -- serialized
    // must store the entire state of an object.
    return element;
  }
}


export class AttachShadowRootEditAction extends EditAction {
  static readonly SET_ELEMENT_TAG_NAME_EDIT = "setElementTagNameEdit";
  constructor(type: string, target: SyntheticDOMElement, readonly newName: string) {
    super(type, target);
  }
}

export class SyntheticDOMElementEdit extends SyntheticDOMContainerEdit<SyntheticDOMElement> {

  static readonly SET_ELEMENT_ATTRIBUTE_EDIT = "setElementAttributeEdit";
  static readonly ATTACH_SHADOW_ROOT_EDIT    = "attachShadowRootEdit";

  setAttribute(name: string, value: string, newName?: string) {
    return this.addAction(new SetKeyValueEditAction(SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT, this.target, name, value, newName));
  }

  removeAttribute(name: string) {
    return this.setAttribute(name, undefined);
  }

  attachShadowRoot(shadowRoot: SyntheticDOMContainer) {
    this.addAction(new InsertChildEditAction(SyntheticDOMElementEdit.ATTACH_SHADOW_ROOT_EDIT, this.target, shadowRoot, Infinity));
  }

  /**
   * Adds diff actions from the new element
   *
   * @param {SyntheticDOMElement} newElement
   */

  protected addDiff(newElement: SyntheticDOMElement) {

    if (this.target.nodeName !== newElement.nodeName) {
      throw new Error(`nodeName must match in order to diff`);
    }

    diffArray(this.target.attributes, newElement.attributes, (a, b) => a.name === b.name ? 1 : -1).accept({
      visitInsert: ({ index, value }) => {
        this.setAttribute(value.name, value.value);
      },
      visitRemove: ({ index }) => {
        this.removeAttribute(this.target.attributes[index].name);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, newIndex }) => {
        if(this.target.attributes[originalOldIndex].value !== newValue.value) {
          this.setAttribute(newValue.name, newValue.value);
        }
      }
    });

    if (newElement.shadowRoot) {
      if (!this.target.shadowRoot) {
        this.attachShadowRoot(newElement.shadowRoot);
      } else {
        this.addChildEdit(this.target.shadowRoot.createEdit().fromDiff(newElement.shadowRoot));
      }
    }

    return super.addDiff(newElement);
  }
}


@serializable(new SyntheticDOMNodeSerializer(new SyntheticDOMElementSerializer()))
export class SyntheticDOMElement extends SyntheticDOMContainer {

  readonly nodeType: number = DOMNodeType.ELEMENT;
  readonly attributes: SyntheticDOMAttributes;
  readonly expression: MarkupElementExpression;
  readonly dataset: any;
  private _shadowRoot: SyntheticDocumentFragment;
  private _createdCallbackCalled: boolean;
  private _matchesCache: any;
  private _shadowRootObserver: IActor;

  constructor(readonly namespaceURI: string, readonly tagName: string) {
    super(tagName);
    this._shadowRootObserver = new BubbleBus(this);
    this.attributes = new SyntheticDOMAttributes();
    this.attributes.observe(new WrapBus(this.onAttributesAction.bind(this)));

    // todo - proxy this
    this.dataset = {};
    this._matchesCache = {};
  }

  createEdit() {
    return new SyntheticDOMElementEdit(this);
  }

  applyEditAction(action: EditAction) {
    super.applyEditAction(action);
    switch(action.type) {
      case SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT:
        const { name, newName, newValue } = <SetKeyValueEditAction>action;
        this.setAttribute(newName || name, newValue);
        if (newName) this.removeAttribute(name);
      break;
      case SyntheticDOMElementEdit.ATTACH_SHADOW_ROOT_EDIT:
        const { child } = <InsertChildEditAction>action;
        const shadowRoot = <SyntheticDOMContainer>child;

        // need to clone in case the child is an instance in this process -- hasn't
        // been sent over a network.
        this.$setShadowRoot(shadowRoot.cloneNode(true));
      break;
    }
  }

  visitWalker(walker: ITreeWalker) {
    if (this.shadowRoot) walker.accept(this.shadowRoot);
    super.visitWalker(walker);
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
    if (this._shadowRoot) return this._shadowRoot;
    return this.$setShadowRoot(new SyntheticDocumentFragment());
  }

  $setShadowRoot(shadowRoot: SyntheticDocumentFragment) {
    if (this._shadowRoot) {
      this._shadowRoot.unobserve(this._shadowRootObserver);
    }

    this._shadowRoot = shadowRoot;
    this._shadowRoot.$setOwnerDocument(this.ownerDocument);
    this._shadowRoot.observe(new BubbleBus(this));
    return this._shadowRoot;
  }

  get shadowRoot(): SyntheticDocumentFragment {
    return this._shadowRoot;
  }

  matches(selector) {
    return selectorMatchesElement(selector, this);
  }

  setAttribute(name: string, value: any) {

    let oldValue;
    const attribute = this.attributes[name];

    if (attribute) {
      attribute.value = value;
    } else {
      this.attributes.push(new SyntheticDOMAttribute(name, value));
    }
  }

  removeAttribute(name: string) {
    if (this.hasAttribute(name)) {
      const attribute = this.attributes[name];
      this.attributes.splice(this.attributes.indexOf(attribute), 1);
    }
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
    if (action.type === ArrayChangeAction.ARRAY_CHANGE) {
      const { addedItems, removedItems } = <ArrayChangeAction>action;
      for (const attribute of <SyntheticDOMAttribute[]>addedItems) {
        this.attributeChangedCallback(attribute.name, undefined, attribute.value);
      }
      for (const attribute of <SyntheticDOMAttribute[]>removedItems) {
      this.attributeChangedCallback(attribute.name, attribute.value, undefined);;
      }
    } else if (action.type === PropertyChangeAction.PROPERTY_CHANGE && action.target instanceof SyntheticDOMAttribute) {
      const changeAction = <PropertyChangeAction>action;
      const attribute = <SyntheticDOMAttribute>action.target;
      this.attributeChangedCallback(attribute.name, changeAction.oldValue, changeAction.newValue);
    }
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
    this.notify(new AttributeChangeAction(name, newValue));
  }

  protected createdCallback() {

  }

  protected attachedCallback() {
    // override me
  }

  protected detachedCallback() {
    // override me
  }

  cloneShallow() {
    const constructor = this.constructor as syntheticElementClassType;
    const clone = new constructor(this.namespaceURI, this.tagName);
    for (const attribute of this.attributes) {
      clone.setAttribute(attribute.name, attribute.value);
    }
    return clone;
  }
}