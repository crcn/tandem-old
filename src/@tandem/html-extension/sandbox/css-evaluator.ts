import {
 SandboxModule,
 ISandboxBundleEvaluator,
} from "@tandem/sandbox";

import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser";

export class CSSASTEvaluator implements ISandboxBundleEvaluator {
  evaluate(module: SandboxModule) {
    if (!module.bundle.ast) {
      console.log(module.bundle.filePath);
    }
    module.exports = evaluateCSS(module.bundle.ast, module.bundle.map, module);
  }
}