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
  PropertyChangeAction,
} from "@tandem/common";

import { SyntheticDOMEntityAction } from "../actions";

import {
  MarkupNodeType,
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
import { SyntheticRendererAction } from "../actions";
import { SyntheticDOMNodeEntityClassDependency } from "../dependencies";
import { SyntheticDOMAttributes, SyntheticDOMAttribute } from "../dom";

let _i: number = 0;

/**
 * A representation of a synthetic DOM
 */

export abstract class BaseSyntheticDOMNodeEntity<T extends SyntheticDOMNode, U extends HTMLElement>  extends TreeNode<BaseSyntheticDOMNodeEntity<any, any>> {

  private _uid: string;
  private _source: T;
  private _change: T;
  private _evaluated: boolean;
  private _targetElement: U;
  private _changeObserver: IActor;
  private _browserObserver: IActor;
  /**
   * extra information specific to the environment that this node is running un
   */

  private _metadata: Metadata;

  constructor(source: T) {
    super();

    // attributes of this entity which are indenpendent from the source. The values
    // here are primarily to diff and apply edits to the source module
    this._changeObserver = new WrapBus(this.onChangeAction.bind(this));
    this._browserObserver = new WrapBus(this.onBrowserAction.bind(this));
    this.source = source;

    this._uid = String(++_i);
    this._metadata = new Metadata(this.getDefaultMetadata());

    // similar to dataset -- specific to the editor
    this._metadata.observe(new BubbleBus(this));
  }

  get change(): T {
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

  async evaluate() {
    if (this._evaluated) {
      await this.update();
    } else {
      this._evaluated = true;
      await this.load();
    }

    this.didEvaluate();
    this.notify(new SyntheticDOMEntityAction(SyntheticDOMEntityAction.DOM_ENTITY_EVALUATED, false));
  }

  querySelector(selector: string) {
    const tester = getSelectorTester(selector);
    return findTreeNode(this, (node) => tester.test(<SyntheticDOMElement><any>node.source));
  }

  querySelectorAll(selector: string) {
    const tester = getSelectorTester(selector);
    return filterTree(this, (node) => tester.test(<SyntheticDOMElement><any>node.source));
  }

  get source(): T {
    return this._source;
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

    if (this._source) {
      this._change.unobserve(this._changeObserver);
      this._source.browser.unobserve(this._browserObserver);
    }

    // Immutable.
    this._source = value;

    // Mutable. This node leaf is used to diff changes
    // that need to be persisted back to the source node.
    this._change = value.cloneNode(false);
    this._change.observe(this._changeObserver);

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

    // fix attributes for React
    if (this.change.nodeType === MarkupNodeType.ELEMENT) {
      const changeElement = (<SyntheticDOMElement><any>this.change);
      Object.assign(attribs, changeElement.attributes.toObject());
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
    if (this.source.nodeType === MarkupNodeType.ELEMENT) {
      return React.createElement(this.source.nodeName, this.renderAttributes(), this.renderChildren());
    } else if (this.source.nodeType === MarkupNodeType.DOCUMENT_FRAGMENT || this.source.nodeType === MarkupNodeType.DOCUMENT) {
      return React.createElement("span", this.renderAttributes(), this.renderChildren());
    } else if (this.source.nodeType === MarkupNodeType.TEXT) {
      return React.createElement("span", this.renderAttributes(), decode((<SyntheticDOMText><any>this.source).nodeValue));
    }
    return null;
  }

  renderChildren(): React.ReactElement<any>[] {
    return this.children.length ? this.children.map((child) => child.render()) : null;
  }

  protected didEvaluate() { }
  protected targetDidUnmount() { }

  protected onChangeAction(action: Action) {
    this.notify(new SyntheticDOMEntityAction(SyntheticDOMEntityAction.DOM_ENTITY_DIRTY, true));
  }

  protected onBrowserAction(action: Action) {
    if (action.type === SyntheticRendererAction.UPDATE_RECTANGLES) {
      this.onRendered(action);
    }
  }

  protected onRendered(action) { }
  protected targetDidMount() { }
}

export class BaseSyntheticDOMContainerEntity<T extends SyntheticDOMNode, U extends HTMLElement> extends BaseSyntheticDOMNodeEntity<T, U> {
  async evaluate() {
    await this.evaluateChildren();
    await super.evaluate();
  }

  async evaluateChildren() {
    const childCount       = this.children.length;
    const sourceChildCount = this.source.children.length;
    const dependencies     = this.browser.dependencies;

    for (let i = 0; i < sourceChildCount; i++) {

      let child: BaseSyntheticDOMNodeEntity<any, any> = this.children[i];

      const sourceChild = this.source.children[i];

      if (child && child.source.compare(sourceChild)) {
        child.source = sourceChild;
        await child.evaluate();
      } else {
        const newChild = SyntheticDOMNodeEntityClassDependency.create(sourceChild, dependencies);
        await newChild.evaluate();

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

export class DefaultSyntheticDOMEntity extends BaseSyntheticDOMContainerEntity<SyntheticDOMNode, HTMLElement> { }