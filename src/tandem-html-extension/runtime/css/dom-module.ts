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

export class DOMCSSModule extends BaseModule<SyntheticObject> {
  evaluate(context: SymbolTable) {
    const doc = context.get("document") as SyntheticDocument;
    const element = doc.createElement(new SyntheticString("style"));
    element.appendChild(doc.createTextNode(new SyntheticString(this._content)));
    doc.body.appendChild(element);
    return new SyntheticObject();
  }
}

export const domCSSModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.DOM, MimeTypes.CSS, DOMCSSModule);
