import {
 SandboxModule,
 ISandboxBundleEvaluator,
} from "@tandem/sandbox";

import {
  parseMarkup,
  evaluateMarkup,
  SyntheticWindow,
  MarkupMimeTypeXMLNSProvider
} from "@tandem/synthetic-browser";

export class HTMLASTEvaluator implements ISandboxBundleEvaluator {
  evaluate(module: SandboxModule) {

    const window = <SyntheticWindow>module.sandbox.global;
    module.exports = evaluateMarkup(module.source.ast, window.document, MarkupMimeTypeXMLNSProvider.lookup(module.source.filePath, window.browser.injector), module);
  }
}