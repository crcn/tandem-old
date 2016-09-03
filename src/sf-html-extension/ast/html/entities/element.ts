import { Action } from "sf-common/actions";
import { WrapBus } from "mesh";
import { IEntity } from "sf-common/ast";
import { bindable } from "sf-common/decorators";
import { BaseEntity } from "sf-common/ast";
import { IHTMLNodeEntity } from "./base";
import { MetadataKeys } from "sf-front-end/constants";
import { HTMLNodeEntity } from "./node";
import { diffArray, patchArray } from "sf-common/utils/array";
import { parseCSS, parseCSSStyle } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-common/dependencies";
import { IDOMSection, NodeSection } from "sf-html-extension/dom";
import { INamed, IValued, IExpression } from "sf-common";
import { HTMLElementExpression, HTMLAttributeExpression } from "sf-html-extension/ast";
import { AttributeChangeAction, NODE_ADDED, NODE_REMOVING, PROPERTY_CHANGE } from "sf-common/actions";
import { CSSRuleExpression, CSSStyleExpression, IHTMLElementAttributeEntity } from "sf-html-extension/ast";
import * as sift from "sift";

export class HTMLElementEntity extends HTMLNodeEntity<HTMLElementExpression> implements IHTMLNodeEntity {

  get attributes(): Array<BaseEntity<any> & IHTMLElementAttributeEntity> {
    return <any>this.children.filter((child) => child.source.constructor === HTMLAttributeExpression);
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.LAYER_DEPENDENCY_NAME]: "element"
    });
  }

  get cssRuleExpressions(): Array<CSSRuleExpression> {
    return [];
  }

  createSection(): IDOMSection {
    return new NodeSection(document.createElement(this.source.name));
  }

  static mapSourceChildren(source: HTMLElementExpression): Array<IExpression> {
    return source.children;
  }

  removeAttribute(name: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        this.removeChild(attribute);
      }
    }
  }

  getAttribute(name: string) {
    const attribute = this.getAttributeEntity(name);
    return attribute ? attribute.value : undefined;
  }

  setAttribute(name: string, value: any) {
    const attribute = this.getAttributeEntity(name);
    if (!attribute) {
      const expr = new HTMLAttributeExpression(name, value, null);
      this.source.appendChild(expr);
      const entity = new HTMLAttributeEntity(expr);
      this.appendChild(entity);
      return entity;
    }
    attribute.value = value;
  }

  hasAttribute(name: string) {
    return !!this.getAttributeEntity(name);
  }

  getAttributeEntity(name: string): IHTMLElementAttributeEntity {
    return this.attributes.find((attribute) => attribute.name === name);
  }

  cloneLeaf() {
    return new (this.constructor as any)(this.source);
  }

  protected onChildAction(action: Action) {
    super.onChildAction(action);

    if (!(this.section instanceof NodeSection)) {
      return;
    }
    const element = <Element>this.section.targetNode;

    if (action.target.parent === this && action.target.source instanceof HTMLAttributeExpression) {
      if (action.type === NODE_REMOVING) {
        element.removeAttribute(action.target.name);
      } else if (action.type === PROPERTY_CHANGE || action.type === NODE_ADDED) {
        element.setAttribute(action.target.name, action.target.value);
      }
    }
  }
}

export class HTMLAttributeEntity extends BaseEntity<HTMLAttributeExpression> {

  public name: string;

  @bindable()
  public value: any;

  constructor(source: HTMLAttributeExpression) {
    super(source);
    this.name  = source.name;
    this.value = source.value;
  }

  get hasLoadableValue() {
    return typeof this.source.value === "object";
  }

  compare(entity: HTMLAttributeEntity) {
    return super.compare(entity) && entity.name === this.name;
  }

  patch(entity: HTMLAttributeEntity) {
    super.patch(entity);
    this.value = entity.value;
  }

  async load() {
    await super.load();
    if (this.hasLoadableValue) {
      this.value = (<IValued><any>this.firstChild).value;
    }
  }

  mapSourceChildren() {
    return this.hasLoadableValue ? [this.source.value] : [];
  }

  cloneLeaf() {
    return new HTMLAttributeEntity(this.source);
  }
}

export const defaultAttributeFactoryDependency = new EntityFactoryDependency(HTMLAttributeExpression, HTMLAttributeEntity);