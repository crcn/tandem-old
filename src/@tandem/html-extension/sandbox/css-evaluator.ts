import {
 SandboxModule,
 ISandboxDependencyEvaluator,
} from "@tandem/sandbox";

import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser";

export class CSSASTEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {
    if (!module.source.ast) {
      console.log(module.source.filePath);
    }
    module.exports = evaluateCSS(module.source.ast, module.source.map, module);
  }
}