import { MimeTypes } from "@tandem/common";
import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser";
import { BaseModule, ModuleFactoryDependency } from "@tandem/sandbox";

export class HTMLCSSModule extends BaseModule {
  compile() {
    return Promise.resolve(() => evaluateCSS(parseCSS(this.content)));
  }
}

export const cssModuleFactoryDependency = new ModuleFactoryDependency(MimeTypes.CSS, MimeTypes.CSS, HTMLCSSModule);