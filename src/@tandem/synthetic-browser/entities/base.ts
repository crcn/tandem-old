import {
  IActor,
  Action,
  Metadata,
  IEntity2,
  TreeNode,
  ITreeNode,
  diffArray,
  patchArray,
  BubbleBus,
  filterTree,
  BoundingRect,
  findTreeNode,
  TreeNodeAction,
  PropertyChangeAction,
} from "@tandem/common";

import { DOMEntityAction } from "../actions";

import {
  DOMNodeType,
  SyntheticDOMNode,
  SyntheticDOMText,
  getSelectorTester,
  SyntheticDOMElement,
  SyntheticHTMLElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";

import * as React from "react";
import { decode } from "ent";

import { WrapBus } from "mesh";
import { camelCase } from "lodash";
import { IMarkupEdit } from "@tandem/synthetic-browser";
import { SyntheticRendererAction } from "../actions";
import { SyntheticDOMNodeEntityClassDependency } from "../dependencies"
import { SyntheticDOMAttributes, SyntheticDOMAttribute, SyntheticDocumentFragment } from "../dom";

let _i: number = 0;

/**
 * A representation of a synthetic DOM
 */

export abstract class BaseDOMNodeEntity<T extends SyntheticDOMNode, U extends HTMLElement>  extends TreeNode<BaseDOMNodeEntity<any, any>> {

  private _uid: string;
  private _source: T;
  protected _change: T;
  private _targetElement: U;
  private _changeObserver: IActor;
  private _sourceObserver: IActor;
  private _browserObserver: IActor;
  private _cache: any;
  /**
   * extra information specific to the environment that this node is running un
   */

  private _metadata: Metadata;

  constructor(source: T) {
    super();

    this._cache = {};

    // attributes of this entity which are indenpendent from the source. The values
    // here are primarily to diff and apply edits to the source module
    this._changeObserver = new WrapBus(this.onChangeAction.bind(this));
    this._sourceObserver = new WrapBus(this.onSourceAction.bind(this));
    this._browserObserver = new WrapBus(this.onBrowserAction.bind(this));
    this.source = source;

    this._uid = String(++_i);
    this._metadata = new Metadata(this.getDefaultMetadata());

    // similar to dataset -- specific to the editor
    this._metadata.observe(new BubbleBus(this));
    this.observe(new WrapBus(this.onAction.bind(this)));
  }

  /**
   * clone of source where changes can go
   */

  get change(): T {

    if (!this._change) {
      this._change = this._source.cloneNode(false);
      this._change.observe(this._changeObserver);
    }

    return this._change;
  }

  get editable() {
    return !!(this.module && this.module.editor);
  }

  get sourceWindow() {
    return this.source.ownerDocument.defaultView;
  }

  get sandbox() {
    return this.module.sandbox;
  }

  get module() {
    return this._source.module;
  }

  get metadata() {
    return this._metadata;
  }

  get uid() {
    return this._uid;
  }

  async save(): Promise<any> {
    this.module.editor.edit(this.onEdit.bind(this));
  }

  async remove(): Promise<any> {
    return this.edit((edit) => {
      edit.remove(this.source);
    });
  }

  public edit(onEdit: (edit: IMarkupEdit) => any) {
    // this may happen if whatever's mutating the entity doesn't check the "editable" property.
    if (!this.editable) {
      return Promise.reject(new Error("Cannot save entity source that is not editable."));
    }
    this.module.editor.edit(onEdit.bind(this));
  }

  evaluate() { }

  querySelector(selector: string) {
    const cacheKey = "querySelector:" + selector;
    if (this._cache[cacheKey]) return this._cache[cacheKey];

    const tester = getSelectorTester(selector);
    return this._cache[cacheKey] = findTreeNode(this, (node) => tester.test(<SyntheticDOMElement><any>node.source));
  }

  querySelectorAll(selector: string) {
    const cacheKey = "querySelectorAll:" + selector;
    if (this._cache[cacheKey]) return this._cache[cacheKey];
    const tester = getSelectorTester(selector);
    return this._cache[cacheKey] = filterTree(this, (node) => tester.test(<SyntheticDOMElement><any>node.source));
  }

  get source(): T {
    return this._source;
  }

  protected onEdit(edit: IMarkupEdit) {
    // OVERRIDE ME
  }

  protected renderEntityAttributes() {
    return {
      "data-uid": this.uid,
      "key": this.uid
    };
  }

  protected getDefaultMetadata() {
    return {};
  }

  set source(value: T) {
    const oldSource = this._source;

    if (this._change) {
      this._change.unobserve(this._changeObserver);
      this._change = undefined;
    }

    if (this._source) {
      this._source.unobserve(this._sourceObserver);
      this._source.browser.unobserve(this._browserObserver);
    }

    // Immutable.
    this._source = value;

    // Mutable. This node leaf is used to diff changes
    // that need to be persisted back to the source node.
    this._source.observe(this._sourceObserver);

    this._source.browser.observe(this._browserObserver);
    this.notify(new PropertyChangeAction("source", this._source, oldSource));
  }

  get browser() {
    return this._source.browser;
  }

  get target(): U {
    return this._targetElement;
  }

  set target(value: U) {
    if (this._targetElement === value) {
      return;
    }

    if (this._targetElement) {
      this.targetDidUnmount();
    }

    const oldElement = this._targetElement;
    this._targetElement = value;

    if (this._targetElement) {
      this.targetDidMount();
    }
  }

  async load() { }
  async update() { }

  protected renderAttributes() {

    const attribs = {};

    Object.assign(attribs, this.renderEntityAttributes());

    const node = this._change || this.source;

    // fix attributes for React
    if (node && node.nodeType === DOMNodeType.ELEMENT) {
      const element = (<SyntheticDOMElement><any>node);
      Object.assign(attribs, element.attributes.toObject());
    }

    const renderedAttribs = {};

    for (let name in attribs) {
      let value = attribs[name];
      if (name === "class") {
        name = "className";
      } else if (name === "style") {
        value = SyntheticCSSStyleDeclaration.fromString(value);
      }

      if (!/^data-/.test(name)) {
        name = camelCase(name);
      }

      renderedAttribs[name] = value;
    }

    return renderedAttribs;
  }

  render(): React.ReactElement<any> {
    if (this.source.nodeType === DOMNodeType.ELEMENT) {
      return React.createElement(this.source.nodeName, this.renderAttributes(), this.renderChildren());
    } else if (this.source.nodeType === DOMNodeType.DOCUMENT_FRAGMENT || this.source.nodeType === DOMNodeType.DOCUMENT) {
      return React.createElement("span", this.renderAttributes(), this.renderChildren());
    } else if (this.source.nodeType === DOMNodeType.TEXT) {
      return React.createElement("span", this.renderAttributes(), decode((<SyntheticDOMText><any>this.source).nodeValue));
    }
    return null;
  }

  renderChildren(): React.ReactElement<any>[] {
    return this.children.length ? this.children.map((child) => child.render()) : null;
  }

  protected didEvaluate() { }
  protected targetDidUnmount() { }
  protected onAction(action: Action) {
    if (action.type === PropertyChangeAction.PROPERTY_CHANGE || action.type === TreeNodeAction.NODE_ADDED || action.type === TreeNodeAction.NODE_REMOVED) {
      this._cache = {};
    }
  }

  protected onChangeAction(action: Action) {
    this.notifyDirty();
  }

  protected onSourceAction(action: Action) {
    this.notifyDirty();
  }

  protected notifyDirty(bubbles = false) {
    this.notify(new DOMEntityAction(DOMEntityAction.DOM_ENTITY_DIRTY, bubbles));
  }

  protected onBrowserAction(action: Action) {
    if (action.type === SyntheticRendererAction.UPDATE_RECTANGLES) {
      this.onRendered(action);
    }
  }

  protected onRendered(action) { }
  protected targetDidMount() { }
}

export class BaseDOMContainerEntity<T extends SyntheticDOMNode, U extends HTMLElement> extends BaseDOMNodeEntity<T, U> {

  evaluate() {
    this.evaluateChildren();
    super.evaluate();
  }

  evaluateChildren() {
    const childCount       = this.children.length;

    let target: SyntheticDOMNode = this.source;

    if (this.source.nodeType === DOMNodeType.ELEMENT) {
      target = (<SyntheticDOMElement><any>this.source).shadowRoot || this.source;
    }

    const sourceChildCount = target.children.length;
    const dependencies     = this.browser.dependencies;

    for (let i = 0; i < sourceChildCount; i++) {

      let child: BaseDOMNodeEntity<any, any> = this.children[i];

      const sourceChild = target.children[i];

      if (child && child.source.nodeName === sourceChild.nodeName) {
        child.source = sourceChild;
        child.evaluate();
      } else {
        const newChild = SyntheticDOMNodeEntityClassDependency.create(sourceChild, dependencies);
        newChild.evaluate();

        if (child) {
          this.replaceChild(newChild, child);
        } else {
          this.appendChild(newChild);
        }
      }
    }

    while (this.children.length > sourceChildCount) {
      this.removeChild(this.lastChild);
    }
  }
}


export class DefaultSyntheticDOMEntity extends BaseDOMContainerEntity<SyntheticDOMNode, HTMLElement> { }
export class NoopDOMENtity extends BaseDOMNodeEntity<any, any> {
  render() {
    return null;
  }
}