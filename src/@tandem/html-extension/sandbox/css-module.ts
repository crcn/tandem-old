import { CSS_MIME_TYPE } from "@tandem/common";
import { evaluateCSS, parseCSS, SyntheticWindow, CSSExpression } from "@tandem/synthetic-browser";
import { BaseSandboxModule, SandboxModuleFactoryDependency } from "@tandem/sandbox";

export class HTMLCSSModule extends BaseSandboxModule {
  public ast: CSSExpression;
  load() {
    this.ast = parseCSS(this.content);
  }
  evaluate2() {
    this.exports = evaluateCSS(this.ast);
  }
}

export class HTMLCSSDOMModule extends HTMLCSSModule {
  evaluate2() {
    super.evaluate2();
    (<SyntheticWindow>this.sandbox.global).window.document.styleSheets.push(this.exports);
  }
}