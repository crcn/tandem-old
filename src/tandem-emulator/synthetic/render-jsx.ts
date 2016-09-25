import { SyntheticWrapperFunction, ISynthetic, SyntheticJSXElement, SyntheticJSXAttribute, SyntheticKind } from "./core";
import { SyntheticDocument, SyntheticElement, SyntheticTextNode } from "./dom";

export const renderSyntheticJSX = new SyntheticWrapperFunction((jsx: SyntheticJSXElement, element: SyntheticElement) => {

  // no diffing here -- just render out the DOM elements since they'yre also synthetic -- they'll
  // be patched later on.
  while (element.childNodes.value.length) {
    element.removeChild(element.childNodes[0]);
  }

  _render(element, [jsx]);
});

function _render(parent: SyntheticElement, children: Array<any>) {
  for (const child of children) {
    if (child.kind === SyntheticKind.JSXElement) {
      const childJSXElement = <SyntheticJSXElement>child;
      const childElement = new SyntheticElement(childJSXElement.name);
      for (const attribute of childJSXElement.attributes.value) {
        childElement.setAttribute(attribute.name, attribute.value);
      }
      _render(childElement, childJSXElement.children.value);
      parent.appendChild(childElement);
    } else {
      parent.appendChild(new SyntheticTextNode(child));
    }
  }
}
