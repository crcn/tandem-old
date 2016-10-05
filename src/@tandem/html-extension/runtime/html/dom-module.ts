// import {
//   BaseModule,
//   SymbolTable,
//   EnvironmentKind,
//   SyntheticHTMLDocument,
//   ModuleFactoryDependency,
// } from "@tandem/runtime";

// import {
//   MimeTypes
// } from "../../constants";

// import { evaluateHTML } from "./evaluator";
// import { parse } from "./parser.peg";

// export class DOMHTMLModule extends BaseModule<any> {
//   evaluate(context: SymbolTable) {
//     const doc = context.get<SyntheticHTMLDocument>("document");
//     doc.body.appendChild(evaluateHTML(parse(this._content), context));
//   }
// }


// export const domHTMLModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.DOM, MimeTypes.HTML, DOMHTMLModule);
