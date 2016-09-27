import {
  BaseModule,
  SymbolTable,
  EnvironmentKind,
  SyntheticObject,
  SyntheticString,
  SyntheticElement,
  SyntheticDocument,
  ModuleFactoryDependency
} from "tandem-runtime";

import { MimeTypes } from "../../constants";

export class CSSModule extends BaseModule<SyntheticObject> {
  evaluate(context: SymbolTable) {
    context.get("context").set("content", new SyntheticString(this._content));
    return null;
  }
}

export const cssModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.CSS, MimeTypes.CSS, CSSModule);
