import * as path from "path";
import { Sandbox } from "./sandbox";
import { MimeTypes } from "@tandem/common/constants";
import { ModuleImporter } from "./importer";

export interface IModule {
  evaluate(): Promise<any>;
}

export abstract class BaseModule implements IModule {
  abstract imports: Array<string>;

  constructor(readonly fileName: string, readonly content: string, readonly sandbox: Sandbox) {
    this.initialize();
  }


  protected initialize() {

  }

  abstract evaluate(): Promise<any>;
}

export class CommonJSModule extends BaseModule {

  private _imports: Array<string>;
  private _evaluate: Function;
  private _source: string;

  get imports(): Array<string> {
    return this._imports;
  }

  initialize() {
    const source = this._source = this.transpile();
    this._evaluate = new Function("context", `
      with(context) {
        ${source}
      }
    `);
  }

  protected transpile() {
    return this.content;
  }

  async evaluate(): Promise<any> {

    const importedModules = {};

    for (const dep of this._source.match(/require\(.*?\)/g) || []) {
      const modulePath = dep.match(/require\(["']([^'"]+)/)[1];
      importedModules[modulePath] = await this.sandbox.importer.import(MimeTypes.JavaScript, modulePath, this.fileName);
    }

    const module = {
      exports: {}
    };

    const context = Object.assign({}, this.sandbox.globals, {
      require    : (path) => importedModules[path],
      module     : module,
      exports    : module.exports,
      __filename : this.fileName,
      __dirname  : path.dirname(this.fileName),
    });

    this._evaluate(context);

    return module.exports;
  }
}