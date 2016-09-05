import { inject } from "tandem-common/decorators";
import { parseCSS } from "tandem-html-extension/ast";
import { GroupNodeSection } from "tandem-html-extension/dom";
import { HTMLElementEntity } from "./element";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import { HTMLElementExpression, HTMLTextExpression } from "tandem-html-extension/ast";

export class HTMLStyleEntity extends HTMLElementEntity {
  load() {
    super.load();
    // const nodeValue = (<HTMLTextExpression>this.source.children[0]).value;
    // CSSStylesheetsDependency.getInstance(this._dependencies).addStyleSheet(parseCSS(nodeValue));
  }

  createSection() {
    return new GroupNodeSection();
  }
}

export const htmlStyleEntityDependency = new EntityFactoryDependency(HTMLElementExpression, HTMLStyleEntity, "style");