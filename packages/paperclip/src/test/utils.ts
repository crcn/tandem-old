import { SlimBaseNode, SlimCSSMediaRule, SlimVMObjectType, SlimElement, SlimTextNode, SlimParentNode, SlimStyleElement, SlimCSSGroupingRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElementAttribute, SlimFragment } from "slim-dom";

export const stringifyNode = (node: SlimBaseNode) => {
  switch(node.type) {
    case SlimVMObjectType.TEXT: {
      const text = node as SlimTextNode;
      return text.value;
    }
    case SlimVMObjectType.ELEMENT: {
      const element = node as SlimElement;
      let buffer = `<${element.tagName}`;
      for (const attribute of element.attributes) {
        if (typeof attribute.value === "object") {
          continue;
        }
        buffer += ` ${attribute.name}="${attribute.value}"`;
      }
      buffer += `>`;
      if (element.shadow) {
        buffer += `<#shadow>${stringifyNode(element.shadow)}</#shadow>`;
      }

      buffer += element.childNodes.map(stringifyNode).join("");
      if (element.tagName === "style") {
        buffer += stringifyStyleSheet((element as SlimStyleElement).sheet);
      }
      buffer += `</${element.tagName}>`;
      return buffer;
    }
    case SlimVMObjectType.DOCUMENT_FRAGMENT: 
    case SlimVMObjectType.DOCUMENT: {
      return (node as SlimParentNode).childNodes.map(stringifyNode).join("");
    }
  }
};

const stringifyStyleSheet = (sheet: SlimCSSRule) => {
  switch(sheet.type) {
    case SlimVMObjectType.STYLE_SHEET: {
      return (sheet as SlimCSSStyleSheet).rules.map(stringifyStyleSheet).join(" ");
    }
    case SlimVMObjectType.STYLE_RULE: {
      const rule = sheet as SlimCSSStyleRule;
      let buffer = `${rule.selectorText} {`;
      for (const key in rule.style) {
        if (key === "id" || rule.style[key] == null) continue;
        buffer += `${key}:${rule.style[key]};`
      }
      buffer += `}`
      return buffer;
    }
    case SlimVMObjectType.MEDIA_RULE: {
      const rule = sheet as SlimCSSMediaRule;
      let buffer = `${rule.conditionText} {`;
      buffer += rule.rules.map(stringifyStyleSheet).join("");
      buffer += `}`
      return buffer;
    }
  }
}

abstract class FakeBaseNode {
  readonly childNodes: FakeBaseNode[] = [];
  constructor(readonly ownerDocument: FakeDocument) {

  }
  abstract toString(); 
}

class FakeParentNode extends FakeBaseNode {
  constructor(ownerDocument: FakeDocument) {
    super(ownerDocument);
  }
  appendChild(child: FakeBaseNode) {
    if (child instanceof FakeDocumentFragment) {
      for (const subChild of child.childNodes)  {
        this.appendChild(subChild);
      }
    } else {
      this.childNodes.push(child);
    }
  }
  removeChild(child: FakeBaseNode) {
    const index = this.childNodes.indexOf(child);
    if (index !== -1) {
      this.childNodes.splice(index, 1);
    } else {
      throw new Error(`child does not exist`);
    }
  }
  insertBefore(newChild: FakeBaseNode, refChild: FakeBaseNode) {
    const index = this.childNodes.indexOf(refChild);
    if (index === -1) {
      throw new Error(`ref child does not exist`);
    }
    this.childNodes.splice(index, 0, newChild);
  }
  toString() {
    return this.childNodes.map(child => child.toString()).join("");
  }
}

export class FakeDocumentFragment extends FakeParentNode {

}

export class FakeAttribute {
  constructor(public name: string, public value: string) {

  }
}

export class FakeElement extends FakeParentNode {
  readonly attributes: FakeAttribute[] = [];
  private _shadowRoot: FakeDocumentFragment;
  constructor(readonly tagName: string, ownerDocument: FakeDocument) {
    super(ownerDocument);
  }
  removeAttribute(name: string) {
    const index = this.attributes.findIndex((attr) => attr.name === name);
    if (index !== -1) {
      this.attributes.splice(index, 1);
    }
  }
  attachShadow() {
    if (this._shadowRoot) {
      throw new Error(`Cannot re-attach shadow root`);
    }
    return this._shadowRoot = this.ownerDocument.createDocumentFragment();
  }
  get shadowRoot() {
    return this._shadowRoot;
  }
  setAttribute(name: string, value: string) {
    const index = this.attributes.findIndex((attr) => attr.name === name);
    if (index !== -1) {
      this.attributes[index].value = value;
    } else {
      this.attributes.push(new FakeAttribute(name, value));
    }
  }
  toString() {
    let buffer = `<${this.tagName}`;
    for (const { name, value } of this.attributes) {
      buffer += ` ${name}="${value}"`
    }
    buffer += `>`;
    buffer += super.toString();
    buffer += `</${this.tagName}>`;
    return buffer;
  }
}

export class FakeTextNode extends FakeBaseNode {
  constructor(public nodeValue: string, ownerDocument: FakeDocument) {
    super(ownerDocument);
  }
  toString() {
    return this.nodeValue;
  }
}

export class FakeDocument {
  createElement(tagName: string) {
    return new FakeElement(tagName, this);
  }
  createTextNode(nodeValue: string) {
    return new FakeTextNode(nodeValue, this);
  }
  createDocumentFragment() {
    return new FakeDocumentFragment(this);
  }
};