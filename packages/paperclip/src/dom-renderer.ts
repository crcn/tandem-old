import { mapValues, omit } from "lodash";
import {
  SyntheticVisibleNode,
  SyntheticElement,
  SyntheticTextNode,
  SyntheticContentNode,
  SyntheticDocument
} from "./synthetic-dom";
import { ComputedDisplayInfo } from "./edit";
import { getTreeNodeFromPath, EMPTY_OBJECT, memoize } from "tandem-common";
import { MutationType, Mutation, getValue, patch, Set } from "immutable-ot";
import { PCSourceTagNames } from "./dsl";
import {
  SyntheticCSSStyleSheet,
  stringifySyntheticCSSObject
} from "./synthetic-cssom";

const SVG_XMLNS = "http://www.w3.org/2000/svg";

export type SyntheticNativeDOMMap = {
  [identifier: string]: Node;
};

export type SyntheticNativeCSSOMMap = {
  [identifier: string]: CSSRule;
};

export type SyntheticNativeMap = {
  dom: SyntheticNativeDOMMap;
  cssom: SyntheticNativeCSSOMMap;
};

export const renderDOM = (
  native: HTMLElement,
  syntheticContentNode: SyntheticContentNode,
  document: Document = window.document
) => {
  while (native.childNodes.length) {
    native.removeChild(native.childNodes[0]);
  }

  const domMap = {};
  let cssomMap = {};

  if (syntheticContentNode.sheet) {
    const style = createStyle(syntheticContentNode.sheet, document, cssomMap);
    native.appendChild(style);
    cssomMap = createCSSOMMap(
      style.sheet as CSSStyleSheet,
      syntheticContentNode.sheet
    );
  }

  // Not ethat we cannot render directly to the element passed in
  // since we need to assume that its type is immutable (like body)
  // applySyntheticNodeProps(native, synthetic, nativeMap, true);
  native.appendChild(
    createNativeNode(syntheticContentNode, document, domMap, true)
  );

  return { dom: domMap, cssom: cssomMap };
};

