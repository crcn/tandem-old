import { mapValues, omit } from "lodash";
import {
  SyntheticVisibleNode,
  SyntheticElement,
  SyntheticTextNode,
  SyntheticContentNode,
  SyntheticDocument
} from "./synthetic-dom";
import { ComputedDisplayInfo } from "./edit";
import {
  EMPTY_OBJECT,
  memoize,
  keyValuePairToHash,
  getParentTreeNode
} from "tandem-common";
import { MutationType, Mutation, getValue, patch, Set } from "immutable-ot";
import { PCSourceTagNames } from "./dsl";
import {
  SyntheticCSSStyleSheet,
  stringifySyntheticCSSObject,
  SyntheticCSSStyleRule
} from "./synthetic-cssom";
import { patchTreeNode } from "./ot";

const SVG_XMLNS = "http://www.w3.org/2000/svg";

export type SyntheticNativeDOMMap = {
  [identifier: string]: Node;
};

export type SyntheticNativeCSSOMMap = {
  [identifier: string]: CSSRule | CSSStyleSheet;
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
  const map: SyntheticNativeCSSOMMap = {
    [syntheticSheet.id]: nativeSheet
  };

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

const isStyleSheetMutation = (mutation: Mutation) => {
  return mutation.path[0] === "sheet";
};

const isStyleMutation = (mutation: Mutation) => {
  return mutation.path.indexOf("style") !== -1;
};

const patchStyleSheet = (
  contentNode: SyntheticContentNode,
  mutation: Mutation,
  map: SyntheticNativeCSSOMMap
): [SyntheticContentNode, SyntheticNativeCSSOMMap] => {
  let newContentNode = patchTreeNode(contentNode, [mutation]);
  console.log(mutation);

  if (isStyleMutation(mutation)) {
    const oldTargetStyleRule = getValue(
      contentNode,
      mutation.path.slice(0, mutation.path.lastIndexOf("style"))
    ) as SyntheticCSSStyleRule;
    const newTargetStyleRule = getValue(
      newContentNode,
      mutation.path.slice(0, mutation.path.lastIndexOf("style"))
    ) as SyntheticCSSStyleRule;

    const nativeRule = map[newTargetStyleRule.id] as CSSStyleRule;
    const newStyle = keyValuePairToHash(newTargetStyleRule.style);
    const oldStyle = keyValuePairToHash(oldTargetStyleRule.style);
    console.log(newTargetStyleRule);

    nativeRule.selectorText = newTargetStyleRule.selectorText;
    for (const key in newStyle) {
      if (newStyle[key] !== oldStyle[key]) {
        nativeRule.style[key] = newStyle[key];
      }
    }

    for (const key in oldStyle) {
      if (newStyle[key] == null) {
        nativeRule.style[key] = "";
      }
    }
  } else {
    const newTarget = newContentNode.sheet;
    const targetRule = map[newTarget.id] as CSSRule;

    switch (mutation.type) {
      case MutationType.INSERT: {
        const styleSheet = (targetRule as any) as CSSStyleSheet;
        styleSheet.insertRule(
          stringifySyntheticCSSObject(mutation.value),
          mutation.index
        );

        if (map[mutation.value.id]) {
          console.log("ERROR IT IS", mutation.value.id, map[mutation.value.id]);
        }

        map = {
          ...map,
          [mutation.value.id]: styleSheet.cssRules[mutation.index]
        };
        break;
      }
      case MutationType.SET: {
        const { propertyName, value } = mutation;
        if (propertyName === "selectorText") {
          const styleRule = (targetRule as any) as CSSStyleRule;
          (styleRule as CSSStyleRule).selectorText = value;
        }
        break;
      }
      case MutationType.REMOVE: {
        const styleSheet = (targetRule as any) as CSSStyleSheet;
        const oldRule = contentNode.sheet.rules[mutation.index];
        styleSheet.deleteRule(mutation.index);
        console.log("REMOVE", oldRule.id);
        map = {
          ...map,
          [oldRule.id]: undefined
        };
        break;
      }
      case MutationType.MOVE: {
        const styleSheet = (targetRule as any) as CSSStyleSheet;
        const rule = styleSheet.cssRules[mutation.oldIndex];
        styleSheet.deleteRule(mutation.oldIndex);
        styleSheet.insertRule(rule.cssText, mutation.newIndex);
        break;
      }
      default: {
        console.error(`cannot apply patch: ${JSON.stringify(mutation)}`);
        break;
      }
    }
  }

  return [newContentNode, map];
};

export const patchHTMLNode = (
  contentNode: SyntheticContentNode,
  root: HTMLElement,
  mutation: Mutation,
  mutations: Mutation[],
  map: SyntheticNativeDOMMap
): [SyntheticContentNode, SyntheticNativeDOMMap] => {
  const childrenIndex = mutation.path.lastIndexOf("children");

  const nodePath = mutation.path.slice(
    0,
    childrenIndex === mutation.path.length - 1
      ? childrenIndex
      : childrenIndex + 2
  );

  const oldSyntheticTarget =
    childrenIndex === -1 ? contentNode : getValue(contentNode, nodePath);

  const isContentNode = mutation.path.length === 0;
  let newMap = map;
  const target = newMap[oldSyntheticTarget.id] as HTMLElement;
  contentNode = patch(contentNode, [mutation]);
  const syntheticTarget = getValue(contentNode, mutation.path);
  switch (mutation.type) {
    case MutationType.UNSET: {
      if (syntheticTarget.name === "text" && name === "value") {
        target.childNodes[0].nodeValue = "";
      }
      break;
    }
    case MutationType.SET: {
      const { propertyName: name, value } = mutation;

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
      } else if (syntheticTarget.name === "text" && name === "value") {
        target.childNodes[0].nodeValue = value;
      }

      break;
    }
    case MutationType.INSERT: {
      newMap = { ...newMap };
      const { value: child, index } = mutation;

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
      const { index } = mutation;
      target.removeChild(target.childNodes[index]);
      break;
    }
    case MutationType.MOVE: {
      const { oldIndex, newIndex } = mutation;
      const child = target.childNodes[oldIndex];
      target.removeChild(child);
      insertChild(target, child, newIndex);
      break;
    }
    default: {
      throw new Error(`OT not supported yet: ${JSON.stringify(mutation)}`);
    }
  }

  return [contentNode, newMap];
};

export const patchNative = (
  mutations: Mutation[],
  contentNode: SyntheticContentNode,
  root: HTMLElement,
  map: SyntheticNativeMap
) => {
  let newMap = map;
  let newContentNode: SyntheticVisibleNode = contentNode;

  for (const mutation of mutations) {
    let { cssom, dom } = newMap;

    if (isStyleSheetMutation(mutation)) {
      [newContentNode, cssom] = patchStyleSheet(
        newContentNode,
        mutation,
        cssom
      );
    } else {
      [newContentNode, dom] = patchHTMLNode(
        newContentNode,
        root,
        mutation,
        mutations,
        dom
      );
    }
    newMap = { cssom, dom };
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
