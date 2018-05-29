import { mapValues } from "lodash";
import {
  ComputedDisplayInfo,
  SyntheticNode,
  SyntheticElement,
  isSyntheticNodeRoot
} from "./synthetic";
import { getTreeNodeFromPath, roundBounds, EMPTY_OBJECT } from "tandem-common";
import {
  SyntheticOperationalTransformType,
  SyntheticMoveChildOperationalTransform,
  SyntheticOperationalTransform,
  patchSyntheticNode,
  SyntheticSetPropertyOperationalTransform,
  SyntheticInsertChildOperationalTransform,
  SyntheticRemoveChildOperationalTransform
} from "./ot";
import { PCSourceTagNames, PCTextNode } from "./dsl";
import { DependencyGraph } from "./graph";

export type SyntheticNativeNodeMap = {
  [identifier: string]: Node;
};

export const renderDOM = (
  native: HTMLElement,
  synthetic: SyntheticNode,
  graph: DependencyGraph,
  document: Document = window.document
) => {
  let parentNative;
  let parentSynthetic;
  let currentSynthetic = synthetic;

  while (native.childNodes.length) {
    native.removeChild(native.childNodes[0]);
  }

  const nativeMap = {};
  native.appendChild(createNativeNode(synthetic, graph, document, nativeMap));

  return nativeMap;
};

export const waitForDOMReady = (map: SyntheticNativeNodeMap) => {
  const loadableElements = Object.values(map).filter(element =>
    /img/.test(element.nodeName)
  ) as (HTMLImageElement)[];
  return Promise.all(
    loadableElements.map(
      element =>
        new Promise(resolve => {
          element.onload = resolve;
        })
    )
  );
};

export const computeDisplayInfo = (
  map: SyntheticNativeNodeMap,
  document: Document = window.document
): ComputedDisplayInfo => {
  const computed: ComputedDisplayInfo = {};

  for (const id in map) {
    const node = map[id];
    if (node.nodeType === 1) {
      computed[id] = {
        style: window.getComputedStyle(node as HTMLElement),
        bounds: (node as HTMLElement).getBoundingClientRect()
      };
    }
  }

  return computed;
};

const setStyleConstraintsIfRoot = (
  synthetic: SyntheticNode,
  graph: DependencyGraph,
  nativeElement: HTMLElement
) => {
  const isRoot = isSyntheticNodeRoot(synthetic, graph);
  if (isRoot) {
    nativeElement.style.width = "100vw";
    nativeElement.style.height = "100vh";
  }
};

const createNativeNode = (
  synthetic: SyntheticNode,
  graph: DependencyGraph,
  document: Document,
  map: SyntheticNativeNodeMap
) => {
  const isText = synthetic.name === PCSourceTagNames.TEXT;
  const nativeElement = document.createElement(
    isText ? "span" : (synthetic as SyntheticElement).name || "div"
  );

  const attrs = (synthetic as SyntheticElement).attributes || EMPTY_OBJECT;
  for (const name in attrs) {
    const value = attrs[name];
    nativeElement.setAttribute(name, value);
  }
  if (synthetic.style) {
    Object.assign(nativeElement.style, normalizeStyle(synthetic.style));
  }
  setStyleConstraintsIfRoot(synthetic, graph, nativeElement);
  if (isText) {
    nativeElement.appendChild(
      document.createTextNode((synthetic as PCTextNode).value)
    );
  } else {
    for (let i = 0, { length } = synthetic.children; i < length; i++) {
      const childSynthetic = synthetic.children[i] as SyntheticNode;
      nativeElement.appendChild(
        createNativeNode(childSynthetic, graph, document, map)
      );
    }
  }

  makeElementClickable(nativeElement, synthetic, graph);
  return (map[synthetic.id] = nativeElement);
};

const removeElementsFromMap = (
  synthetic: SyntheticNode,
  map: SyntheticNativeNodeMap
) => {
  map[synthetic.id] = undefined;
  for (let i = 0, { length } = synthetic.children; i < length; i++) {
    removeElementsFromMap(synthetic, map);
  }
};

export const patchDOM = (
  transforms: SyntheticOperationalTransform[],
  synthetic: SyntheticNode,
  graph: DependencyGraph,
  root: HTMLElement,
  map: SyntheticNativeNodeMap
) => {
  let newMap = map;
  let newSyntheticTree: SyntheticNode = synthetic;

  for (const transform of transforms) {
    const target = getElementFromPath(transform.nodePath, root);
    newSyntheticTree = patchSyntheticNode([transform], newSyntheticTree);
    const syntheticTarget = getTreeNodeFromPath(
      transform.nodePath,
      newSyntheticTree
    );
    switch (transform.type) {
      case SyntheticOperationalTransformType.SET_PROPERTY: {
        const {
          name,
          value
        } = transform as SyntheticSetPropertyOperationalTransform;

        if (name === "style") {
          resetElementStyle(target, syntheticTarget);
          setStyleConstraintsIfRoot(syntheticTarget, graph, target);
          makeElementClickable(target, syntheticTarget, graph);
        } else if (name === "attributes") {
          for (const key in value) {
            syntheticTarget.setAttribute(key, value[key]);
          }
        } else if (name === "is") {
          const parent = target.parentNode;
          if (newMap === map) {
            newMap = { ...map };
          }
          const newTarget = createNativeNode(
            getTreeNodeFromPath(transform.nodePath, newSyntheticTree),
            graph,
            root.ownerDocument,
            newMap
          );
          parent.insertBefore(newTarget, target);
          parent.removeChild(target);
        } else if (name === "text") {
          target.childNodes[0].nodeValue = value;
        }

        break;
      }
      case SyntheticOperationalTransformType.INSERT_CHILD: {
        const {
          child,
          index
        } = transform as SyntheticInsertChildOperationalTransform;

        if (newMap === map) {
          newMap = { ...map };
        }
        const nativeChild = createNativeNode(
          child as SyntheticNode,
          graph,
          root.ownerDocument,
          newMap
        );
        removeClickableStyle(target, syntheticTarget);
        insertChild(target, nativeChild, index);

        break;
      }
      case SyntheticOperationalTransformType.REMOVE_CHILD: {
        const { index } = transform as SyntheticRemoveChildOperationalTransform;
        target.removeChild(target.childNodes[index]);
        break;
      }
      case SyntheticOperationalTransformType.MOVE_CHILD: {
        const {
          oldIndex,
          newIndex
        } = transform as SyntheticMoveChildOperationalTransform;
        const child = target.childNodes[oldIndex];
        target.removeChild(child);
        insertChild(target, child, newIndex);
        break;
      }
      default: {
        throw new Error(`OT not supported yet`);
      }
    }
  }
  return newMap;
};

const makeElementClickable = (
  target: HTMLElement,
  synthetic: SyntheticNode,
  graph: DependencyGraph
) => {
  const isRoot = isSyntheticNodeRoot(synthetic, graph);

  if (synthetic.name !== "text" && !isRoot) {
    const style = synthetic.style || {};
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

const resetElementStyle = (target: HTMLElement, synthetic: SyntheticNode) => {
  removeClickableStyle(target, synthetic);
  const style = synthetic.style || {};
  target.setAttribute("style", "");
  Object.assign(target.style, normalizeStyle(style));
};

const removeClickableStyle = (
  target: HTMLElement,
  synthetic: SyntheticNode
) => {
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
};

const normalizeStyle = (value: any) =>
  mapValues(value, (value, key) => {
    if (
      typeof value === "number" &&
      /width|height|left|top|right|bottom/.test(key)
    ) {
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
};
