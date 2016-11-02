import { ISandboxDependencyEvaluator, SandboxModule } from "@tandem/sandbox";
import * as path from "path";
import * as vm from "vm";

const _cache = {};
function compile(filePath: string, hash: string, content: string): vm.Script {

  // Using string concatenation here to preserve line numbers.
  return _cache[hash + content] || (_cache[hash + content] = new vm.Script(
    "with($$contexts['"+hash+"']) {" +

      // Ugly, but native constructors can only be used from the global object if they are
      // defined within a VM context.
      "if (!global.Object)" +
      "Object.assign(global, { Object, Array, String, Math, Number , Boolean, Date, Function, RegExp, TypeError }); " +

      // guard from global context values from being overwritten.
      "(function(){" +

        // new line in case there's comment
        content + "\n" +
      "})();" +
    "}", {
      filename: filePath,
      displayErrors: true
    }));
}

export class CommonJSSandboxEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {
    const { source, sandbox } = module;
    const { content, hash } = source;
    const { global, vmContext } = sandbox;

    const script = compile(module.filePath, hash, content);

    const resolve = (relativePath) => {
      return source.eagerGetDependency(relativePath);
    };

    const require = (relativePath) => {
      const dep = resolve(relativePath);

      // DEP may not exist, especially if loaded by a NULL loader.
      return dep && sandbox.evaluate(dep);
    }

    (require as any).resolve = resolve;

    if (!global.$$contexts) global.$$contexts = {};
    global.$$contexts[hash] = {
      global: global,
      module: module,
      exports: module.exports,
      __filename: source.filePath,
      __dirname: path.dirname(source.filePath),
      require: require
    }

    script.runInContext(vmContext);
  }
}