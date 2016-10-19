import {
 Sandbox2Module,
 ISandboxBundleEvaluator,
} from "@tandem/sandbox";

import { evaluateMarkupSync } from "@tandem/synthetic-browser";

export class HTMLASTEvaluator implements ISandboxBundleEvaluator {
  evaluate(module: Sandbox2Module) {
    console.log("EVAL");
    module.exports = evaluateMarkupSync(module.bundle.content.value, module.sandbox.global.document);
    console.log(module.exports);
  }
}