import { Dependency, Dependencies } from "sf-common/dependencies";
import { CSSStyleSheetExpression } from "sf-html-extension/ast";

export const CSS_STYLESHEET_NS = "cssStyleSheet";
export class CSSStylesheetsDependency extends Dependency<Array<CSSStyleSheetExpression>> {
  private constructor() {
    super(CSS_STYLESHEET_NS, []);
  }

  toString() {
    return this.value.join("");
  }

  addStyleSheet(stylesheet: CSSStyleSheetExpression) {
    this.value.push(stylesheet);
  }

  static getInstance(dependencies: Dependencies) {
    let instance = dependencies.query<CSSStylesheetsDependency>(CSS_STYLESHEET_NS);
    if (!instance) {
      dependencies.register(instance = new CSSStylesheetsDependency());
    }
    return instance;
  }
}
