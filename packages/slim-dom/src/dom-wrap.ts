/**
 * Light DOM wrapper for interoperability with immutable DOM objects and third-party DOM libraries such as nwmatcher.
 */

import { SlimBaseNode, SlimCSSGroupingRule, SlimCSSMediaRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimParentNode, SlimStyleElement, SlimTextNode, SlimVMObjectType } from "./state";
import { weakMemo } from "./weak-memo";

export const getLightDomWrapper = weakMemo((node: SlimBaseNode): LightBaseNode => {
  switch(node.type) {
    case SlimVMObjectType.TEXT: return new LightTextNode(node as SlimTextNode);
    case SlimVMObjectType.ELEMENT: return new LightElement(node as SlimElement);
    case SlimVMObjectType.DOCUMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: return new LightDocumentFragment(node as SlimParentNode)
  }
});


export const getLightDocumentWrapper = weakMemo((node: SlimBaseNode): LightDocument => {
  const document = new LightDocument();
  document.body = getLightDomWrapper(node);
  return document;
});

export const traverseLightDOM = (current: LightBaseNode, each: (node: LightBaseNode) => void|boolean) => {
  if (each(current) === false) {
    return false;
  }
  for (let i = 0, {length} = current.childNodes; i < length; i++) {
    const child = current.childNodes[i];
    if (traverseLightDOM(child, each) === false) {
      return false;
    }
  }
  return true;
};

export abstract class LightBaseNode {
  abstract nodeName: string;
  abstract nodeType: number;
  public parentNode: LightParentNode;
  public ownerDocument: LightDocument;
  public host: LightParentNode;
  public childNodes: LightBaseNode[] = [];
  constructor(readonly source: SlimBaseNode) {

  }
  get nextSibling() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1] : null;
  }
  get prevSibling() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1] : null;
  }
}

export abstract class LightParentNode extends LightBaseNode {
  constructor(source: SlimParentNode) {
    super(source);
    if (source) {
      this.childNodes = source.childNodes.map(child => {
        const lightChild = getLightDomWrapper(child);
        lightChild.parentNode = this;
        return lightChild;
      });
    }
  }
  appendChild(child) {
    this.childNodes.push(child);
    return child;
  }
  insertBefore(child: LightBaseNode, refChild: LightBaseNode) {
    const index = this.childNodes.indexOf(refChild);
    this.childNodes.splice(index, 0, child);
    return child;
  }
  get firstChild() {
    return this.childNodes[0];
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1];
  }
}

class LightAttribute {
  readonly specified = true;
  constructor(readonly name: string, public value: string) {

  }
}

export class LightElement extends LightParentNode {
  readonly nodeType = 1;
  readonly nodeName: string;
  readonly tagName: string;
  public shadowRoot: LightDocumentFragment;
  readonly attributes: LightAttribute[];
  private _attributesByName: {
    [identifier: string]: LightAttribute
  }
  constructor(source: SlimElement, ownerDocument?: LightDocument) {
    super(source);
    this.ownerDocument = ownerDocument;
    this.nodeName = this.tagName = source.tagName;
    if (source) {
      if (source.shadow) {
        this.shadowRoot = getLightDomWrapper(source.shadow) as LightDocumentFragment;
        this.shadowRoot.host = this;
      }
      this._attributesByName = {};
      this.attributes = [];
      for (let i = 0, {length} = source.attributes; i < length; i++) {
        const { name, value } = source.attributes[i];
        this.setAttribute(name, value);
      }
    }
  }
  setAttribute(name: string, value: string) {
    const attrNode = this.getAttributeNode(name);
    if (attrNode) {
      attrNode.value = value;
    } else {
      this.attributes.push(this._attributesByName[name] = new LightAttribute(name, value))
    }
  }
  removeAttribute(name: string) {
    const attrNode = this.getAttributeNode(name);
    if (attrNode) {
      this._attributesByName[name] = undefined;
      const index = this.attributes.indexOf(attrNode);
      this.attributes.splice(index, 1);
    }
  }
  hasAttribute(name: string) {
    return Boolean(this._attributesByName[name]);
  }
  getAttributeNode(name: string) {
    return this._attributesByName[name];
  }
  getAttribute(name) {
    const attr = this._attributesByName[name];
    return attr && attr.value;
  }
};

export class LightDocumentFragment extends LightParentNode {
  readonly nodeType = 11;
  readonly nodeName = "#document-fragment";
  constructor(source: SlimParentNode) {
    super(source);
  }
}

export class LightTextNode extends LightBaseNode {
  readonly nodeType = 3;
  readonly nodeValue: string;
  readonly nodeName: string = "#text";
  constructor(node: SlimTextNode) {
    super(node);
    this.nodeValue = node.value;
  }
}

export class LightDocument {
  readonly nodeType = 9;
  public documentElement: LightElement;
  private _elementsById: any;
  constructor() {
    this.documentElement = this.createElement("html");
    this.documentElement.childNodes[0] = this.createElement("head");
    
  }
  get body() {
    return this.documentElement.childNodes[1] as LightElement;
  }
  set body(value: LightBaseNode) {
    this._elementsById = {};
    this.documentElement.childNodes[1] = value;
    value.parentNode = this.documentElement;
  }
  createElement(tagName) {
    return new LightElement({
      tagName, 
      id: null,
      type: SlimVMObjectType.ELEMENT,
      attributes: [], 
      source: null, 
      shadow: null, 
      childNodes: []
    }, this);
  }
  getElementById(id: string) {
    if (this._elementsById[id]) {
      return this._elementsById[id];
    }
    let found: LightElement;
    traverseLightDOM(this.documentElement, (child) => {
      if (child.nodeType === 1 && (child as LightElement).getAttribute(id) === id) {
        found = child as LightElement;
        return false;
      }
    });

    return this._elementsById[id] = found;
  }
}