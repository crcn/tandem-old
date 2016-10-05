// import {
//   SymbolTable,
//   HTMLNodeType,
//   SyntheticString,
//   ModuleImporter,
//   SyntheticObject,
//   EnvironmentKind,
//   SyntheticElement,
//   SyntheticValueObject,
//   SyntheticElementComponent,
//   SyntheticContainerComponent,
//   SyntheticNodeComponentFactory,
// } from "@tandem/runtime";

// import {
//   MimeTypeDependency
// } from "@tandem/common";

// import * as path from "path";

// export class SyntheticLinkElementComponent extends SyntheticContainerComponent<SyntheticElement>  {

//   async load(context: SymbolTable) {

//     const importer = context.get<SyntheticValueObject<ModuleImporter>>("__importer").value;

//     const ownerDocument = this.target.ownerDocument;
//     const href          = this.target.getAttribute(new SyntheticString("href")).value;

//     const exports = await importer.require(EnvironmentKind.CSS, href, MimeTypeDependency.lookup(href, this._dependencies), ownerDocument.location.href.toString()) as SyntheticString;
//     const element = ownerDocument.createElement(new SyntheticString("style"));
//     element.appendChild(ownerDocument.createTextNode(exports.get("content")));

//     const child = SyntheticNodeComponentFactory.create(element, this._dependencies);
//     await child.load(context);

//     this.appendChild(child);
//   }
// }

// export const syntheticLinkComponentFactoryDependency = new SyntheticNodeComponentFactory("link", HTMLNodeType.ELEMENT, SyntheticLinkElementComponent);