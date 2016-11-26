import { decode } from "ent";
import { camelCase } from "lodash";
import { BaseRenderer } from "../base";
import { CallbackDispatcher } from "@tandem/mesh";
import {
  HTML_XMLNS,
  SVG_XMLNS,
  SVG_TAG_NAMES,
  HTML_VOID_ELEMENTS,
  SyntheticDOMElementMutationTypes,
  SyntheticDOMValueNodeMutationTypes
} from "@tandem/synthetic-browser/dom";

import {
  bindable,
  isMaster,
  Mutation,
  diffArray,
  flattenTree,
  BoundingRect,
  traverseTree,
  MutationEvent,
  watchProperty,
  RemoveMutation,
  PropertyMutation,
  MoveChildMutation,
  InsertChildMutation,
  RemoveChildMutation,
  TreeNodeMutationTypes,
  calculateAbsoluteBounds
} from "@tandem/common";

import {
  DOMNodeType,
  isCSSMutation,
  SyntheticDOMNode,
  SyntheticDOMText,
  DOMElementEditor,
  SyntheticDocument,
  isDOMNodeMutation,
  SyntheticCSSObject,
  DOMValueNodeEditor,
  DOMContainerEditor,
  SyntheticCSSAtRule,
  CSSStyleRuleEditor,
  isCSSAtRuleMutaton,
  SyntheticDOMElement,
  CSSStyleSheetEditor,
  SyntheticDOMComment,
  isDOMElementMutation,
  syntheticCSSRuleType,
  SyntheticCSSStyleRule,
  CSSGroupingRuleEditor,
  SyntheticDOMValueNode,
  SyntheticDOMContainer,
  isDOMContainerMutation,
  isDOMValueNodeMutation,
  isCSSStyleRuleMutation,
  SyntheticCSSStyleSheet,
  SyntheticCSSGroupingRule,
  isCSSGroupingStyleMutation,
  CSSGroupingRuleMutationTypes,
  SyntheticCSSStyle,
  SyntheticDocumentMutationTypes,
  SyntheticCSSStyleRuleMutationTypes,
} from "../../dom";

import { DOMNodeEvent } from "../../messages";

type HTMLElementDictionaryType = {
  [IDentifier: string]: [Node, SyntheticDOMNode]
}
const ss: CSSStyleSheet = null;

type CSSRuleDictionaryType = {
  [IDentifier: string]: [CSSRule|CSSStyleSheet, syntheticCSSRuleType|SyntheticCSSStyleSheet]
}

function getHostStylesheets(node: Node) {
  let p = node.parentNode;
  while(p.parentNode) p = p.parentNode;

  return (<Document>p).styleSheets || [];
}

export class SyntheticDOMRenderer extends BaseRenderer {

  private _currentCSSText: string;
  private _firstRender: boolean;
  private _documentElement: HTMLElement;
  private _elementDictionary: HTMLElementDictionaryType;
  private _cssRuleDictionary: CSSRuleDictionaryType;
  private _getComputedStyle: (node: Node) => CSSStyleDeclaration;

  constructor(nodeFactory?: Document, getComputedStyle?: (node: Node) => CSSStyleDeclaration) {
    super(nodeFactory);
    this._getComputedStyle = getComputedStyle || (typeof window !== "undefined" ? window.getComputedStyle.bind(window) : () => {});
  }

  createElement() {
    return this.nodeFactory.createElement("div");
  }

