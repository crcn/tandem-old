import * as vm from "vm";
import * as path from "path";
import { ISandboxDependencyEvaluator, SandboxModule, compileModuleSandboxScript, runModuleSandboxScript } from "@tandem/sandbox";

export class CommonJSSandboxEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {
    const { source, sandbox } = module;
    const { content, hash } = source;
    const { global, vmContext } = sandbox;

    const script = compileModuleSandboxScript(module.filePath, hash, content);

    const resolve = (relativePath) => {
      return source.eagerGetDependency(relativePath);
    };

    const require = (relativePath) => {
      const dep = resolve(relativePath);

      // DEP may not exist, especially if loaded by a NULL loader.
      return dep && sandbox.evaluate(dep);
    }

    (require as any).resolve = resolve;
    const context = source.graph.createModuleContext(module);
    Object.assign(context, { global, require });
    runModuleSandboxScript(script, hash, sandbox, context);
  }
}