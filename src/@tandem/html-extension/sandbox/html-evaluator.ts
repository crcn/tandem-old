import {
 SandboxModule,
 ISandboxBundleEvaluator,
} from "@tandem/sandbox";

import {
  parseMarkup,
  evaluateMarkup,
  SyntheticWindow,
  MarkupMimeTypeXMLNSDependency
} from "@tandem/synthetic-browser";

export class HTMLASTEvaluator implements ISandboxBundleEvaluator {
  evaluate(module: SandboxModule) {

    const window = <SyntheticWindow>module.sandbox.global;
    module.exports = evaluateMarkup(module.bundle.ast, window.document, MarkupMimeTypeXMLNSDependency.lookup(module.bundle.filePath, window.browser.dependencies), module);
  }
}