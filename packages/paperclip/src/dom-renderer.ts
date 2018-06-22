import { mapValues, omit } from "lodash";
import {
  SyntheticVisibleNode,
  SyntheticElement,
  SyntheticTextNode,
  SYNTHETIC_DOCUMENT_NODE_NAME
} from "./synthetic";
import { ComputedDisplayInfo } from "./edit";
import {
  getTreeNodeFromPath,
  roundBounds,
  EMPTY_OBJECT,
  memoize
} from "tandem-common";
import {
  TreeNodeOperationalTransformType,
  MoveChildNodeOperationalTransform,
  TreeNodeOperationalTransform,
  patchTreeNode,
  SetNodePropertyOperationalTransform,
  InsertChildNodeOperationalTransform,
  RemoveChildNodeOperationalTransform
} from "./ot";
import { PCSourceTagNames, PCTextNode } from "./dsl";

const SVG_XMLNS = "http://www.w3.org/2000/svg";

export type SyntheticNativeNodeMap = {
  [identifier: string]: Node;
};

export const renderDOM = (
  native: HTMLElement,
  synthetic: SyntheticVisibleNode,
  document: Document = window.document
) => {
  let parentNative;
  let parentSynthetic;
  let currentSynthetic = synthetic;

  while (native.childNodes.length) {
    native.removeChild(native.childNodes[0]);
  }

  const nativeMap = {};
  native.appendChild(createNativeNode(synthetic, document, nativeMap));

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
  synthetic: SyntheticVisibleNode,
  nativeElement: HTMLElement
) => {
  const isContentNode = synthetic.isContentNode;
  if (isContentNode) {
    nativeElement.style.position = "fixed";
    if (nativeElement.tagName === "SPAN") {
      nativeElement.style.display = "block";
    }
    nativeElement.style.top = "0px";
    nativeElement.style.left = "0px";
    nativeElement.style.width = "100vw";
    nativeElement.style.height = "100vh";
    nativeElement.style.minHeight = "unset";
    nativeElement.style.minWidth = "unset";
    nativeElement.style.maxWidth = "unset";
    nativeElement.style.maxHeight = "unset";
    nativeElement.style.boxSizing = "border-box";
  }
};

const setAttribute = (target: HTMLElement, name: string, value: string) => {
  if (name.indexOf(":") !== -1) {
    const [xmlns, key] = name.split(":");
    target.setAttributeNS(xmlns, key, value);
  } else {
    target.setAttribute(name, value);
  }
};

const SVG_STYlE_KEY_MAP = {
  "background": "fill"
}

const setStyle = (target: HTMLElement, style: any) => {
  const normalizedStyle = normalizeStyle(style);
  if (target.namespaceURI === SVG_XMLNS) {
    for (const key in style) {
      target.setAttribute(SVG_STYlE_KEY_MAP[key] || key, style[key]);
    }
  } else {
    Object.assign(target.style, normalizedStyle);
  }
};

const createNativeNode = (
  synthetic: SyntheticVisibleNode,
  document: Document,
  map: SyntheticNativeNodeMap,
  xmlns?: string
) => {
  const isText = synthetic.name === PCSourceTagNames.TEXT;

  const attrs = (synthetic as SyntheticElement).attributes || EMPTY_OBJECT;
  const tagName = isText ? "span" : (synthetic as SyntheticElement).name || "div";
  if (attrs.xmlns) {
    xmlns = attrs.xmlns;
  }

  const nativeElement = (xmlns ? document.createElementNS(xmlns, tagName) : document.createElement(
    tagName
  )) as HTMLElement;

  for (const name in attrs) {
    setAttribute(nativeElement, name, attrs[name]);
  }
  if (synthetic.style) {
    setStyle(nativeElement, synthetic.style);
  }
  setStyleConstraintsIfRoot(synthetic, nativeElement);
  if (isText) {
    nativeElement.appendChild(
      document.createTextNode((synthetic as SyntheticTextNode).value)
    );
  } else {
    for (let i = 0, { length } = synthetic.children; i < length; i++) {
      const childSynthetic = synthetic.children[i] as SyntheticVisibleNode;
      nativeElement.appendChild(
        createNativeNode(childSynthetic, document, map, xmlns)
      );
    }
  }

  makeElementClickable(nativeElement, synthetic);
  return (map[synthetic.id] = nativeElement);
};

