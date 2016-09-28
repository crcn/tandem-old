import { SyntheticDocument, SyntheticElement, SyntheticTextNode } from "./dom";
import {
  ISynthetic,
  SymbolTable,
  SyntheticKind,
  SyntheticArray,
  SyntheticJSXElement,
  SyntheticJSXAttribute,
  SyntheticWrapperFunction,
} from "./core";

export const renderSyntheticJSX = new SyntheticWrapperFunction(function (jsx: SyntheticJSXElement, element: SyntheticElement) {

  // no diffing here -- just render out the DOM elements since they'yre also synthetic -- they'll
  // be patched later on.
  while (element.childNodes.length.toNative()) {
    element.removeChild(element.childNodes[0]);
  }

  _render(this, element, new SyntheticArray(jsx));
});

function _render(context: SymbolTable, parent: SyntheticElement, children: SyntheticArray<any>) {
  const doc = context.get<SyntheticDocument>("document");

  for (const child of children) {
    if (child.kind === SyntheticKind.JSXElement) {
      const childJSXElement = <SyntheticJSXElement>child;
      const childElement = doc.createElement(childJSXElement.name);
      for (const attribute of childJSXElement.attributes) {
        childElement.setAttribute(attribute.name, attribute.value);
      }
      _render(context, childElement, childJSXElement.children);
      parent.appendChild(childElement);
    } else if (child.kind === SyntheticKind.Array) {
      _render(context, parent, child as SyntheticArray<any>);
    } else {
      parent.appendChild(doc.createTextNode(child));
    }
  }
}
