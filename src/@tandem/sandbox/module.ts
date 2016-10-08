import * as path from "path";
import { Sandbox } from "./sandbox";
import { ModuleImporter } from "./importer";
import { SandboxModuleAction } from "./actions";
import {
  bindable,
  MimeTypes,
  Observable,
  IObservable,
} from "@tandem/common";

export interface IModuleEditor {

}

export interface IModule extends IObservable {
  fileName: string;
  content: string;
  editor: IModuleEditor;
  evaluate(): Promise<any>;
}

export type moduleScriptType = (...rest: any[]) => any;
export abstract class BaseModule extends Observable implements IModule {

  @bindable()
  public content: string;

  readonly editor: IModuleEditor;

  protected _script: moduleScriptType;

  constructor(readonly fileName: string, content: string, readonly sandbox: Sandbox) {
    super();
    this.initialize();
    this.content = content;
    this.editor = this.createEditor();
  }

  protected createEditor(): IModuleEditor {
    return null;
  }

  protected initialize() { }

  async evaluate() {
    const run = await this.getScript();
    return await run();
  }

  protected abstract compile(): Promise<moduleScriptType>;

  protected async getScript() {
    if (this._script) return this._script;
    const run = await this.compile();
    return this._script = (...rest: any[]) => {
      this.notify(new SandboxModuleAction(SandboxModuleAction.EVALUATING));
      return run(...rest);
    };
  }
}

// TODO - move to another extension
export class CommonJSModule extends BaseModule {

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
    `) as moduleScriptType;
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
      importedModules[modulePath] = await this.sandbox.importer.import(MimeTypes.JavaScript, modulePath, this.fileName);
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