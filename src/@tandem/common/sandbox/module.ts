import { Sandbox } from "./sandbox";
import { ModuleImporter } from "./importer";

export interface IModule {
  async evaluate(): Promise<any>;
}

export abstract class BaseModule implements IModule {
  abstract imports: Array<string>;

  constructor(readonly fileName: string, readonly content: string, readonly sandbox: Sandbox) {
    this.initialize();
  }


  protected initialize() {

  }

  abstract async evaluate(): Promise<any>;
}

export abstract class CommonJSModule extends BaseModule {

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

  protected abstract transpile();

  async evaluate(): Promise<any> {

    const modules = {};

    for (const dep of this._source.match(/require\(.*?\)/g) || []) {
      const modulePath = dep.match(/require\(["']([^'"]+)/)[1];
      console.log(modulePath);
      modules[modulePath] = await this.sandbox.import("javascript", modulePath, this.fileName);
    }

    return this._evaluate({
      require: (path) => modules[path]
    });
  }
}