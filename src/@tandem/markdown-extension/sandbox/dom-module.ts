import * as marked from "marked";
import { BaseSandboxModule } from "@tandem/sandbox";
import { evaluateMarkup, parseMarkup, SyntheticWindow, MarkupExpression } from "@tandem/synthetic-browser";

export class MarkdownSandboxModule extends BaseSandboxModule {
  public ast: MarkupExpression;
  load() {
    this.ast = parseMarkup(marked(this.content));
  }

  evaluate2() {
    this.exports = evaluateMarkup(this.ast, (<SyntheticWindow>this.sandbox.global).document);
  }
}