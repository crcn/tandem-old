import { mapValues } from "lodash";
import { ComputedDisplayInfo } from "./synthetic";
import { TreeNode, DEFAULT_NAMESPACE, getAttribute } from "../common/state";
import { OperationalTransform, OperationalTransformType, SetAttributeTransform } from "common/utils/tree";

export type SyntheticNativeNodeMap = {
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

  return nativeMap;
};

export const waitForDOMReady = (map: SyntheticNativeNodeMap) => {
  const loadableElements = Object.values(map).filter(element => /img/.test(element.nodeName)) as (HTMLImageElement)[];
  return Promise.all(loadableElements.map(element => new Promise(resolve => {
    element.onload = resolve;
  })));
};

export const computeDisplayInfo = (map: SyntheticNativeNodeMap, document: Document = window.document): ComputedDisplayInfo => {
  const computed: ComputedDisplayInfo = {};

  for (const id in map) {
    const node = map[id];
    if (node.nodeType === 1) {
      computed[id] = {
        style: window.getComputedStyle(node as HTMLElement),
        bounds: (node as HTMLElement).getBoundingClientRect(),
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

export const patchDOM = (transforms: OperationalTransform[], root: HTMLElement) => {
  // TODO
  for (const transform of transforms) {
    const target = getElementFromPath(transform.path, root);
    switch(transform.type) {
      case OperationalTransformType.SET_ATTRIBUTE: {
        const { name,  value, namespace } = transform as SetAttributeTransform;
        if (namespace === DEFAULT_NAMESPACE && name === "style") {
          Object.assign(target.style, normalizeStyle(value));
        }
        break;
      }
    }
  }
}

const normalizeStyle = (value: any) => mapValues(value, (value, key) => {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value;
});

const getElementFromPath = (path: number[], root: HTMLElement) => {
  let current = root;
  for (const part of path) {
    current = current.children[part] as HTMLElement;
  }
  return current;
}