  protected onDocumentMutationEvent({ mutation }: MutationEvent<any>) {
    super.onDocumentMutationEvent(arguments[0]);

    if (isDOMNodeMutation(mutation)) {
      const [nativeNode, syntheticNode] = this.getElementDictItem(mutation.target);

      const insertChild = (syntheticNode) => {
        return renderHTMLNode(this.nodeFactory, syntheticNode, this._elementDictionary);
      };

      if (nativeNode) {
        if (isDOMElementMutation(mutation)) {
          new DOMElementEditor(<HTMLElement>nativeNode, insertChild).applyMutations([mutation]);
        } else if(isDOMContainerMutation(mutation)) {
          new DOMContainerEditor(<DocumentFragment>nativeNode, insertChild).applyMutations([mutation]);
        } else if(isDOMValueNodeMutation(mutation)) {
          new DOMValueNodeEditor(<Text>nativeNode).applyMutations([mutation]);
        }
      }
    }

    if (isCSSMutation(mutation)) {
      const [nativeRule, syntheticRule] = this.getCSSDictItem(mutation.target);
      if (nativeRule) {
        if (isCSSGroupingStyleMutation(mutation)) {
          new CSSGroupingRuleEditor(<CSSGroupingRule>nativeRule, (parent, child) => {
            return child.cssText;
          }, (child, index) => {

            this._cssRuleDictionary[child.uid] = [(<CSSGroupingRule>nativeRule).cssRules[index], child];
          }, (child, index) => {
            this._cssRuleDictionary[child.uid] = undefined;
          }).applyMutations([mutation]);
        } else if (isCSSStyleRuleMutation(mutation)) {
          new CSSStyleRuleEditor(<CSSStyleRule>nativeRule).applyMutations([mutation]);
        }
      } else {
        this.logger.warn(`Unable to find matching declaration`);
      }
    }
  }

  private getSyntheticStyleSheetIndex(styleSheet: SyntheticCSSObject) {
    return this.document.styleSheets.findIndex(ss => ss.uid === styleSheet.uid);
  }

  private getSyntheticStyleSheet(styleSheet: SyntheticCSSObject) {
    return this.document.styleSheets[this.getSyntheticStyleSheetIndex(styleSheet)];
  }

  private getNativeRuleIndex(index: number) {
    this.document.styleSheets.slice(index + 1).forEach((ss) => {
      index += ss.rules.length;
    });
    return index;
  }

  protected getElementDictItem<T extends Node, U extends SyntheticDOMNode>(synthetic: SyntheticDOMNode): [T, U] {
    return this._elementDictionary && this._elementDictionary[synthetic.uid] || [undefined, undefined] as any;
  }

  protected async render() {
    const { document, element } = this;

    if (!this._documentElement) {
      await Promise.all(document.styleSheets.map((styleSheet) => {
        const styleElement = this.nodeFactory.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.textContent = styleSheet.cssText;
        element.appendChild(styleElement);
        return new Promise((resolve) => {
          const tryRegistering = () => {
            this.tryRegisteringStyleSheet(styleElement, styleSheet).then(() => resolve(styleElement), () => {
              setTimeout(tryRegistering, 20);
            });
          }
          setImmediate(tryRegistering);
        });
      }).concat((new Promise(resolve => {
        this._documentElement = renderHTMLNode(this.nodeFactory, document, this._elementDictionary = {});
        element.appendChild(this._documentElement);
        resolve();
      }))));
    }

    this.updateRects();
  }

  private getCSSDictItem<T extends CSSRule>(target: SyntheticCSSObject): [T, syntheticCSSRuleType] {
    return (this._cssRuleDictionary && this._cssRuleDictionary[target.uid]) || [undefined, undefined] as any;
  }

  private tryRegisteringStyleSheet(styleElement: HTMLStyleElement, styleSheet: SyntheticCSSStyleSheet) {

    const nativeStyleSheet = Array.prototype.slice.call(getHostStylesheets(styleElement)).find((styleSheet: CSSStyleSheet) => {
      return styleSheet.ownerNode === styleElement;
    });

    if (!nativeStyleSheet) {
      return Promise.reject(new Error(`Cannot find native style sheet generated by DOM renderer.`));
    }

    this._cssRuleDictionary[styleSheet.uid] = [nativeStyleSheet, styleSheet];

    const registerGroupingRule = (nativeRule: CSSGroupingRule|CSSStyleSheet, syntheticRule: SyntheticCSSGroupingRule<any>) => {
      for (let i = 0, n  = nativeRule.cssRules.length; i < n; i++){
        const nativeChildRule    = nativeRule.cssRules[i];
        const syntheticChildRule = syntheticRule.cssRules[i];
        this._cssRuleDictionary[syntheticChildRule.uid] = [nativeChildRule, syntheticChildRule];

        // possible grouping rule
        if ((<CSSGroupingRule>nativeChildRule).cssRules) {
          registerGroupingRule(<CSSGroupingRule>nativeChildRule, <SyntheticCSSGroupingRule<any>>syntheticChildRule);
        }
      }
    }

    registerGroupingRule(nativeStyleSheet, styleSheet);
    
    return Promise.resolve();
  }

