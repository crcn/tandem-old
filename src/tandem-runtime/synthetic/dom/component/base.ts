import { SymbolTable } from "../../core";
import { HTMLNodeType } from "../node-types";
import { SyntheticNode } from "../node";
import { SyntheticElement } from "../element";
import { SyntheticNodeComponentFactory } from "tandem-runtime/dependencies";
import {
  inject,
  TreeNode,
  IInjectable,
  Dependencies,
  DEPENDENCIES_NS,
} from "tandem-common";

/**
 */

export abstract class BaseSyntheticNodeComponent<T extends SyntheticNode>  extends TreeNode<BaseSyntheticNodeComponent<any>> implements IInjectable {

  @inject(DEPENDENCIES_NS)
  protected _dependencies: Dependencies;


  constructor(readonly target: T) {
    super();
  }

  abstract get outerHTML(): string;

  async load(context: SymbolTable) {
    // override me
  }
}

/**
 */

export class DefaultSyntheticNodeComponent<T> extends BaseSyntheticNodeComponent<SyntheticNode> {
  constructor(target: SyntheticNode) {
    super(target);
  }
  get outerHTML() {
    return this.target.outerHTML.toString();
  }
  async load(context: SymbolTable) {
    for (const child of this.target.childNodes.value) {
    }
  }
}

/**
 */

export class DefaultSyntheticElementComponent extends BaseSyntheticNodeComponent<SyntheticElement> {
  constructor(target: SyntheticElement) {
    super(target);
  }
  get outerHTML() {
    return this.target.outerHTML.toString();
  }
  get innerHTML() {
    return this.children.map((child) => child.outerHTML).join("");
  }
  async load(context: SymbolTable) {
    this.removeAllChildren();
    for (const childNode of this.target.childNodes.value) {
      const childComponent = SyntheticNodeComponentFactory.create(childNode, this._dependencies);
      await childComponent.load(context);
      this.appendChild(childComponent);
    }
  }
}

/**
 */

export const defaultSyntheticNodeComponentDependencies = [
  new SyntheticNodeComponentFactory("default", HTMLNodeType.ELEMENT, DefaultSyntheticElementComponent),
  new SyntheticNodeComponentFactory("default", HTMLNodeType.TEXT, DefaultSyntheticNodeComponent),
  new SyntheticNodeComponentFactory("default", HTMLNodeType.COMMENT, DefaultSyntheticNodeComponent)
];