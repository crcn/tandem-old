import {
  Action,
  bindable,
  BubbleBus,
  serialize,
  deserialize,
  ISerializer,
  serializable,
  TreeNodeAction,
  ISerializedContent,
  ObservableCollection,
} from "@tandem/common";

import {
  DOMNodeType,
  SyntheticDOMText,
  SyntheticDOMNode,
  IMarkupNodeVisitor,
  SyntheticDOMElement,
  SyntheticDOMComment,
  SyntheticDOMContainer,
  SyntheticDOMValueNode,
  syntheticElementClassType,
  SyntheticDocumentFragment,
} from "./markup";

import { SyntheticWindow } from "./window";
import { SyntheticLocation } from "../location";
import { SyntheticCSSStyleSheet } from "./css";

interface IRegisterComponentOptions {
  prototype: any;
  extends: string;
}

export interface ISerializedSyntheticDocument {
  styleSheets: any[];
  defaultNamespaceURI: string;
  childNodes: any[];
}

class SyntheticDocumentSerializer implements ISerializer<SyntheticDocument, ISerializedSyntheticDocument> {
  serialize(document: SyntheticDocument) {
    return {
      // need to cast style sheet to vanilla array before mapping
      styleSheets: [].concat(document.styleSheets).map(serialize),
      defaultNamespaceURI: document.defaultNamespaceURI,
      childNodes: document.childNodes.map(serialize)
    };
  }
  deserialize(value: ISerializedSyntheticDocument, dependencies) {
    const document = new SyntheticDocument(value.defaultNamespaceURI);
    document.styleSheets.push(...value.styleSheets.map(raw => deserialize(raw, dependencies)));
    for (let i = 0, n = value.childNodes.length; i < n; i++) {
      document.appendChild(deserialize(value.childNodes[i], dependencies));
    }
    return document;
  }
}

@serializable(new SyntheticDocumentSerializer())
export class SyntheticDocument extends SyntheticDOMContainer {

  readonly nodeType: number = DOMNodeType.DOCUMENT;
  readonly styleSheets: ObservableCollection<SyntheticCSSStyleSheet>;
  private _registeredElements: any;
  public $window: SyntheticWindow;

  // namespaceURI here is non-standard, but that's
  constructor(readonly defaultNamespaceURI: string) {
    super("#document");
    this.styleSheets = new ObservableCollection<SyntheticCSSStyleSheet>();
    this.styleSheets.observe(new BubbleBus(this));
    this._registeredElements = {};
  }

  get browser() {
    return this.$window.browser;
  }

  get defaultView(): SyntheticWindow {
    return this.$window;
  }

  get documentElement(): SyntheticDOMElement {
    return this.childNodes[0] as SyntheticDOMElement;
  }

  get head(): SyntheticDOMElement {
    return this.documentElement.childNodes[0] as SyntheticDOMElement;
  }

  get body(): SyntheticDOMElement {
    return this.documentElement.childNodes[1] as SyntheticDOMElement;
  }

  get location(): SyntheticLocation {
    return this.$window.location;
  }

  set location(value: SyntheticLocation) {
    this.$window.location = value;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitDocument(this);
  }

  createElementNS(ns: string, tagName: string): SyntheticDOMElement {
    const nsElements = this._registeredElements[ns] || {};
    const elementClass = this.$getElementClassNS(ns, tagName);
    const element = this.own(new elementClass(ns, tagName));
    element.$createdCallback();
    return element;
  }

  $getElementClassNS(ns: string, tagName: string): syntheticElementClassType {
    const nsElements = this._registeredElements[ns] || {};
    const elementClass = nsElements[tagName.toLowerCase()] || nsElements.default || SyntheticDOMElement;
    return elementClass;
  }

  createElement(tagName: string) {
    return this.own(this.createElementNS(this.defaultNamespaceURI, tagName));
  }

  registerElement(tagName: string, elementClass: syntheticElementClassType);
  registerElement(tagName: string, options: IRegisterComponentOptions);

  registerElement(tagName: string, options: any): syntheticElementClassType {
    return this.registerElementNS(this.defaultNamespaceURI, tagName, options);
  }

  // non-standard APIs to enable custom elements according to the doc type -- necessary for
  // cases where we're mixing different template engines such as angular, vuejs, etc.
  registerElementNS(ns: string, tagName: string, elementClass: syntheticElementClassType);
  registerElementNS(ns: string, tagName: string, options: IRegisterComponentOptions);

  registerElementNS(ns: string, tagName: string, options: any): syntheticElementClassType {
    if (!this._registeredElements[ns]) {
      this._registeredElements[ns] = {};
    }
    return this._registeredElements[ns][tagName.toLowerCase()] = typeof options === "function" ? options : createElementClass(options);
  }

  createComment(nodeValue: string) {
    return this.own(new SyntheticDOMComment(nodeValue));
  }

  createTextNode(nodeValue: string) {
    return this.own(new SyntheticDOMText(nodeValue));
  }

  createDocumentFragment() {
    return this.own(new SyntheticDocumentFragment());
  }

  onChildAdded(child) {
    super.onChildAdded(child);
    this.own(child);
  }


  cloneNode(deep?: boolean) {
    const document = new SyntheticDocument(this.defaultNamespaceURI);
    document.$window = this.defaultView;
    if (deep === true) {
      for (let i = 0, n = this.childNodes.length; i < n; i++) {
        document.appendChild(this.childNodes[i].cloneNode(true));
      }
    }
    return document;
  }

  private own<T extends SyntheticDOMNode>(node: T) {
    node.$setOwnerDocument(this);
    return node;
  }
}

function createElementClass(options: IRegisterComponentOptions): syntheticElementClassType {
  return class extends SyntheticDOMElement {
    // TODO
  };
}