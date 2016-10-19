import {
 Sandbox2Module,
 ISandboxBundleEvaluator,
} from "@tandem/sandbox";

import { evaluateMarkupSync, SyntheticWindow, MarkupMimeTypeXMLNSDependency } from "@tandem/synthetic-browser";

export class HTMLASTEvaluator implements ISandboxBundleEvaluator {
  evaluate(module: Sandbox2Module) {
    const window = <SyntheticWindow>module.sandbox.global;
    module.exports = evaluateMarkupSync(module.bundle.content.value, window.document, MarkupMimeTypeXMLNSDependency.lookup(module.bundle.filePath, window.browser.dependencies), module);
  }
}