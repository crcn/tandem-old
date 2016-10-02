import { SymbolTable } from "../../core";
import { HTMLNodeType } from "../node-types";
import { SyntheticNode } from "../node";
import { SyntheticElement } from "../element";
import { SyntheticNodeComponentFactory } from "@tandem/runtime/dependencies";
import {
  inject,
  TreeNode,
  IInjectable,
  Dependencies,
  DEPENDENCIES_NS,
} from "@tandem/common";

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
}

/**
 */

export class SyntheticContainerComponent<T extends SyntheticNode> extends BaseSyntheticNodeComponent<T> {
  constructor(target: T) {
    super(target);
  }
  get outerHTML() {
    return this.innerHTML;
  }
  get innerHTML() {
    return this.children.map((child) => child.outerHTML).join("");
  }
  async load(context: SymbolTable) {
    this.removeAllChildren();
    for (const childNode of this.target.childNodes) {
      const childComponent = SyntheticNodeComponentFactory.create(childNode, this._dependencies);
      await childComponent.load(context);
      this.appendChild(childComponent);
    }
  }
}

/**
 */

export class SyntheticElementComponent extends SyntheticContainerComponent<SyntheticElement> {
  get outerHTML() {
    const buffer = ["<", this.target.nodeName];
    for (const attribute of this.target.attributes) {
      buffer.push(" ", attribute.name, "=", `"`, attribute.value, `"`);
    }
    buffer.push(">", this.innerHTML, "</", this.target.nodeName, ">");
    return buffer.join("");
  }
}

/**
 */

export const defaultSyntheticNodeComponentDependencies = [
  new SyntheticNodeComponentFactory("default", HTMLNodeType.ELEMENT, SyntheticElementComponent),
  new SyntheticNodeComponentFactory("default", HTMLNodeType.TEXT, DefaultSyntheticNodeComponent),
  new SyntheticNodeComponentFactory("default", HTMLNodeType.COMMENT, DefaultSyntheticNodeComponent),
  new SyntheticNodeComponentFactory("default", HTMLNodeType.DOCUMENT, SyntheticContainerComponent),
  new SyntheticNodeComponentFactory("default", HTMLNodeType.DOCUMENT_FRAGMENT, SyntheticContainerComponent)
];