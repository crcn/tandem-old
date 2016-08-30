import { IHTMLEntity } from "./base";
import { MetadataKeys } from "sf-front-end/constants";
import { IElementEntity } from "sf-core/ast/entities";
import { CSSRuleExpression } from "sf-html-extension/ast";
import { CSSStyleExpression } from "sf-html-extension/ast";
import { HTMLContainerEntity } from "./container";
import { IElement, Attributes } from "sf-core/markup";
import { AttributeChangeAction } from "sf-core/actions";
import { diffArray, patchArray } from "sf-core/utils/array";
import { parseCSS, parseCSSStyle } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { CSSStyleSheetsDependency } from "sf-html-extension/dependencies";
import { IDOMSection, NodeSection } from "sf-html-extension/dom";
import { HTMLElementExpression, HTMLAttributeExpression } from "sf-html-extension/ast";

export class HTMLElementEntity extends HTMLContainerEntity<HTMLElementExpression> implements IHTMLEntity, IElementEntity, IElement {

  private _attributes: Attributes;

  patch(entity: HTMLElementEntity) {
    this.patchSelf(entity);
    super.patch(entity);
  }

  protected patchSelf(entity: HTMLElementEntity) {
    const changes = diffArray(this.attributes, entity.attributes, (a, b) => a.name === b.name);

    for (const add of changes.add) {
      this.setAttribute(add.value.name, add.value.value);
    }

    for (const [oldAttribute, newAttribute] of changes.update) {
      if (oldAttribute.value !== newAttribute.value) {
        this.setAttribute(newAttribute.name, newAttribute.value);
      }
    }

    for (const remove of changes.remove) {
      this.removeAttribute(remove.name);
    }
  }

  async load() {
    await this.loadSelf();
    return super.load();
  }

  protected async loadSelf() {
    // TODO - attributes might need to be transformed here
    if (this.source.attributes) {
      for (const attribute of this.source.attributes) {
        this.setAttribute(attribute.name, attribute.value);
      }
    }
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.LAYER_DEPENDENCY_NAME]: "element"
    });
  }

  get attributes(): Attributes {
    return this._attributes || (this._attributes = new Attributes());
  }

  get cssRuleExpressions(): Array<CSSRuleExpression> {
    return CSSStyleSheetsDependency.findOrRegister(this._dependencies).rules.filter((rule) => {
      return rule.test(this);
    });
  }

  createSection(): IDOMSection {
    return new NodeSection(document.createElement(this.name));
  }

  static mapSourceChildren(source: HTMLElementExpression) {
    return source.children;
  }

  removeAttribute(name: string) {
    this.attributes.remove(name);
    (<Element>this.section.targetNode).removeAttribute(name);
  }

  getAttribute(name: string) {
    return this.attributes.get(name);
  }

  hasAttribute(name: string) {
    return this.attributes.has(name);
  }

  setAttribute(name: string, value: string) {
    if (this.section instanceof NodeSection) {
      (<Element>this.section.targetNode).setAttribute(name, value);
    }
    this.attributes.set(name, value);
    this.notify(new AttributeChangeAction(name, value));
  }

  clone() {
    const entity = new HTMLElementEntity(this.source);
    for (const child of this.children) {
      entity.appendChild(child.clone());
    }
    return entity;
  }

  willUnmount() {
    this.section.remove();
  }
}

