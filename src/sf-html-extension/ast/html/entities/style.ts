import { inject } from "sf-core/decorators";
import { parseCSS } from "sf-html-extension/ast";
import { GroupNodeSection } from "sf-html-extension/dom";
import { HTMLElementEntity } from "./element";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { CSSStyleSheetExpression } from "sf-html-extension/ast";
import { HTMLElementExpression, HTMLTextExpression } from "sf-html-extension/ast";

export class HTMLStyleEntity extends HTMLElementEntity {
  async load() {
    super.load();
    const nodeValue = (<HTMLTextExpression>this.source.children[0]).value;
    this.document.entity.addStyleSheet(parseCSS(nodeValue));
  }

  createSection() {
    return new GroupNodeSection();
  }
}

export const htmlStyleEntityDependency = new EntityFactoryDependency(HTMLElementExpression, HTMLStyleEntity, "style");