import { ISandboxBundleEvaluator, SandboxModule } from "@tandem/sandbox";
import * as path from "path";
import * as vm from "vm";

const _cache = {};
function compile(content: string): vm.Script {
  return _cache[content] || (_cache[content] = new vm.Script(`
    with(this.window) {
      ${content}
    }
  `));
}

export class CommonJSSandboxEvaluator implements ISandboxBundleEvaluator {
  evaluate(module: SandboxModule) {
    const { bundle, sandbox } = module;
    const { content } = bundle;

    const script = compile(content);

    script.runInNewContext({
      module: module,
      window: sandbox.global,
      exports: module.exports,
      __filename: bundle.filePath,
      __dirname: path.dirname(bundle.filePath),
      require: (relativePath) => {
        return sandbox.require(bundle.getDependencyHash(relativePath));
      }
    }, {
      filename: bundle.filePath,
      displayErrors: true
    });
  }
}