import { stringifyCSSSheet } from "./stringify-sheet";

export const createNativeNode = node => {
  // return document.createTextNode(JSON.stringify(node));
  switch (node.type) {
    case "Text":
      return document.createTextNode(node.value);
    case "Element":
      return createNativeElement(node);
    case "StyleElement":
      return createNativeStyle(node);
    case "Fragment":
      return createNativeFragment(node);
  }
};

export const createNativeStyle = element => {
  // return document.createTextNode(JSON.stringify(element));
  const nativeElement = document.createElement("style");
  nativeElement.textContent = stringifyCSSSheet(element.sheet);
  return nativeElement;
};

export const createNativeElement = element => {
  const nativeElement = document.createElement(element.tag_name);
  for (const { name, value } of element.attributes) {
    nativeElement.setAttribute(name, value);
  }
  for (const child of element.children) {
    nativeElement.appendChild(createNativeNode(child));
  }
  return nativeElement;
};

export const createNativeFragment = fragment => {
  const nativeFragment = document.createDocumentFragment();
  for (const child of fragment.children) {
    nativeFragment.appendChild(createNativeNode(child));
  }
  return nativeFragment;
};
