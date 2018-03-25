import { EMPTY_OBJECT } from "../common/utils";
import { ComputedDisplayInfo } from "./synthetic";
import { TreeNode, DEFAULT_NAMESPACE, getAttribute } from "../common/state";

type SyntheticNativeNodeMap = {
  [identifier: string]: Node
}

export const renderDOM = (native: HTMLElement, synthetic: TreeNode, document: Document = window.document) => {
  let parentNative;
  let parentSynthetic;
  let currentSynthetic = synthetic;

  while(native.childNodes.length) {
    native.removeChild(native.childNodes[0]);
  }

  const nativeMap = {};
  native.appendChild(createNativeNode(synthetic, document, nativeMap));
  return computeDisplayInfo(nativeMap, document);
};

const computeDisplayInfo = (map: SyntheticNativeNodeMap, document: Document): ComputedDisplayInfo => {
  const computed: ComputedDisplayInfo = {};

  for (const id in map) {
    const node = map[id];
    if (node.nodeType === 1) {
      computed[id] = {
        style: window.getComputedStyle(node as HTMLElement),
        rect: (node as HTMLElement).getBoundingClientRect(),
      };
    }
  }

  return computed;
};

const createNativeNode = (synthetic: TreeNode, document: Document, map: SyntheticNativeNodeMap) => {
  if (synthetic.name === "text") {
    return map[synthetic.id] = document.createTextNode(getAttribute(synthetic, "value"));
  } else {
    const nativeElement = document.createElement(synthetic.name);
    const attrs = synthetic.attributes[DEFAULT_NAMESPACE] || {};
    for (const name in attrs) {
      const value = attrs[name];
      if (name === "style") {
        Object.assign(nativeElement.style, value);
      } else {
        nativeElement.setAttribute(name, value);
      }
    }
    for (let i = 0, {length} = synthetic.children; i < length; i++) {
      const childSynthetic = synthetic.children[i];
      nativeElement.appendChild(createNativeNode(childSynthetic, document, map));
    }
    return map[synthetic.id] = nativeElement;
  }
};

export const patchDOM = () => {
  // TODO
}