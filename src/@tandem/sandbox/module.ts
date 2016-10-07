import * as path from "path";
import { Sandbox } from "./sandbox";
import { MimeTypes } from "@tandem/common/constants";
import { ModuleImporter } from "./importer";

export interface IModule {
  evaluate(): Promise<any>;
}

export abstract class BaseModule implements IModule {

  constructor(readonly fileName: string, readonly content: string, readonly sandbox: Sandbox) {
    this.initialize();
  }


  protected initialize() {

  }

  abstract evaluate(): Promise<any>;
}

// TODO - move to another extension
export class CommonJSModule extends BaseModule {

  private _evaluate: Function;
  private _source: string;

  initialize() {
    const source = this._source = this.transpile();
    this._evaluate = new Function("global", "context", `
      with(global) {
        with(context) {
        ${source}
        }
      }
    `);
  }

  protected transpile() {
    return this.content;
  }

  async evaluate(): Promise<any> {

    const importedModules = {};

    const deps = this._source

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

    this._evaluate.call(global, global, context);

    return module.exports;
  }
}