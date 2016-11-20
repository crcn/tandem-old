import { bindable } from "@tandem/common/decorators";
import { difference } from "lodash";
import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { parse as parseMarkup } from "./parser.peg";
import { selectorMatchesElement } from "../selector";
import { AttributeChangeEvent } from "@tandem/synthetic-browser/messages";
import { syntheticElementClassType } from "./types";
import { SyntheticDocumentFragment } from "./document-fragment";
import { CallbackDispatcher, IDispatcher } from "@tandem/mesh";
import { SyntheticDOMNode, SyntheticDOMNodeSerializer } from "./node";
import { SyntheticDOMContainer, SyntheticDOMContainerEdit } from "./container";
import {
  Action,
  BubbleDispatcher,
  serialize,
  diffArray,
  Observable,
  deserialize,
  ITreeWalker,
  ISerializer,
  BoundingRect,
  serializable,
  ArrayMetadataChangeEvent,
  ISerializedContent,
  PropertyChangeEvent,
  ObservableCollection,
} from "@tandem/common";

import { Dependency } from "@tandem/sandbox";
import {
  EditChange,
  BaseContentEdit,
  SetValueEditActon,
  ISyntheticObjectChild,
  MoveChildEditChange,
  InsertChildEditChange,
  SetKeyValueEditChange,
} from "@tandem/sandbox";

export interface ISerializedSyntheticDOMAttribute {
  name: string;
  value: string;
  readonly: boolean;
}

class SyntheticDOMAttributeSerializer implements ISerializer<SyntheticDOMAttribute, ISerializedSyntheticDOMAttribute> {
  serialize({ name, value, readonly }: SyntheticDOMAttribute) {
    return { name, value, readonly };
  }
  deserialize({ name, value, readonly }: ISerializedSyntheticDOMAttribute) {
    return new SyntheticDOMAttribute(name, value, readonly);
  }
}

@serializable(new SyntheticDOMAttributeSerializer())
export class SyntheticDOMAttribute extends Observable implements ISyntheticObjectChild {

  @bindable(true)
  public value: any;

  constructor(readonly name: string, value: any, public readonly?: boolean) {
    super();
    this.value = value;
  }

  get uid() {
    return this.name;
  }

  toString() {
    return `${this.name}="${this.value}"`;
  }

  clone() {
    return new SyntheticDOMAttribute(this.name, this.value, this.readonly);
  }
}


