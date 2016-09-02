import { Action } from "sf-core/actions";
import { WrapBus } from "mesh";
import { IEntity } from "sf-core/ast";
import { bindable } from "sf-core/decorators";
import { BaseEntity } from "sf-core/ast";
import { IHTMLNodeEntity } from "./base";
import { MetadataKeys } from "sf-front-end/constants";
import { HTMLNodeEntity } from "./node";
import { INamed, IValued } from "sf-core/object";
import { diffArray, patchArray } from "sf-core/utils/array";
import { parseCSS, parseCSSStyle } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { IDOMSection, NodeSection } from "sf-html-extension/dom";
import { HTMLElementExpression, HTMLAttributeExpression } from "sf-html-extension/ast";
import { AttributeChangeAction, NODE_ADDED, NODE_REMOVING, PROPERTY_CHANGE } from "sf-core/actions";
import { CSSRuleExpression, CSSStyleExpression, IHTMLElementAttributeEntity } from "sf-html-extension/ast";
import * as sift from "sift";

export class HTMLElementEntity extends HTMLNodeEntity<HTMLElementExpression> implements IHTMLNodeEntity {

  get attributes(): Array<BaseEntity<any> & IHTMLElementAttributeEntity> {
    return <any>this.children.filter((child) => child.source.constructor === HTMLAttributeExpression);
  }

  // async load() {
  //   await this.loadSelf();
  //   return super.load();
  // }

  // protected async loadSelf() {
  //   for (const attribute of this.source.attributes) {

  //     let valueEntityFactory = ElementAttributeEntityFactory.findBySource(attribute, this._dependencies) ||
  //     ElementAttributeEntityFactory.findByName("defaultAttribute", this._dependencies);

  //     const attributeEntity = valueEntityFactory.create(attribute);
  //     this.attributes.push(attributeEntity);
  //     await attributeEntity.load();
  //     if (this.section instanceof NodeSection) {
  //       (<Element>this.section.targetNode).setAttribute(attributeEntity.name, attributeEntity.value);
  //     }
  //   }
  // }

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

  static mapSourceChildren(source: HTMLElementExpression) {
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
    if (!attribute) throw new Error(`Attempting to set value on attribute entity "${name}" that does not exist. Add a new attribute entity to the children, modify the target node, or the element entity source instead.`);
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