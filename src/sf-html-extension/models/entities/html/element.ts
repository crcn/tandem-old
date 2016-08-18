import { IHTMLEntity } from "./base";
import { IElementEntity } from "sf-core/entities";
import { parse as parseCSS, parseCSSStyle } from "sf-html-extension/parsers/css";
import { CSSStyleExpression } from "sf-html-extension/parsers/css";
import { HTMLContainerEntity } from "./container";
import { AttributeChangeAction } from "sf-core/actions";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { HTMLElementExpression, HTMLAttributeExpression } from "sf-html-extension/parsers/html";
import { IElement, Attributes, IMarkupSection, NodeSection } from "sf-core/markup";

export class HTMLElementEntity extends HTMLContainerEntity implements IHTMLEntity, IElementEntity, IElement {

  // no type specified since certain elements such as <style />, and <link />
  // do not fit into a particular category. This may change later on.
  readonly type: string = null;
  private _styleExpression: CSSStyleExpression;
  readonly attributes: Attributes = new Attributes();

  constructor(public source: HTMLElementExpression) {
    super(source);
    // TODO - attributes might need to be transformed here
    if (source.attributes) {
      for (const attribute of source.attributes) {
        this.setAttribute(attribute.name, attribute.value);
      }
    }
  }

  get styleExpression(): CSSStyleExpression {
    if (this._styleExpression) return this._styleExpression;
    const style = this.getAttribute("style");
    return this._styleExpression = style ? parseCSSStyle(style) : new CSSStyleExpression([], null);
  }

  sync() {
    if (this.styleExpression.declarations.length) {
      this.setAttribute("style", this.styleExpression.toString());
    }
    super.sync();
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
    if (name === "style") {
      this._styleExpression = parseCSSStyle(value);
    }
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

