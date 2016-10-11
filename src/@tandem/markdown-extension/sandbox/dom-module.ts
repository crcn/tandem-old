import * as marked from "marked";
import { BaseSandboxModule } from "@tandem/sandbox";
import { evaluateMarkup, parseMarkup, SyntheticWindow } from "@tandem/synthetic-browser";

export class MarkdownSandboxModule extends BaseSandboxModule {
  compile() {
    return () => {
      const window = <SyntheticWindow>this.sandbox.global;
      return evaluateMarkup(parseMarkup(marked(this.content)), window.document);
    };
  }
}