import { debounce, throttle, values } from "lodash";
import { decode } from "ent";
import { SEnvNodeTypes, SVG_XMLNS, HTML_XMLNS } from "../constants";
import { SEnvNodeInterface, documentMutators } from "../nodes";
import { 
  SEnvCSSStyleSheetInterface, 
  SEnvCSSObjectInterface, 
  SEnvCSSParentRuleInterface, 
  SEnvCSSRuleInterface,
  CSSParentObject,
  cssStyleSheetMutators,
  flattenSyntheticCSSStyleSheetSources
} from "../css";
import { SEnvWindowInterface, patchWindow, windowMutators, flattenWindowObjectSources } from "../window";
import { 
  SEnvParentNodeMutationTypes, 
  SyntheticDOMElementMutationTypes,
  createParentNodeInsertChildMutation, 
  SEnvParentNodeInterface, 
  SEnvCommentInterface, 
  SEnvHTMLStyledElementInterface,
  filterNodes,
  SEnvElementInterface, 
  SEnvTextInterface, 
  createParentNodeRemoveChildMutation, 
  SEnvHTMLIFrameElementInterface 
} from "../nodes";
import { SEnvMutationEventInterface, getSEnvEventClasses } from "../events";
import { BaseSyntheticWindowRenderer, SyntheticWindowRendererNativeEvent } from "./base";
import { InsertChildMutation, RemoveChildMutation, MoveChildMutation, Mutation, Mutator, weakMemo, createZeroBounds } from "aerial-common2";
import { SET_SYNTHETIC_SOURCE_CHANGE, flattenNodeSources } from "../nodes";
import { getNodeByPath, getNodePath } from "../../utils";

const NODE_NAME_MAP = {
  head: "span",
  html: "span",
  body: "span",
  link: "style",
  script: "span",
  iframe: "span"
};

const { SEnvWrapperEvent } = getSEnvEventClasses();

type CSSRuleDictionaryType = {
  [IDentifier: string]: [() => CSSGroupingRule|CSSRule|CSSStyleSheet, any]
}

type HTMLElementDictionaryType = {
  [IDentifier: string]: [Node, SEnvNodeInterface]
}

type DOMRendererDicts = {
  nodes: HTMLElementDictionaryType,
  sheets: CSSRuleDictionaryType,
}

const RECOMPUTE_TIMEOUT = 1;

function getHostStylesheets(node: Node) {
  let p = node.parentNode;
  while(p.parentNode) p = p.parentNode;
  return (<Document>p).styleSheets || [];
}

// See https://github.com/crcn/tandem/blob/318095f9e8672935be4bffea6c7c72aa6d8b95cb/src/@tandem/synthetic-browser/renderers/dom/index.ts

// TODO - this should contain an iframe
export class SyntheticDOMRenderer extends BaseSyntheticWindowRenderer {
  readonly container: HTMLIFrameElement;
  readonly mount: HTMLDivElement;
  private _documentElement: HTMLElement;
  private _rendering: boolean;
  private _mutations: Mutation<any>[];
  private _elementDictionary: HTMLElementDictionaryType;
  private _cssRuleDictionary: CSSRuleDictionaryType;

  constructor(sourceWindow: SEnvWindowInterface, readonly targetDocument: Document) {
    super(sourceWindow);
    this.container = targetDocument.createElement("iframe");
    Object.assign(this.container.style, {
      border: "none",
      width: "100%",
      height: "100%"
    });

    this._onContainerResize = this._onContainerResize.bind(this);
    this.mount = targetDocument.createElement("div");
    this.container.onload = () => {
      this.container.contentWindow.document.body.appendChild(this.mount);
      this.container.contentWindow.addEventListener("resize", this._onContainerResize);
      this.requestRender();
    };
  }

  protected async render() {
    if (!this._documentElement) {
      this._documentElement = renderHTMLNode(this.sourceWindow.document, {
        nodes: this._elementDictionary = {},
        sheets: this._cssRuleDictionary = {}
      }, this.onElementChange, this.targetDocument);
      this.mount.appendChild(this._documentElement);
    }
    this._resetComputedInfo();
  }

