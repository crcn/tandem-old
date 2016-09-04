import { Dependency, Dependencies } from "tandem-common/dependencies";
import { CSSStyleSheetExpression } from "tandem-html-extension/ast";

export const CSS_STYLESHEET_NS = "cssStyleSheet";
export class CSSStylesheetsDependency extends Dependency<Array<CSSStyleSheetExpression>> {
  private constructor() {
    super(CSS_STYLESHEET_NS, []);
  }

  toString() {

    // this is MUCH faster than calling toString on the expression since toString
    // will iterate through all child expressions -- which will also perform formatting. Assuming
    // that the stylesheet being stringified has 4k+ selectors, calling toString() will be incredibly slow.
    return this.value.map((expression) => expression.getSourcePart()).join("\n");
    // return this.value.join("");
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
