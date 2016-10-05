import { MimeTypes } from "@tandem/common";
import { parseHTML, evaluateHTML } from "@tandem/synthetic-browser";
import { BaseModule, ModuleFactoryDependency } from "@tandem/sandbox";

export class HTMLDOMModule extends BaseModule {
  async evaluate() {
    const { document } = this.sandbox.global;
    document.body.appendChild(evaluateHTML(parseHTML(this.content), document));
  }
}

export const htmlDOMModuleFactoryDependency = new ModuleFactoryDependency(MimeTypes.HTML, MimeTypes.HTML, HTMLDOMModule);