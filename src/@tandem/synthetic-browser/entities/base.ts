import {
  IActor,
  Action,
  Metadata,
  IEntity2,
  TreeNode,
  ITreeNode,
  BubbleBus,
  filterTree,
  BoundingRect,
  findTreeNode,
  PropertyChangeAction,
} from "@tandem/common";

import {
  MarkupNodeType,
  SyntheticDOMNode,
  getSelectorTester,
  SyntheticDOMElement,
  SyntheticHTMLElement,
} from "../dom";

import { SyntheticDOMNodeEntityClassDependency } from "../dependencies";

import {
  SyntheticRendererAction
} from "../actions";

import { WrapBus } from "mesh";

let _i: number = 0;

export abstract class BaseSyntheticDOMNodeEntity<T extends SyntheticDOMNode, U extends HTMLElement>  extends TreeNode<BaseSyntheticDOMNodeEntity<any, any>> {

  private _uid: string;
  private _source: T;
  private _evaluated: boolean;
  private _targetElement: U;
  private _sourceObserver: IActor;
  private _browserObserver: IActor;

  /**
   * extra information specific to the environment that this node is running un
   */

  private _metadata: Metadata;

  constructor(source: T) {
    super();
    this._sourceObserver = new WrapBus(this.onSourceAction.bind(this));
    this._browserObserver = new WrapBus(this.onBrowserAction.bind(this));
    this.source = source;

    this._uid = String(++_i);
    this._metadata = new Metadata(this.getDefaultMetadata());

    // similar to dataset -- specific to the editor
    this._metadata.observe(new BubbleBus(this));
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

  protected uidToAttributeString() {
    return `data-uid="${this._uid}"`;
  }

  protected getDefaultMetadata() {
    return {};
  }

  set source(value: T) {
    const oldSource = this._source;
    if (this._source) {
      this._source.browser.unobserve(this._browserObserver);
      this._source.unobserve(this._sourceObserver);
    }
    this._source = value;
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

  loadSourceChildren() {

  }

  render(): string {
    if (this.source.nodeType === MarkupNodeType.ELEMENT) {
      return `
      <${this.source.nodeName} ${this.uidToAttributeString()} ${(<SyntheticDOMElement><any>this.source).attributes}>
        ${this.renderChildren()}
      </${this.source.nodeName}>
      `;
    } else if (this.source.nodeType === MarkupNodeType.DOCUMENT_FRAGMENT || this.source.nodeType === MarkupNodeType.DOCUMENT) {
      return this.renderChildren();
    }

    return this.source.toString();
  }

  renderChildren() {
    return this.children.map((child) => child.render()).join("");
  }

  protected didEvaluate() { }

  protected targetDidUnmount() {

  }

  protected onSourceAction(action: Action) {
  }

  protected onBrowserAction(action: Action) {
    if (action.type === SyntheticRendererAction.UPDATE_RECTANGLES) {
      this.onRendered(action);
    }
  }

  protected onRendered(action) {
  }

  protected targetDidMount() {

  }
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