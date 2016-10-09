import { TreeNode, ITreeNode } from "@tandem/common";
import { SyntheticDOMNode, MarkupNodeType, SyntheticDOMElement } from "../dom";

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

  constructor(public source: T) {
    super();
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

  protected didEvaluate() {

  }

  protected targetDidUnmount() {

  }

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