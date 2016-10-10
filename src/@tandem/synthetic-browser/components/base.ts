import {
  IActor,
  Action,
  TreeNode,
  ITreeNode,
  filterTree,
  findTreeNode,
  PropertyChangeAction,
} from "@tandem/common";
import {
  MarkupNodeType,
  SyntheticDOMNode,
  getSelectorTester,
  SyntheticDOMElement,
} from "../dom";

import { WrapBus } from "mesh";

/**
 * Represents synthetic DOM nodes in a synthetic environment. Components include images, links, etc.
 */

export interface ISyntheticComponent extends ITreeNode<ISyntheticComponent> {

  /**
   * The source synthetic DOM node that
   */

  source: SyntheticDOMNode;

  /**
   */

  target: HTMLElement;

  /**
   * Evaluates the component and all of its children. Called each time
   * the source changes.
   */

  evaluate(): Promise<any>;


  /**
   * Rendered DOM output of the component
   */

  render(): string;
}

export abstract class BaseSyntheticComponent<T extends SyntheticDOMNode, U extends HTMLElement>  extends TreeNode<BaseSyntheticComponent<any, any>> implements ISyntheticComponent {

  private _evaluated: boolean;
  private _targetElement: U;
  private _sourceObserver: IActor;
  private _source: T;

  constructor(source: T) {
    super();
    this._sourceObserver = new WrapBus(this.onSourceAction.bind(this));
    this.source = source;
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

  set source(value: T) {
    const oldSource = this._source;
    if (this._source) {
      this._source.unobserve(this._sourceObserver);
    }
    this._source = value;
    this._source.observe(this._sourceObserver);
    this.notify(new PropertyChangeAction("source", this._source, oldSource));
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
  abstract render(): string;

  renderChildren() {
    return this.children.map((child) => child.render()).join("");
  }

  protected didEvaluate() { }

  protected targetDidUnmount() {

  }

  protected onSourceAction(action: Action) {
  };

  protected targetDidMount() {

  }
}

export class DefaultSyntheticComponent extends BaseSyntheticComponent<SyntheticDOMNode, HTMLElement> {
  render() {
    if (this.source.nodeType === MarkupNodeType.ELEMENT) {
      return `
      <${this.source.nodeName}${(<SyntheticDOMElement>this.source).attributes}>
        ${this.renderChildren()}
      </${this.source.nodeName}>
      `;
    } else if (this.source.nodeType === MarkupNodeType.DOCUMENT_FRAGMENT || this.source.nodeType === MarkupNodeType.DOCUMENT) {
      return this.renderChildren();
    }

    return this.source.toString();
  }
}