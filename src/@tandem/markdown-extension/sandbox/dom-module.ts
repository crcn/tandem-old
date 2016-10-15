import * as marked from "marked";
import { BaseSandboxModule } from "@tandem/sandbox";
import { evaluateMarkupAsync, parseMarkup, SyntheticWindow, MarkupExpression } from "@tandem/synthetic-browser";

export class MarkdownSandboxModule extends BaseSandboxModule {
  public ast: MarkupExpression;
  async load() {
    this.ast = parseMarkup(marked(this.content));
    this.exports = await evaluateMarkupAsync(this.ast, (<SyntheticWindow>this.sandbox.global).document, null, this);
  }
}