import { mapValues } from "lodash";
import {
  ComputedDisplayInfo,
  SyntheticNode,
  SyntheticElement,
  isSyntheticNodeRoot
} from "./synthetic";
import {
  TreeNode,
  getTreeNodeFromPath,
  roundBounds,
  OperationalTransform,
  OperationalTransformType,
  SetAttributeTransform,
  InsertChildTransform,
  RemoveChildTransform,
  MoveChildTransform,
  patchNode
} from "tandem-common";
import { PCSourceTagNames, PCTextNode } from "./dsl";
import { DependencyGraph } from "graph";

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

  const attrs = synthetic.style || {};
  for (const name in attrs) {
    const value = attrs[name];
    if (name === "style") {
      Object.assign(nativeElement.style, normalizeStyle(value));
    } else {
      nativeElement.setAttribute(name, value);
    }
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
  transforms: OperationalTransform[],
  synthetic: SyntheticNode,
  graph: DependencyGraph,
  root: HTMLElement,
  map: SyntheticNativeNodeMap
) => {
  let newMap = map;
  let newSyntheticTree: SyntheticNode = synthetic;

  for (const transform of transforms) {
    const target = getElementFromPath(transform.path, root);
    newSyntheticTree = patchNode([transform], newSyntheticTree);
    const syntheticTarget = getTreeNodeFromPath(
      transform.path,
      newSyntheticTree
    );
    switch (transform.type) {
      case OperationalTransformType.SET_ATTRIBUTE: {
        const { name, value, namespace } = transform as SetAttributeTransform;

        // if (name === "style") {
        //   resetElementStyle(target, syntheticTarget);
        //   setStyleConstraintsIfRoot(syntheticTarget, graph, target);
        //   makeElementClickable(target, syntheticTarget);
        // } else if (
        //   name === "value" &&
        //   syntheticTarget.name === PCSourceTagNames.TEXT
        // ) {
        //   target.childNodes[0].nodeValue = value;
        // } else if (name === PCElementAttributeNames.NATIVE_TYPE) {
        //   const parent = target.parentNode;
        //   if (newMap === map) {
        //     newMap = { ...map };
        //   }
        //   const newTarget = createNativeNode(
        //     getTreeNodeFromPath(transform.path, newSyntheticTree),
        //     root.ownerDocument,
        //     newMap
        //   );
        //   parent.insertBefore(newTarget, target);
        //   parent.removeChild(target);
        // }

        break;
      }
      case OperationalTransformType.INSERT_CHILD: {
        const { child, index } = transform as InsertChildTransform;

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