export class SyntheticDOMAttributes extends ObservableCollection<SyntheticDOMAttribute> {
  splice(start: number, deleteCount: number = 0, ...items: SyntheticDOMAttribute[]) {
    for (let i = start, n = Math.min(start + deleteCount, this.length); i < n; i++) {
      const rmAttribute = this[i];
      // delete the attribute to ensure that hasOwnProperty returns false
      this[rmAttribute.name] = undefined
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
  readonlyAttributeNames: string[];
  shadowRoot: ISerializedContent<any>;
  attributes: Array<ISerializedContent<ISerializedSyntheticDOMAttribute>>;
  childNodes: Array<ISerializedContent<any>>;
}

export class SyntheticDOMElementSerializer implements ISerializer<SyntheticDOMElement, ISerializedSyntheticDOMElement> {
  serialize({ nodeName, namespaceURI, shadowRoot, attributes, childNodes }: SyntheticDOMElement): any {
    return {
      nodeName,
      namespaceURI,
      shadowRoot: serialize(shadowRoot),
      attributes: [].concat(attributes).map(serialize),
      childNodes: [].concat(childNodes).map(serialize)
    };
  }
  deserialize({ nodeName, shadowRoot, namespaceURI, attributes, childNodes }, injector, ctor) {
    const element = new ctor(namespaceURI, nodeName) as SyntheticDOMElement;

    for (let i = 0, n = attributes.length; i < n; i++) {
      element.attributes.push(<SyntheticDOMAttribute>deserialize(attributes[i], injector));
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


export class AttachShadowRootEditChange extends EditChange {
  static readonly SET_ELEMENT_TAG_NAME_EDIT = "setElementTagNameEdit";
  constructor(type: string, target: SyntheticDOMElement, readonly newName: string) {
    super(type, target);
  }
}

export class SyntheticDOMElementEdit extends SyntheticDOMContainerEdit<SyntheticDOMElement> {

  static readonly SET_ELEMENT_ATTRIBUTE_EDIT = "setElementAttributeEdit";
  static readonly ATTACH_SHADOW_ROOT_EDIT    = "attachShadowRootEdit";

  setAttribute(name: string, value: string, oldName?: string, newIndex?: number) {
    return this.addChange(new SetKeyValueEditChange(SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT, this.target, name, value, oldName, newIndex));
  }

  removeAttribute(name: string) {
    return this.setAttribute(name, undefined);
  }

  attachShadowRoot(shadowRoot: SyntheticDOMContainer) {
    this.addChange(new InsertChildEditChange(SyntheticDOMElementEdit.ATTACH_SHADOW_ROOT_EDIT, this.target, shadowRoot, Infinity));
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

    if (difference(this.target.readonlyAttributesNames, newElement.readonlyAttributesNames).length) {
      this.setAttribute("data-td-readonly", JSON.stringify(newElement.readonlyAttributesNames));
    }

    diffArray(this.target.attributes, newElement.attributes, (a, b) => a.name === b.name ? 1 : -1).accept({
      visitInsert: ({ index, value }) => {
        this.setAttribute(value.name, value.value, undefined, index);
      },
      visitRemove: ({ index }) => {
        this.removeAttribute(this.target.attributes[index].name);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, newIndex }) => {
        if(this.target.attributes[originalOldIndex].value !== newValue.value) {
          this.setAttribute(newValue.name, newValue.value, undefined, newIndex);
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
  readonly dataset: any;
  private _shadowRoot: SyntheticDocumentFragment;

  /**
   * Bool check to ensure that createdCallback doesn't get called twice accidentally
   */

  private _createdCallbackCalled: boolean;
  private _shadowRootObserver: IDispatcher<any, any>;

  /**
   * Attributes that are not modifiable by the editor. These are typically
   * attributes that are dynamically created. For example:
   *
   * <div style={{color: computeColor(hash) }} />
   *
   */

  private _readonlyAttributeNames: string[];

  constructor(readonly namespaceURI: string, readonly tagName: string) {
    super(tagName);
    this._readonlyAttributeNames = [];
    this._shadowRootObserver = new BubbleDispatcher(this);
    this.attributes = new SyntheticDOMAttributes();
    this.attributes.observe(new CallbackDispatcher(this.onAttributesAction.bind(this)));

    // todo - proxy this
    this.dataset = {};
  }

  createEdit() {
    return new SyntheticDOMElementEdit(this);
  }

  applyEditChange(action: EditChange) {
    super.applyEditChange(action);
    if (action.type === SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT) {
      const { name, oldName, newValue } = <SetKeyValueEditChange>action;
      if (newValue == null) {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, newValue);
      }
      if (oldName) this.removeAttribute(oldName);
    } else if (action.type === SyntheticDOMElementEdit.ATTACH_SHADOW_ROOT_EDIT) {
      const { child } = <InsertChildEditChange>action;
      const shadowRoot = <SyntheticDOMContainer>child;

      // need to clone in case the child is an instance in this process -- hasn't
      // been sent over a network.
      this.$setShadowRoot(shadowRoot.cloneNode(true));
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
    return this.attributes[name] != null;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitElement(this);
  }

  get readonlyAttributesNames() {
    return this._readonlyAttributeNames;
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
    this._shadowRoot.observe(new BubbleDispatcher(this));
    return this._shadowRoot;
  }

  get shadowRoot(): SyntheticDocumentFragment {
    return this._shadowRoot;
  }

  matches(selector) {
    return selectorMatchesElement(selector, this);
  }

  setAttribute(name: string, value: any) {

    // attributes that are not editable by the editor
    if (name === "data-td-readonly") {
      this._readonlyAttributeNames = JSON.parse(value) as string[];
      return this._resetReadonlyAttributes();
    }

    // Reserved attribute to help map where this element came from. Defined
    // by source transformers that scan for HTML elements.
    if (name === "data-td-source") {
      this.$source = JSON.parse(value);
      return;
    }

    let oldValue;
    const attribute = this.attributes[name];

    if (attribute) {
      attribute.value = value;
    } else {
      this.attributes.push(new SyntheticDOMAttribute(name, value, this._readonlyAttributeNames.indexOf(name) !== -1));
    }
  }

  private _resetReadonlyAttributes() {
    for (const attribute of this.attributes) {
      attribute.readonly = false;
    }

    for (const attributeName of this._readonlyAttributeNames) {
      const attribute = this.attributes[attributeName] as SyntheticDOMAttribute;
      if (attribute) attribute.readonly = true;
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
    if (action.type === ArrayMetadataChangeEvent.ARRAY_CHANGE) {
      (<ArrayMetadataChangeEvent<SyntheticDOMAttribute>>action).diff.accept({
        visitUpdate: () => {},
        visitInsert: ({ value, index }) => {
        this.attributeChangedCallback(value.name, undefined, value.value);
        },
        visitRemove: ({ value, index }) => {
          this.attributeChangedCallback(value.name, value.value, undefined);;
        }
      });
    } else if (action.type === PropertyChangeEvent.PROPERTY_CHANGE && action.target instanceof SyntheticDOMAttribute) {
      const changeAction = <PropertyChangeEvent>action;
      const attribute = <SyntheticDOMAttribute>action.target;
      this.attributeChangedCallback(attribute.name, changeAction.oldValue, changeAction.newValue);
    }
  }

  $setOwnerDocument(document: SyntheticDocument) {
    super.$setOwnerDocument(document);
    if (this._shadowRoot) {
      this._shadowRoot.$setOwnerDocument(document);
    }
  }

  protected attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    this.notify(new AttributeChangeEvent(name, newValue));
  }

  protected createdCallback() {

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