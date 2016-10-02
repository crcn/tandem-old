import {
  BaseModule,
  SymbolTable,
  EnvironmentKind,
  SyntheticObject,
  SyntheticString,
  SyntheticElement,
  SyntheticDocument,
  ModuleFactoryDependency
} from "@tandem/runtime";

import { MimeTypes } from "../../constants";

export class CSSModule extends BaseModule<any> {
  evaluate(context: SymbolTable) {
    context.get("exports").set("content", new SyntheticString(this._content));
  }
}

export const cssModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.CSS, MimeTypes.CSS, CSSModule);
