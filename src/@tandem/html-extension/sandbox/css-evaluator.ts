import {
 Sandbox2Module,
 ISandboxBundleEvaluator,
} from "@tandem/sandbox";

import { evaluateCSS } from "@tandem/synthetic-browser";

export class CSSASTEvaluator implements ISandboxBundleEvaluator {
  evaluate(module: Sandbox2Module) {
    module.exports = evaluateCSS(module.bundle.content.value);
  }
}