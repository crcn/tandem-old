import { SyntheticDocument, SyntheticElement, SyntheticTextNode } from "./dom";
import {
  ISynthetic,
  SymbolTable,
  SyntheticKind,
  SyntheticJSXElement,
  SyntheticJSXAttribute,
  SyntheticWrapperFunction,
} from "./core";

export const renderSyntheticJSX = new SyntheticWrapperFunction(function (jsx: SyntheticJSXElement, element: SyntheticElement) {

  // no diffing here -- just render out the DOM elements since they'yre also synthetic -- they'll
  // be patched later on.
  while (element.childNodes.value.length) {
    element.removeChild(element.childNodes[0]);
  }

  _render(this, element, [jsx]);
});

function _render(context: SymbolTable, parent: SyntheticElement, children: Array<any>) {
  const doc = context.get<SyntheticDocument>("document");

  for (const child of children) {
    if (child.kind === SyntheticKind.JSXElement) {
      const childJSXElement = <SyntheticJSXElement>child;
      const childElement = doc.createElement(childJSXElement.name);
      for (const attribute of childJSXElement.attributes.value) {
        childElement.setAttribute(attribute.name, attribute.value);
      }
      _render(context, childElement, childJSXElement.children.value);
      parent.appendChild(childElement);
    } else {
      parent.appendChild(doc.createTextNode(child));
    }
  }
}
