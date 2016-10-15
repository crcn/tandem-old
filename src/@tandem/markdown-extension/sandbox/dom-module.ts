import * as marked from "marked";
import { BaseSandboxModule } from "@tandem/sandbox";
import { 
  evaluateMarkupAsync,
  parseMarkup,
  SyntheticWindow,
  MarkupExpression,
  SyntheticDOMNode
} from "@tandem/synthetic-browser";

export class MarkdownSandboxModule extends BaseSandboxModule {
  public ast: MarkupExpression;
  public node: SyntheticDOMNode;
  async load() {
    this.ast = parseMarkup(marked(this.content));
    this.node = await evaluateMarkupAsync(this.ast, (<SyntheticWindow>this.sandbox.global).document);
  }
  evaluate() {
    return this.node;
  }
}