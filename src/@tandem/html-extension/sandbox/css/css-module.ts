import { MimeTypes } from "@tandem/common";
import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser";
import { BaseModule, ModuleFactoryDependency } from "@tandem/sandbox";

export class HTMLCSSModule extends BaseModule {
  async evaluate() {
    const { document } = this.sandbox.global;
    return evaluateCSS(parseCSS(this.content));
  }
}

export const cssModuleFactoryDependency = new ModuleFactoryDependency(MimeTypes.CSS, MimeTypes.CSS, HTMLCSSModule);