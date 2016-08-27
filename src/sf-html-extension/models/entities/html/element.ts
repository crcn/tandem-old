import { IHTMLEntity } from "./base";
import { IElementEntity } from "sf-core/entities";
import { CSSRuleExpression } from "sf-html-extension/parsers/css";
import { CSSStyleExpression } from "sf-html-extension/parsers/css";
import { HTMLContainerEntity } from "./container";
import { AttributeChangeAction } from "sf-core/actions";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { parse as parseCSS, parseCSSStyle } from "sf-html-extension/parsers/css";
import { HTMLElementExpression, HTMLAttributeExpression } from "sf-html-extension/parsers/html";
import { IElement, Attributes, IMarkupSection, NodeSection } from "sf-core/markup";

export class HTMLElementEntity extends HTMLContainerEntity implements IHTMLEntity, IElementEntity, IElement {

  // no type specified since certain elements such as <style />, and <link />
  // do not fit into a particular category. This may change later on.
  readonly type: string = null;
  private _source: HTMLElementExpression;
  private _attributes: Attributes;

  constructor(source: HTMLElementExpression) {
    super(source);
    // TODO - attributes might need to be transformed here
    if (source.attributes) {
      for (const attribute of source.attributes) {
        this.setAttribute(attribute.name, attribute.value);
      }
    }
  }

  async load() {
    // TODO - attributes might need to be transformed here
    if (this.source.attributes) {
      for (const attribute of this.source.attributes) {
        this.setAttribute(attribute.name, attribute.value);
      }
    }

    return super.load();
  }

  get attributes(): Attributes {
    return this._attributes || (this._attributes = new Attributes());
  }

  get source(): HTMLElementExpression {
    return this._source;
  }

  set source(value: HTMLElementExpression) {
    this.willSourceChange(value);
    this._source = value;
  }

  get cssRuleExpressions(): Array<CSSRuleExpression> {
    return this.document.stylesheet.rules.filter((rule) => rule.test(this));
  }

  protected willSourceChange(value: HTMLElementExpression) {
    // override me
  }

  static mapSourceChildren(source: HTMLElementExpression) {
    return source.childNodes;
  }

  removeAttribute(name: string) {
    this.attributes.remove(name);
    (<IElement>this.section.targetNode).removeAttribute(name);
    for (let i = this.source.attributes.length; i--; ) {
      const attribute = this.source.attributes[i];
      if (attribute.name === name) {
        this.source.attributes.splice(i, 1);
        return;
      }
    }
  }

  getAttribute(name: string) {
    return this.attributes.get(name);
  }

  hasAttribute(name: string) {
    return this.attributes.has(name);
  }

  setAttribute(name: string, value: string) {
    (<IElement>this.section.targetNode).setAttribute(name, value);
    this.source.setAttribute(name, value);
    this.attributes.set(name, value);
    this.notify(new AttributeChangeAction(name, value));
  }

  cloneNode(deep?: boolean) {
    const entity = new HTMLElementEntity(this.source);
    if (deep)
    for (const child of this.childNodes) {
      entity.appendChild(child.cloneNode(deep));
    }
    return entity;
  }

  willUnmount() {
    this.section.remove();
  }
}

