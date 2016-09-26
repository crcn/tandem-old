import { MimeTypes } from "../constants";
import { TSJSModule } from "./js-module";
import {
  BaseModule,
  SymbolTable,
  EnvironmentKind,
  ModuleFactoryDependency,
} from "tandem-runtime";

export class TSDOMModule extends BaseModule<any> {
  private _module: TSJSModule;
  constructor(fileName: string, content: string) {
    super(fileName, content);
    this._module = new TSJSModule(fileName, content);
  }
  async evaluate(context: SymbolTable) {

    // TODO -- attach to context.element or context.document
    return this._module.evaluate(context);
  }
}

export const tsDomModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.DOM, MimeTypes.TS, TSDOMModule);