  private onElementChange = () => {
    this.requestRender();
  }

  private _updateCSSRules(staleStyleSheet: CSSStyleSheet, syntheticStyleSheet: SEnvCSSStyleSheetInterface) {
    while (staleStyleSheet.rules.length) {
      staleStyleSheet.deleteRule(0);
    }

    for (let i = 0, n = syntheticStyleSheet.cssRules.length; i < n; i++) {
      const rule = syntheticStyleSheet.cssRules[i] as SEnvCSSRuleInterface;
      try {
        staleStyleSheet.insertRule(rule.previewCSSText, staleStyleSheet.cssRules.length);
      } catch(e) {
        // browser may throw errors if it cannot parse the rule -- this will
        // happen unsupported vendor prefixes.
      }
    }
  }

  private _getSourceCSSText() {
    return Array.prototype.map.call(this.sourceWindow.document.stylesheets, (ss: SEnvCSSStyleSheetInterface) => (
      ss.previewCSSText
    )).join("\n");
  }

  protected _onContainerResize(event) {
    this._resetComputedInfo();
  }

  protected _onWindowMutation(event: SEnvMutationEventInterface) {
    super._onWindowMutation(event);

    const { mutation } = event;

    
    if (documentMutators[mutation.$type]) {
      const [nativeNode, syntheticObject] = this.getElementDictItem(mutation.target);

      // if(!nativeNode) {
      //   console.warn(`Unable to find DOM node for mutation ${mutation.$type}`);
      //   console.log(mutation.target);
      //   console.log(Object.assign({}, this._elementDictionary));
      // }

      if (nativeNode) {
        if (mutation.$type === SEnvParentNodeMutationTypes.REMOVE_CHILD_NODE_EDIT) {
          const removeMutation = mutation as RemoveChildMutation<any, SEnvNodeInterface>;
          (windowMutators[mutation.$type] as Mutator<any, any>)(nativeNode, mutation);
        } else if (mutation.$type === SEnvParentNodeMutationTypes.INSERT_CHILD_NODE_EDIT) {
          const insertMutation = mutation as RemoveChildMutation<any, SEnvNodeInterface>;
          const child = renderHTMLNode(insertMutation.child, { 
            nodes: this._elementDictionary,
            sheets: this._cssRuleDictionary
          }, this.onElementChange, this.targetDocument);

          (windowMutators[mutation.$type] as Mutator<any, any>)(nativeNode, createParentNodeInsertChildMutation(nativeNode, child, insertMutation.index, false));
        } else if (mutation.$type === SyntheticDOMElementMutationTypes.ATTACH_SHADOW_ROOT_EDIT) {
          const shadow = (nativeNode as HTMLElement).attachShadow({ mode: "open" });
          this._elementDictionary[(mutation.target as SEnvElementInterface).shadowRoot.$id] = [shadow, (mutation.target as SEnvElementInterface).shadowRoot];
        } else {
          (windowMutators[mutation.$type] as Mutator<any, any>)(nativeNode, mutation);
        }
      } else {
        
        // MUST replace the entire CSS text here since vendor prefixes get stripped out
        // depending on the browser. This is the simplest method for syncing changes.
        const parentStyleSheet = (((mutation.target as CSSStyleDeclaration).parentRule && (mutation.target as CSSStyleDeclaration).parentRule.parentStyleSheet) || (mutation.target as CSSStyleRule).parentStyleSheet) as SEnvCSSStyleSheetInterface;
        if (parentStyleSheet) {
          const [getNativeStyleSheet, syntheticStyleSheet] = this.getCSSObjectDictItem(parentStyleSheet);
          this._updateCSSRules(getNativeStyleSheet(), syntheticStyleSheet);
        }
      }
    }
  }

  protected getElementDictItem<T extends Node, U extends SEnvNodeInterface>(synthetic: SEnvNodeInterface): [T, U] {
    return this._elementDictionary && this._elementDictionary[synthetic.$id] || [undefined, undefined] as any;
  }

