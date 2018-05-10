import { mapValues } from "lodash";
import { ComputedDisplayInfo } from "./synthetic";
import { TreeNode, DEFAULT_NAMESPACE, getAttribute, getTreeNodeFromPath } from "../common/state";
import { OperationalTransform, OperationalTransformType, SetAttributeTransform, InsertChildTransform, RemoveChildTransform, MoveChildTransform, patchNode } from "../common/utils/tree";

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
  const isText = synthetic.name === "text";
  const nativeElement = document.createElement(isText ? "span" : synthetic.name);
  const attrs = synthetic.attributes[DEFAULT_NAMESPACE] || {};
  for (const name in attrs) {
    const value = attrs[name];
    if (name === "style") {
      Object.assign(nativeElement.style, normalizeStyle(value));
    } else {
      nativeElement.setAttribute(name, value);
    }
  }

  if (isText) {
    nativeElement.appendChild(document.createTextNode(getAttribute(synthetic, "value", DEFAULT_NAMESPACE)));
  } else {
    for (let i = 0, {length} = synthetic.children; i < length; i++) {
      const childSynthetic = synthetic.children[i];
      nativeElement.appendChild(createNativeNode(childSynthetic, document, map));
    }
  }
  return map[synthetic.id] = nativeElement;
};

const removeElementsFromMap = (synthetic: TreeNode, map: SyntheticNativeNodeMap) => {
  map[synthetic.id] = undefined;
  for (let i = 0, {length} = synthetic.children; i < length; i++) {
    removeElementsFromMap(synthetic, map);
  }
}

export const patchDOM = (transforms: OperationalTransform[], synthetic: TreeNode, root: HTMLElement, map: SyntheticNativeNodeMap) => {
  let newMap = map;
  let newSyntheticTree: TreeNode = synthetic;

  for (const transform of transforms) {
    const target = getElementFromPath(transform.path, root);
    const syntheticTarget = getTreeNodeFromPath(transform.path, newSyntheticTree);
    newSyntheticTree = patchNode([transform], newSyntheticTree);
    switch(transform.type) {
      case OperationalTransformType.SET_ATTRIBUTE: {
        const { name,  value, namespace } = transform as SetAttributeTransform;
        if (namespace === DEFAULT_NAMESPACE) {
          if (name === "style") {
            target.setAttribute("style", "");
            Object.assign(target.style, normalizeStyle(value));
          } else if (name === "value" && syntheticTarget.name === "text") {
            target.childNodes[0].nodeValue = value;
          }
        }
        break;
      }
      case OperationalTransformType.INSERT_CHILD: {
        const { child, index } = transform as InsertChildTransform;
        if (!child.namespace || child.namespace == DEFAULT_NAMESPACE) {
          if (newMap === map) {
            newMap = {...map};
          }
          const nativeChild = createNativeNode(child, root.ownerDocument, newMap);
          insertChild(target, nativeChild, index);
        }
        break;
      }
      case OperationalTransformType.REMOVE_CHILD: {
        const { path, index } = transform as RemoveChildTransform;
        target.removeChild(target.childNodes[index]);
        break;
      }
      case OperationalTransformType.MOVE_CHILD: {
        const { path, oldIndex, newIndex } = transform as MoveChildTransform;
        const child = target.childNodes[oldIndex];
        target.removeChild(child);
        insertChild(target, child, newIndex);
        break;
      }
      default: {
        throw new Error(`OT ${transform.type} not supported yet`);
      }
    }
  }
  return newMap;
}

const insertChild = (target: HTMLElement, child: Node, index: number) => {

  if (index < target.childNodes.length) {
    target.insertBefore(child, target.childNodes[index]);
  } else {
    target.appendChild(child);
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