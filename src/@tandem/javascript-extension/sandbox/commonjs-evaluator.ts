import { ISandboxDependencyEvaluator, SandboxModule } from "@tandem/sandbox";
import * as path from "path";
import * as vm from "vm";

const _cache = {};
function compile(content: string): vm.Script {
  return _cache[content] || (_cache[content] = new vm.Script(`
    with(this.window || {}) {
      ${content}
    }
  `));
}

export class CommonJSSandboxEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {
    const { source, sandbox } = module;
    const { content } = source;

    const script = compile(content);

    script.runInNewContext({
      module: module,
      window: sandbox.global,
      exports: module.exports,
      __filename: source.filePath,
      __dirname: path.dirname(source.filePath),
      require: (relativePath) => {
        return sandbox.evaluate(source.eagerGetDependency(relativePath));
      }
    }, {
      filename: source.filePath,
      displayErrors: true
    });
  }
}