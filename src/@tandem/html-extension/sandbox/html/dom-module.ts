import { MimeTypes } from "@tandem/common";
import { parseMarkup, evaluateMarkup } from "@tandem/synthetic-browser";
import { BaseModule, ModuleFactoryDependency } from "@tandem/sandbox";

export class HTMLDOMModule extends BaseModule {
  async evaluate() {
    const { document } = this.sandbox.global;
    document.body.appendChild(evaluateMarkup(parseMarkup(this.content), document));
  }
}

export const htmlDOMModuleFactoryDependency = new ModuleFactoryDependency(MimeTypes.HTML, MimeTypes.HTML, HTMLDOMModule);