const removeElementsFromMap = (
  synthetic: SyntheticVisibleNode,
  map: SyntheticNativeNodeMap
) => {
  map[synthetic.id] = undefined;
  for (let i = 0, { length } = synthetic.children; i < length; i++) {
    removeElementsFromMap(synthetic, map);
  }
};

export const patchDOM = (
  transforms: TreeNodeOperationalTransform[],
  synthetic: SyntheticVisibleNode,
  root: HTMLElement,
  map: SyntheticNativeNodeMap
) => {
  let newMap = map;
  let newSyntheticTree: SyntheticVisibleNode = synthetic;

  for (const transform of transforms) {
    const oldSyntheticTarget = getTreeNodeFromPath(
      transform.nodePath,
      newSyntheticTree
    );
    const target = map[oldSyntheticTarget.id] as HTMLElement;
    newSyntheticTree = patchTreeNode([transform], newSyntheticTree);
    const syntheticTarget = getTreeNodeFromPath(
      transform.nodePath,
      newSyntheticTree
    );
    switch (transform.type) {
      case TreeNodeOperationalTransformType.SET_PROPERTY: {
        const {
          name,
          value
        } = transform as SetNodePropertyOperationalTransform;

        if (name === "style") {
          resetElementStyle(target, syntheticTarget);
          setStyleConstraintsIfRoot(syntheticTarget, target);
          makeElementClickable(target, syntheticTarget);
        } else if (name === "attributes") {
          for (const key in value) {
            if (!value[key]) {
              target.removeAttribute(key);
            } else {
              setAttribute(target, key, value[key]);
            }
          }
        } else if (name === "name") {
          const parent = target.parentNode;
          if (newMap === map) {
            newMap = { ...map };
          }
          const newTarget = createNativeNode(
            getTreeNodeFromPath(transform.nodePath, newSyntheticTree),
            root.ownerDocument,
            newMap
          );
          parent.insertBefore(newTarget, target);
          parent.removeChild(target);
        } else if (syntheticTarget.name === "text" && name === "value") {
          target.childNodes[0].nodeValue = value;
        }

        break;
      }
      case TreeNodeOperationalTransformType.INSERT_CHILD: {
        const {
          child,
          index
        } = transform as InsertChildNodeOperationalTransform;

        if (newMap === map) {
          newMap = { ...map };
        }
        const nativeChild = createNativeNode(
          child as SyntheticVisibleNode,
          root.ownerDocument,
          newMap
        );
        removeClickableStyle(target, syntheticTarget);
        insertChild(target, nativeChild, index);

        break;
      }
      case TreeNodeOperationalTransformType.REMOVE_CHILD: {
        const { index } = transform as RemoveChildNodeOperationalTransform;
        target.removeChild(target.childNodes[index]);
        if (target.childNodes.length === 0) {
          makeElementClickable(target, syntheticTarget);
        }
        break;
      }
      case TreeNodeOperationalTransformType.MOVE_CHILD: {
        const {
          oldIndex,
          newIndex
        } = transform as MoveChildNodeOperationalTransform;
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

const stripEmptyElement = memoize(style => omit(style, ["box-sizing"]));

const makeElementClickable = (
  target: HTMLElement,
  synthetic: SyntheticVisibleNode
) => {
  const isContentNode = synthetic.isContentNode;

  if (synthetic.name === "div" && !isContentNode) {
    const style = synthetic.style || EMPTY_OBJECT;
    if (
      target.childNodes.length === 0 &&
      Object.keys(stripEmptyElement(style)).length === 0
    ) {
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

const resetElementStyle = (
  target: HTMLElement,
  synthetic: SyntheticVisibleNode
) => {
  if (target.namespaceURI === SVG_XMLNS) {
    // TODO - reset SVG info
  } else {
    removeClickableStyle(target, synthetic);
    target.setAttribute("style", "");
  }
  setStyle(target, synthetic.style || EMPTY_OBJECT);
};

const removeClickableStyle = (
  target: HTMLElement,
  synthetic: SyntheticVisibleNode
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
