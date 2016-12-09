import {
 SandboxModule,
 ISandboxDependencyEvaluator,
} from "@tandem/sandbox";

import { evaluateCSS, parseCSS } from "@tandem/synthetic-browser";

export class CSSASTEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {
    module.exports = evaluateCSS(parseCSS(module.source.content), module.source.map, module);
  }
}