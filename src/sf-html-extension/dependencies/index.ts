import { flatten } from "lodash";
import { CSSStyleSheetExpression } from "sf-html-extension/ast";
import { Dependencies, Dependency } from "sf-core/dependencies";

export const CSS_STYLE_SHEETS_NS = "cssStyleSheets";
export class CSSStyleSheetsDependency extends Dependency<Array<CSSStyleSheetExpression>> {
  constructor() {
    super(CSS_STYLE_SHEETS_NS, []);
  }
  get rules() {
    return flatten(this.value.map((item) => item.rules));
  }
  register(...stylesheets: Array<CSSStyleSheetExpression>) {
    this.value.push(...stylesheets);
  }
  unregister(...stylesheets: Array<CSSStyleSheetExpression>) {
    for (const stylesheet of stylesheets) {
      const i = this.value.indexOf(stylesheet);
      if (i !== -1) this.value.splice(i, 1);
    }
  }
  toString() {
    return this.value.join("");
  }
  static findOrRegister(dependencies: Dependencies): CSSStyleSheetsDependency {
    let dep = dependencies.query<CSSStyleSheetsDependency>(CSS_STYLE_SHEETS_NS);
    if (dep) return dep;
    dependencies.register(dep = new CSSStyleSheetsDependency());
    return dep;
  }
}