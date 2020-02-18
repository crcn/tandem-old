import { Html5Entities } from "html-entities";
import { stringifyCSSSheet } from "paperclip/lib/stringify-sheet";

const entities = new Html5Entities();

export const createNativeNode = (node, protocol: string | null) => {
  // if (!node || true) {
  //   return document.createTextNode("no node");
  // }
  try {
    switch (node.kind) {
      case "Text":
        return createNativeTextNode(node);
      case "Element":
        return createNativeElement(node, protocol);
      case "StyleElement":
        return createNativeStyle(node, protocol);
      case "Fragment":
        return createNativeFragment(node, protocol);
    }
  } catch (e) {
    return document.createTextNode(String(e.stack));
  }
};

const createNativeTextNode = node => {
  return document.createTextNode(entities.decode(node.value));
};
const createNativeStyle = (element, protocol: string) => {
  // return document.createTextNode(stringifyCSSSheet(element.sheet, protocol));
  const nativeElement = document.createElement("style");
  nativeElement.textContent = stringifyCSSSheet(element.sheet, protocol);
  return nativeElement;
};

const createNativeElement = (element, protocol: string) => {
  const nativeElement = document.createElement(element.tagName);
  for (let { name, value } of element.attributes) {
    if (name === "src" && protocol) {
      value = value.replace(/\w+:/, protocol);
    }

    nativeElement.setAttribute(name, value);
  }
  for (const child of element.children) {
    nativeElement.appendChild(createNativeNode(child, protocol));
  }
  return nativeElement;
};

const createNativeFragment = (fragment, protocol) => {
  const nativeFragment = document.createDocumentFragment();
  for (const child of fragment.children) {
    nativeFragment.appendChild(createNativeNode(child, protocol));
  }
  return nativeFragment;
};
