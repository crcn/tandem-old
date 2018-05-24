import { mapValues } from "lodash";
import { ComputedDisplayInfo, EditorAttributeNames, EDITOR_NAMESPACE } from "./synthetic";
import { TreeNode, DEFAULT_NAMESPACE, getAttribute, getTreeNodeFromPath, roundBounds } from "tandem-common/lib/state";
import { OperationalTransform, OperationalTransformType, SetAttributeTransform, InsertChildTransform, RemoveChildTransform, MoveChildTransform, patchNode } from "tandem-common/lib/utils/tree";
import { PCSourceAttributeNames } from ".";

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

const setStyleConstraintsIfRoot = (synthetic: TreeNode, nativeElement: HTMLElement) => {
  const isRoot = getAttribute(synthetic, EditorAttributeNames.IS_COMPONENT_ROOT, EDITOR_NAMESPACE);
  if (isRoot) {
    nativeElement.style.width = "100vw";
    nativeElement.style.height = "100vh";
  }
}

const createNativeNode = (synthetic: TreeNode, document: Document, map: SyntheticNativeNodeMap) => {
  const isText = synthetic.name === "text";
  const nativeElement = document.createElement(isText ? "span" : getAttribute(synthetic, PCSourceAttributeNames.NATIVE_TYPE) || "div");

  const attrs = synthetic.attributes[DEFAULT_NAMESPACE] || {};
  for (const name in attrs) {
    const value = attrs[name];
    if (name === "style") {
      Object.assign(nativeElement.style, normalizeStyle(value));
    } else {
      nativeElement.setAttribute(name, value);
    }
  }
  setStyleConstraintsIfRoot(synthetic, nativeElement);

  if (isText) {
    nativeElement.appendChild(document.createTextNode(getAttribute(synthetic, "value", DEFAULT_NAMESPACE)));
  } else {
    for (let i = 0, {length} = synthetic.children; i < length; i++) {
      const childSynthetic = synthetic.children[i];
      nativeElement.appendChild(createNativeNode(childSynthetic, document, map));
    }
  }

  makeElementClickable(nativeElement, synthetic);
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
    newSyntheticTree = patchNode([transform], newSyntheticTree);
    const syntheticTarget = getTreeNodeFromPath(transform.path, newSyntheticTree);
    switch(transform.type) {
      case OperationalTransformType.SET_ATTRIBUTE: {
        const { name,  value, namespace } = transform as SetAttributeTransform;
        if (namespace === DEFAULT_NAMESPACE) {
          if (name === "style") {
            resetElementStyle(target, syntheticTarget);
            setStyleConstraintsIfRoot(syntheticTarget, target);
            makeElementClickable(target, syntheticTarget);
          } else if (name === "value" && syntheticTarget.name === "text") {
            target.childNodes[0].nodeValue = value;
          } else if (name === PCSourceAttributeNames.NATIVE_TYPE) {
            const parent = target.parentNode;
            if (newMap === map) {
              newMap = {...map};
            }
            const newTarget = createNativeNode(getTreeNodeFromPath(transform.path, newSyntheticTree), root.ownerDocument, newMap);
            parent.insertBefore(newTarget, target);
            parent.removeChild(target);
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
          removeClickableStyle(target, syntheticTarget);
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

const makeElementClickable = (target: HTMLElement, synthetic: TreeNode) => {
  const isRoot = getAttribute(synthetic, EditorAttributeNames.IS_COMPONENT_ROOT, EDITOR_NAMESPACE);
  if (synthetic.name !== "text" && !isRoot) {
    const style = getAttribute(synthetic, "style") || {};
    if (target.childNodes.length === 0 && Object.keys(style).length === 0) {
      target.dataset.empty = "1";
      Object.assign(target.style, {
        width: `100%`,
        height: `50px`,
        minWidth: `50px`,
        border: `2px dashed rgba(0,0,0,0.05)`,
        boxSizing: `border-box`,
        borderRadius: `2px`,
        position: `relative`
      });

      const placeholder = document.createElement("div");
      Object.assign(placeholder.style, {
        left: `50%`,
        top: `50%`,
        position: `absolute`,
        transform: `translate(-50%, -50%)`,
        color: `rgba(0,0,0,0.05)`,
        fontFamily: "Helvetica"
      });

      placeholder.textContent = `Empty element`;

      target.appendChild(placeholder);
    }
  }
};

const resetElementStyle = (target: HTMLElement, synthetic: TreeNode) => {
  removeClickableStyle(target, synthetic);
  const style = getAttribute(synthetic, "style") || {};
  target.setAttribute("style", "");
  Object.assign(target.style, normalizeStyle(style));
};

const removeClickableStyle = (target: HTMLElement,  synthetic: TreeNode) => {
  if (target.dataset.empty === "1") {
    target.dataset.empty = null;
    target.innerHTML = ``;
    resetElementStyle(target, synthetic);
  }
};

const insertChild = (target: Node, child: Node, index: number) => {

  if (index < target.childNodes.length) {
    target.insertBefore(child, target.childNodes[index]);
  } else {
    target.appendChild(child);
  }
}

const normalizeStyle = (value: any) => mapValues(value, (value, key) => {
  if (typeof value === "number" && /width|height|left|top|right|bottom/.test(key)) {
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