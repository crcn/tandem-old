import {
 SandboxModule,
 ISandboxDependencyEvaluator,
} from "@tandem/sandbox";

import {
  parseMarkup,
  evaluateMarkup,
  SyntheticWindow,
  MarkupMimeTypeXMLNSProvider
} from "@tandem/synthetic-browser";

export class HTMLASTEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {

    const window = <SyntheticWindow>module.sandbox.global;
    module.exports = evaluateMarkup(parseMarkup(module.source.content), window.document, MarkupMimeTypeXMLNSProvider.lookup(module.source.filePath, window.browser.injector), module);
  }
}