  protected getCSSObjectDictItem<T extends any, U extends any>(synthetic: any): [T, U] {
    return this._cssRuleDictionary && this._cssRuleDictionary[synthetic.$id] || [undefined, undefined] as any;
  }

  protected _deferResetComputedInfo = throttle(() => {
    this._resetComputedInfo();
  }, 10);

  protected _onWindowScroll(event: Event) {
    super._onWindowScroll(event);

    // TODO - possibly move this to render
    this.container.contentWindow.scroll(this._sourceWindow.scrollX, this._sourceWindow.scrollY);
  }

  private _resetComputedInfo() {
    const rects  = {};
    const styles = {};

    const targetWindow = this.targetDocument.defaultView;
    const containerWindow = this.container.contentWindow;
    const containerBody = containerWindow && containerWindow.document.body;

    if (!containerBody) {
      return;
    }

    for (let $id in this._elementDictionary) {
      const [native, synthetic] = this._elementDictionary[$id] || [undefined, undefined];

      if (synthetic && synthetic.nodeType === SEnvNodeTypes.ELEMENT) {

        const rect = (native as Element).getBoundingClientRect() || { width: 0, height: 0, left: 0, top: 0 };
        
        if (rect.width || rect.height || rect.left || rect.top) {
          rects[$id] = rect;
        }

        // just attach whatever's returned by the DOM -- don't wrap this in a synthetic, or else
        // there'll be massive performance penalties.
        styles[$id] = targetWindow.getComputedStyle(native as Element);
      }
    }

    if (containerBody) {
      this.setPaintedInfo(rects, styles, {
        width: containerBody.scrollWidth,
        height: containerBody.scrollHeight
      }, {
        left: containerWindow.scrollX,
        top: containerWindow.scrollY
      });
    }
  }

  protected reset() {
    this._documentElement = undefined;
    this._cssRuleDictionary = {};
    this._elementDictionary = {};
    const { mount } = this;

    if (mount) {
      mount.innerHTML = "";
      mount.onclick = 
      mount.ondblclick = 
      mount.onsubmit = 
      mount.onmousedown =
      mount.onmouseenter = 
      mount.onmouseleave = 
      mount.onmousemove  = 
      mount.onmouseout = 
      mount.onmouseover = 
      mount.onmouseup =
      mount.onmousewheel = 
      mount.onkeydown = 
      mount.onkeypress = 
      mount.onkeyup = (event: any) => {
        for (let $id in this._elementDictionary) {
          const [native, synthetic] = this._elementDictionary[$id] || [undefined, undefined];
          if (native === event.target) {
            this.onDOMEvent(synthetic as SEnvElementInterface, event);
          }
        }
      }
    }
  }
  
  private onDOMEvent (element: SEnvElementInterface, event: any) {

    // need to cast as synthetic event. This is fine for now though.
    const e = new SEnvWrapperEvent();
    e.init(event);
    element.dispatchEvent(e);
    event.stopPropagation();
    if (/submit/.test(event.type)) {
      event.preventDefault();
    }

    const ne = new SyntheticWindowRendererNativeEvent();
    ne.init(SyntheticWindowRendererNativeEvent.NATIVE_EVENT, element.$id, e);

    if (element.tagName.toLowerCase() === "input") {
      (element as any as HTMLInputElement).value = event.target.value;
    }

    this.dispatchEvent(ne);
  }
}

const eachMatchingElement = (a: SEnvNodeInterface, b: Node, each: (a: SEnvNodeInterface, b: Node) => any) => {
  each(a, b);
  Array.prototype.forEach.call(a.childNodes, (ac, i) => {
    eachMatchingElement(ac, b.childNodes[i], each);
  });
};

