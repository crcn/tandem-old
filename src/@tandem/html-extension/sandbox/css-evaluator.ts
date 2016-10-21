import {
 SandboxModule,
 ISandboxBundleEvaluator,
} from "@tandem/sandbox";

import { evaluateCSS } from "@tandem/synthetic-browser";

export class CSSASTEvaluator implements ISandboxBundleEvaluator {
  evaluate(module: SandboxModule) {
    module.exports = evaluateCSS(module.bundle.content.value, module);
  }
}