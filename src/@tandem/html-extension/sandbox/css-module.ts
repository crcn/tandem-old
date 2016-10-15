import { CSS_MIME_TYPE } from "@tandem/common";
import { evaluateCSS, parseCSS, SyntheticWindow, CSSExpression } from "@tandem/synthetic-browser";
import { BaseSandboxModule, SandboxModuleFactoryDependency } from "@tandem/sandbox";

export class HTMLCSSModule extends BaseSandboxModule {
  public ast: CSSExpression;
  load() {
    this.ast = parseCSS(this.content);
  }
  evaluate() {
    return evaluateCSS(this.ast) as any;
  }
}

export class HTMLCSSDOMModule extends HTMLCSSModule {
  private _evaluated: boolean;
  evaluate() {
    if (this._evaluated) return;
    this._evaluated = true;
    (<SyntheticWindow>this.sandbox.global).window.document.styleSheets.push(super.evaluate());
    return {};
  }
}