  protected reset() {
    this._documentElement = undefined;
    this._cssRuleDictionary = {};
    this._elementDictionary = {};
    if (this.element) this.element.innerHTML = "";
  }

  private updateRects() {
    const syntheticDOMNodesByUID = {};
    const rects  = {};
    const styles = {};

    for (let uid in this._elementDictionary) {
      const [native, synthetic] = this._elementDictionary[uid] || [undefined, undefined];

      const syntheticNode: SyntheticDOMNode = <SyntheticDOMNode>synthetic;
      if (syntheticNode && syntheticNode.nodeType === DOMNodeType.ELEMENT) {
        const rect = rects[uid]  = BoundingRect.fromClientRect((<Element>native).getBoundingClientRect());

        const nativeStyle = this._getComputedStyle(native);

        // just attach whatever's returned by the DOM -- don't wrap this in a synthetic, or else
        // there'll be massive performance penalties.
        styles[uid] = nativeStyle;
        (<SyntheticDOMNode>syntheticNode).attachNative(native);
      }
    }

    this.setRects(rects, styles);
  }
}

function renderHTMLNode(nodeFactory: Document, syntheticNode: SyntheticDOMNode, dict: HTMLElementDictionaryType): any {
  switch(syntheticNode.nodeType) {

    case DOMNodeType.TEXT:
      const textNode = nodeFactory.createTextNode(decode(syntheticNode.textContent));
      dict[syntheticNode.uid] = [textNode, syntheticNode];
      return textNode;

    case DOMNodeType.COMMENT:
      const comment = nodeFactory.createComment((<SyntheticDOMComment>syntheticNode).nodeValue);
      return comment;

    case DOMNodeType.ELEMENT:
      const syntheticElement = <SyntheticDOMElement>syntheticNode;

      // add a placeholder for these blacklisted elements so that diffing & patching work properly
      
      if (/^(style|link)$/.test(syntheticElement.nodeName)) return nodeFactory.createTextNode("");
      const element = renderHTMLElement(nodeFactory, syntheticElement.tagName, syntheticElement, dict);
      for (let i = 0, n = syntheticElement.attributes.length; i < n; i++) {
        const syntheticAttribute = syntheticElement.attributes[i];
        element.setAttribute(syntheticAttribute.name, syntheticAttribute.value);
      }
      return appendChildNodes(nodeFactory, element, syntheticElement.childNodes, dict);
    case DOMNodeType.DOCUMENT:
    case DOMNodeType.DOCUMENT_FRAGMENT:
      const syntheticContainer = <SyntheticDOMContainer>syntheticNode;
      const containerElement = renderHTMLElement(nodeFactory, "span", syntheticContainer, dict);
      return appendChildNodes(nodeFactory, containerElement, syntheticContainer.childNodes, dict);
  }
}

function renderHTMLElement(nodeFactory: Document, tagName: string, source: SyntheticDOMNode, dict: HTMLElementDictionaryType): any {
  const element = nodeFactory.createElementNS(source.namespaceURI === SVG_XMLNS ? SVG_XMLNS : HTML_XMLNS, tagName);
  dict[source.uid] = [element, source];
  return element;
}

function appendChildNodes(nodeFactory: Document, container: HTMLElement|DocumentFragment, syntheticChildNodes: SyntheticDOMNode[], dict: HTMLElementDictionaryType) {
  for (let i = 0, n = syntheticChildNodes.length; i < n; i++) {
    const childNode = renderHTMLNode(nodeFactory, syntheticChildNodes[i], dict);

    // ignored
    if (childNode == null) continue;
    container.appendChild(childNode);
  }
  return container;
}
