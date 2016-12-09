import {
 SandboxModule,
 ISandboxDependencyEvaluator,
} from "@tandem/sandbox";

import {
  parseMarkup,
  evaluateMarkup,
  SyntheticWindow,
  MarkupMimeTypeXMLNSProvider,
} from "@tandem/synthetic-browser";

export class HTMLASTEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {

    const window = <SyntheticWindow>module.sandbox.global;

    window.document.removeAllChildren();
    
    // documentElement must be this -- handled by browser instance. Also note
    // that we're not manually setting document element here to ensure that HTMLASTEvaluator works for imported docs
    // which is (slowly) being implemented in real browsers.
    evaluateMarkup(parseMarkup(module.source.content), window.document, MarkupMimeTypeXMLNSProvider.lookup(module.source.uri, window.browser.injector), module, window.document);

  }
}