const renderHTMLNode = (node: SEnvNodeInterface, dicts: DOMRendererDicts, onChange: () => any, document: Document): any =>  {
  switch(node.nodeType) {

    case SEnvNodeTypes.TEXT:
      const value = node.textContent;
      const textNode = document.createTextNode(/^[\s\r\n\t]+$/.test(value) ? "" : value);
      dicts.nodes[node.$id] = [textNode, node];
      return textNode;

    case SEnvNodeTypes.COMMENT:
      const comment = document.createComment((<SEnvCommentInterface>node).nodeValue);
      dicts.nodes[node.$id] = [comment, node];
      return comment;

    case SEnvNodeTypes.ELEMENT:
      const syntheticElement = <SEnvElementInterface>node;

      const tagNameLower = syntheticElement.tagName.toLowerCase();
      const element = renderHTMLElement(tagNameLower, syntheticElement, dicts, onChange, document);

      element.onload = onChange;
      for (let i = 0, n = syntheticElement.attributes.length; i < n; i++) {
        const syntheticAttribute = syntheticElement.attributes[i];
        if (syntheticAttribute.name === "class") {
          element.className = syntheticAttribute.value;
        } else {

          // some cases where the attribute name may be invalid - especially as the app is updating
          // as the user is typing. E.g: <i </body> will be parsed, but will thrown an error since "<" will be
          // defined as an attribute of <i>
          try {
            // get preview attribute value instead here
            let value = syntheticElement.getPreviewAttribute(syntheticAttribute.name);

            element.setAttribute(syntheticAttribute.name, value);
          } catch(e) {
            console.warn(e.stack);
          }
        }
      }

      if (tagNameLower === "iframe") {
        const iframe = syntheticElement as any as SEnvHTMLIFrameElementInterface;
        element.appendChild(iframe.contentWindow.renderer.container);
      }

      if (tagNameLower === "style" || tagNameLower === "link") {
        const el = (syntheticElement as SEnvHTMLStyledElementInterface);
        (element as HTMLStyleElement).type = "text/css";
        
        element.appendChild(document.createTextNode(el.sheet.previewCSSText));

        // define function since sheet is not set until it's added to the document
        dicts.sheets[el.sheet.$id] = [() => (element as HTMLStyleElement).sheet as CSSStyleSheet, el.sheet];
      }

      // add a placeholder for these blacklisted elements so that diffing & patching work properly
      if(/^(script|head)$/.test(tagNameLower)) {
        element.style.display = "none";
        return element;
      }

      return appendChildNodes(element, syntheticElement.childNodes, dicts, onChange, document);
    case SEnvNodeTypes.DOCUMENT:
    case SEnvNodeTypes.DOCUMENT_FRAGMENT:
      const syntheticContainer = <SEnvParentNodeInterface>node;
      const containerElement = renderHTMLElement("span", syntheticContainer as SEnvElementInterface, dicts, onChange, document);
      return appendChildNodes(containerElement, syntheticContainer.childNodes as any as SEnvNodeInterface[], dicts, onChange, document);
  }
}

const renderHTMLElement = (tagName: string, source: SEnvElementInterface, dicts: DOMRendererDicts, onChange: () => any, document: Document): HTMLElement =>  {
  const mappedTagName = NODE_NAME_MAP[tagName.toLowerCase()] || tagName;
  const element = document.createElementNS(source.namespaceURI === SVG_XMLNS ? SVG_XMLNS : HTML_XMLNS, mappedTagName.toLowerCase()) as HTMLElement;

  if (source.shadowRoot) {
    const shadowRoot = element.attachShadow({ mode: "open" });
    dicts.nodes[source.shadowRoot.$id] = [shadowRoot, source.shadowRoot];
    appendChildNodes(shadowRoot, source.shadowRoot.childNodes, dicts, onChange, document);
  }
  dicts.nodes[source.$id] = [element, source];
  return element as any;
}

const appendChildNodes = (container: HTMLElement|DocumentFragment, syntheticChildNodes: SEnvNodeInterface[], dicts: DOMRendererDicts, onChange: () => any, document: Document) => {
  
  for (let i = 0, n = syntheticChildNodes.length; i < n; i++) {
    const childNode = renderHTMLNode(syntheticChildNodes[i], dicts, onChange, document);

    // ignored
    if (childNode == null) continue;
    container.appendChild(childNode);
  }
  return container;
}

export const createSyntheticDOMRendererFactory = (targetDocument: Document) => (window: SEnvWindowInterface) => new SyntheticDOMRenderer(window, targetDocument);
