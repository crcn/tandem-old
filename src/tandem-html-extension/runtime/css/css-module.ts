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
    return new SyntheticObject({
      content: new SyntheticString(this._content)
    });
  }
}

export const cssModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.CSS, MimeTypes.CSS, CSSModule);