export const waitForDOMReady = (map: SyntheticNativeDOMMap) => {
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

const createStyle = (
  sheet: SyntheticCSSStyleSheet,
  document: Document,
  cssomMap
) => {
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = stringifySyntheticCSSObject(sheet);
  return style;
};

export const computeDisplayInfo = (
  map: SyntheticNativeDOMMap
): ComputedDisplayInfo => {
  const computed: ComputedDisplayInfo = {};

  for (const id in map) {
    const node = map[id];
    const rect = (node as HTMLElement).getBoundingClientRect();
    if (node.nodeType === 1) {
      computed[id] = {
        style: window.getComputedStyle(node as Element),
        bounds: {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom
        }
      };
    }
  }

  return computed;
};

const createCSSOMMap = (
  nativeSheet: CSSStyleSheet,
  syntheticSheet: SyntheticCSSStyleSheet
) => {
  const map: SyntheticNativeCSSOMMap = {};

  for (let i = 0, n = syntheticSheet.rules.length; i < n; i++) {
    const rule = syntheticSheet.rules[i];
    map[rule.id] = nativeSheet.cssRules[i];
  }

  return map;
};

const setStyleConstraintsIfRoot = (
  synthetic: SyntheticVisibleNode,
  nativeElement: HTMLElement,
  isContentNode: boolean
) => {
  if (isContentNode) {
    nativeElement.style.position = "fixed";
    if (nativeElement.tagName === "SPAN") {
      nativeElement.style.display = "block";
    }
    nativeElement.style.top = "0px";
    nativeElement.style.left = "0px";
    nativeElement.style.width = "100%";
    nativeElement.style.height = "100%";
    nativeElement.style.minHeight = "unset";
    nativeElement.style.minWidth = "unset";
    nativeElement.style.maxWidth = "unset";
    nativeElement.style.maxHeight = "unset";
    nativeElement.style.boxSizing = "border-box";
  }
};

const setAttribute = (target: HTMLElement, name: string, value: string) => {
  if (name === "style") {
    console.warn(`"style" attribute present in attributes.`);
    return;
  }
  if (name.indexOf(":") !== -1) {
    const [xmlns, key] = name.split(":");
    target.setAttributeNS(xmlns, key, value);
  } else {
    target.setAttribute(name, value);
  }
};

const SVG_STYlE_KEY_MAP = {
  background: "fill"
};

const createNativeNode = (
  synthetic: SyntheticVisibleNode,
  document: Document,
  map: SyntheticNativeDOMMap,
  isContentNode: boolean,
  xmlns?: string
) => {
  const isText = synthetic.name === PCSourceTagNames.TEXT;

  const attrs = (synthetic as SyntheticElement).attributes || EMPTY_OBJECT;
  const tagName = isText
    ? "span"
    : (synthetic as SyntheticElement).name || "div";
  if (attrs.xmlns) {
    xmlns = attrs.xmlns;
  }

  const nativeElement = (xmlns
    ? document.createElementNS(xmlns, tagName)
    : document.createElement(tagName)) as HTMLElement;

  applySyntheticNodeProps(
    nativeElement,
    synthetic,
    map,
    isContentNode,
    nativeElement.namespaceURI
  );

  return (map[synthetic.id] = nativeElement);
};

const applySyntheticNodeProps = (
  nativeElement: HTMLElement,
  synthetic: SyntheticVisibleNode,
  map: SyntheticNativeDOMMap,
  isContentNode: boolean,
  xmlns?: string
) => {
  const isText = synthetic.name === PCSourceTagNames.TEXT;
  const attrs = (synthetic as SyntheticElement).attributes || EMPTY_OBJECT;

  for (const name in attrs) {
    setAttribute(nativeElement, name, attrs[name]);
  }

  nativeElement.setAttribute("class", synthetic.className);

  setStyleConstraintsIfRoot(synthetic, nativeElement, isContentNode);
  if (isText) {
    nativeElement.appendChild(
      document.createTextNode((synthetic as SyntheticTextNode).value)
    );
  } else {
    for (let i = 0, { length } = synthetic.children; i < length; i++) {
      const childSynthetic = synthetic.children[i] as SyntheticVisibleNode;
      nativeElement.appendChild(
        createNativeNode(childSynthetic, document, map, false, xmlns)
      );
    }
  }

  return (map[synthetic.id] = nativeElement);
};

const removeElementsFromMap = (
  synthetic: SyntheticVisibleNode,
  map: SyntheticNativeDOMMap
) => {
  map[synthetic.id] = undefined;
  for (let i = 0, { length } = synthetic.children; i < length; i++) {
    removeElementsFromMap(synthetic, map);
  }
};

export const patchDOM = (
  transforms: Mutation[],
  synthetic: SyntheticVisibleNode,
  root: HTMLElement,
  map: SyntheticNativeDOMMap
) => {
  let newMap = map;
  let newSyntheticTree: SyntheticVisibleNode = synthetic;

  for (const transform of transforms) {
    const oldSyntheticTarget = getValue(newSyntheticTree, transform.path);
    const isContentNode = transform.path.length === 0;
    const target = newMap[oldSyntheticTarget.id] as HTMLElement;
    newSyntheticTree = patch(newSyntheticTree, [transform]);
    const syntheticTarget = getValue(newSyntheticTree, transform.path);
    switch (transform.type) {
      case MutationType.SET: {
        const { propertyName: name, value } = transform;

        if (name === "style") {
          resetElementStyle(target, syntheticTarget);
          setStyleConstraintsIfRoot(syntheticTarget, target, isContentNode);
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
          const xmlnsTransform = transforms.find(
            transform =>
              transform.type === MutationType.SET &&
              transform.propertyName === "attributes" &&
              transform.value.xmlns
          ) as Set;
          const newTarget = createNativeNode(
            getValue(newSyntheticTree, transform.path),
            root.ownerDocument,
            newMap,
            isContentNode,
            xmlnsTransform && xmlnsTransform.value.xmlns
          );

          parent.insertBefore(newTarget, target);
          parent.removeChild(target);
        } else if (syntheticTarget.name === "text" && name === "value") {
          target.childNodes[0].nodeValue = value;
        }

        break;
      }
      case MutationType.INSERT: {
        const { value: child, index } = transform;

        if (newMap === map) {
          newMap = { ...map };
        }
        const nativeChild = createNativeNode(
          child as SyntheticVisibleNode,
          root.ownerDocument,
          newMap,
          false,
          target.namespaceURI
        );
        removeClickableStyle(target, syntheticTarget);
        insertChild(target, nativeChild, index);

        break;
      }
      case MutationType.REMOVE: {
        const { index } = transform;
        target.removeChild(target.childNodes[index]);
        break;
      }
      case MutationType.REPLACE: {
        const { value: child } = transform;

        const nativeChild = createNativeNode(
          child as SyntheticVisibleNode,
          root.ownerDocument,
          newMap,
          false,
          target.namespaceURI
        );

        const parent = target.parentNode;
        parent.insertBefore(nativeChild, target);
        target.remove();
        break;
      }
      case MutationType.MOVE: {
        const { oldIndex, newIndex } = transform;
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

const EMPTY_ELEMENT_STYLE_NAMES = [
  "box-sizing",
  "display",
  "background",
  "background-image",
  "font-family",
  "font-weight",
  "white-space",
  "position",
  "text-decoration",
  "letter-spacing",
  "color",
  "border-radius",
  "box-sizing",
  "box-shadow",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-left",
  "border-right",
  "border-top",
  "border-bottom",
  "line-height",
  "font-size",
  "text-alignment"
];

const stripEmptyElement = memoize(style =>
  omit(style, EMPTY_ELEMENT_STYLE_NAMES)
);

const resetElementStyle = (
  target: HTMLElement,
  synthetic: SyntheticVisibleNode
) => {
  if (target.namespaceURI === SVG_XMLNS) {
    target.setAttribute("style", "");
  } else {
    removeClickableStyle(target, synthetic);
    target.setAttribute("style", "");
    if (target.tagName === "BODY") {
      target.style.margin = "0px";
    }
  }
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
      /width|height|left|top|right|bottom|margin|padding|font-size|radius/.test(
        key
      ) &&
      !isNaN(Number(value))
    ) {
      return `${value}px`;
    }

    return value;
  });
