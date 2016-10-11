import * as path from "path";
import { JS_MIME_TYPE } from "@tandem/common";
import { BaseSandboxModule, sandboxModuleScriptType } from "@tandem/sandbox";

// TODO - move to another extension
export class CommonJSSandboxModule extends BaseSandboxModule {

  private _transpiledSource: string;

  initialize() {
    super.initialize();
    this._transpiledSource = this.transpile();
  }

  protected async compile() {
    return new Function("global", "context", `
      with(global) {
        with(context) {
        ${this._transpiledSource}
        }
      }
    `) as sandboxModuleScriptType;
  }

  protected transpile() {
    return this.content;
  }

  async evaluate(): Promise<any> {

    const importedModules = {};

    const deps = this._transpiledSource

    // strip comments since they may contain require statements
    .replace(/\/\*[\s\S]*?\*\/|\/\/[^\n\r]+/g, "")
    .match(/require\(.*?\)/g) || [];

    for (const dep of deps) {
      const modulePath = dep.match(/require\(["']([^'"]+)/)[1];
      importedModules[modulePath] = await this.sandbox.importer.import(JS_MIME_TYPE, modulePath, this.fileName);
    }

    const module = {
      exports: {}
    };

    const global = this.sandbox.global;

    const context = {
      require    : (path) => importedModules[path],
      module     : module,
      exports    : module.exports,
      __filename : this.fileName,
      __dirname  : path.dirname(this.fileName),
    };

    (await this.getScript()).call(global, global, context);

    return module.exports;
  }
}