import { CSS_MIME_TYPE } from "@tandem/common";
import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser";
import { BaseSandboxModule, SandboxModuleFactoryDependency } from "@tandem/sandbox";

export class HTMLCSSModule extends BaseSandboxModule {
  compile() {
    return Promise.resolve(() => evaluateCSS(parseCSS(this.content)));
  }
}