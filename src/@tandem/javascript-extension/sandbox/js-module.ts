import * as path from "path";
import { JS_MIME_TYPE } from "@tandem/common";
import { BaseSandboxModule, sandboxModuleScriptType } from "@tandem/sandbox";

// TODO - move to another extension
export class CommonJSSandboxModule extends BaseSandboxModule {

  private _transpiledSource: string;
  private _imports: any;
  private _run: Function;
  private _exports: any;
  public exports: any;

  initialize() {
    super.initialize();
    this._transpiledSource = this.transpile();
  }

  protected compile() {
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

  reset() {
    this._exports = undefined;
  }

  async load() {
    const importedModules = this._imports = {};

    const deps = this._transpiledSource

    // strip comments since they may contain require statements
    .replace(/\/\*[\s\S]*?\*\/|\/\/[^\n\r]+/g, "")
    .match(/require\(.*?\)/g) || [];

    // load these modules in parallel
    await Promise.all(deps.map(async (dep) => {
      const modulePath = dep.match(/require\(["']([^'"]+)/)[1];
      importedModules[modulePath] = await this.sandbox.importer.load(JS_MIME_TYPE, modulePath, this.fileName);
    }));

    this._run = this.compile();
  }

  evaluate() {
    if (this.exports) return this.exports;
    this.exports = {};

    const global = this.sandbox.global;

    const context = {
      require    : (path) => this._imports[path].evaluate(),
      module     : this,
      exports    : this.exports,
      __filename : this.fileName,
      __dirname  : path.dirname(this.fileName),
    };

    this._run(global, context);

    return this.exports;
  }
}