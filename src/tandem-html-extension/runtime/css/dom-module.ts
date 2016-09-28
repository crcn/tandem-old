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

export class DOMCSSModule extends BaseModule<any> {
  evaluate(context: SymbolTable) {
    const content = new SyntheticString(this._content);
    const doc = context.get("document") as SyntheticDocument;
    context.get("module").get("exports").set("content", content);
    const element = doc.createElement(new SyntheticString("style"));
    element.appendChild(doc.createTextNode(content));
    doc.body.appendChild(element);
  }
}

export const domCSSModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.DOM, MimeTypes.CSS, DOMCSSModule);
