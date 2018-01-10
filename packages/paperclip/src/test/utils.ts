import { SlimBaseNode, SlimCSSAtRule, SlimVMObjectType, SlimElement, SlimTextNode, SlimParentNode, SlimStyleElement, SlimCSSGroupingRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElementAttribute, SlimFragment } from "slim-dom";

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
      for (const {name, value} of rule.style) {
        buffer += `${name}:${value};`
      }
      buffer += `}`
      return buffer;
    }
    case SlimVMObjectType.AT_RULE: {
      const { name, params, rules } = sheet as SlimCSSAtRule;
      return /^(charset|import)$/.test(name) ? `@${name} "${params}";` : `@${name} ${params} {${rules.map(stringifyStyleSheet).join("")}}`;
    }
  }
}

abstract class FakeBaseNode {
  public parentNode: FakeBaseNode;
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
    child.parentNode = this;
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
    return this.childrenToString();
  }
  childrenToString() {
    return this.childNodes.map(child => child.toString()).join("");
  }
}

export class FakeDocumentFragment extends FakeParentNode {
  readonly nodeType = 11;
}

export class FakeAttribute {
  constructor(public name: string, public value: string) {

  }
}

export class FakeElement extends FakeParentNode {
  readonly attributes: FakeAttribute[] = [];
  readonly dataset: any = {};
  private _shadowRoot: FakeDocumentFragment;
  readonly nodeType = 1;
  constructor(readonly tagName: string, ownerDocument: FakeDocument) {
    super(ownerDocument);
  }
  get classList() {
    return {
      add: (...classNames: string[]) => {
        const prevClass = this.getAttribute("class");
        this.setAttribute("class", (prevClass ? [prevClass] : []).concat(classNames).join(" "));
      }
    }
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
  getAttribute(name: string) {
    const attr = this.attributes.find(attr => attr.name === name);
    return attr && attr.value;
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

export class FakeStyleElement extends FakeElement {
  readonly sheet: FakeCSSStyleSheet;
  constructor(tagName: string, ownerDocument: FakeDocument) {
    super(tagName, ownerDocument);
    this.sheet = new FakeCSSStyleSheet();
  }
  childrenToString() {
    return this.sheet.toString();
  }
  
}

export class FakeTextNode extends FakeBaseNode {
  readonly nodeType = 3;
  constructor(public nodeValue: string, ownerDocument: FakeDocument) {
    super(ownerDocument);
  }
  toString() {
    return this.nodeValue;
  }
}

class FakeCSSObject {
  constructor() {

  }
}

class FakeCSSGroupingRule extends FakeCSSObject {
  readonly cssRules: FakeCSSObject[];
  constructor(cssRules: FakeCSSObject[] = []) {
    super();
    this.cssRules = [...cssRules];
  }
  insertRule(ruleSource: string, index: number = Number.MAX_SAFE_INTEGER) {
    const rule = parseCSSRule(ruleSource);
    this.cssRules.splice(index, 0, rule);
  }
  deleteRule(index: number) {
    this.cssRules.splice(index, 1);
  }
  toString() {
    return this.cssRules.join(" ");
  }
}

const parseCSSRule = (source: string): FakeCSSObject => {
  if (/@\w+\s+.*?{/.test(source)) {
    const [match, name, params] = source.match(/@(\w+)\s+(.*?){/);
    if (name === "media") {
      return new FakeCSSMediaRule(params, parseDeclarationBlock(source));
    } else {
      throw new Error(`Cannot create ${name} at rule for now.`);
    }
  } else {
    const [match, selectorText] = source.match(/(.*?){/);
      return new FakeCSSStyleRule(selectorText, parseStyleDeclaration(source));
  }
}

const parseDeclarationBlock = (source: string): FakeCSSObject[] => (getInnerBlock(source).match(/.*?{[\s\S]*?}/g) || []).map(parseCSSRule);
const parseStyleDeclaration = (source: string): FakeCSSStyle => {
  const style = new FakeCSSStyle();
  const inner = getInnerBlock(source);
  for (const property of inner.split(";")) {
    const [name, value] = property.trim().split(":");
    if (name.trim()) {
      style[name.trim()] = value.trim();
    }
  }

  return style;
}

const getInnerBlock = (source: string) => {
  source = source.substr(source.indexOf("{") + 1);
  source = source.substr(0, source.lastIndexOf("}"))
  return source;
}

export class FakeCSSMediaRule extends FakeCSSGroupingRule {
  constructor(public conditionText: string, cssRules: FakeCSSObject[] = []) {
    super(cssRules);
  }
  toString() {
    return `@media ${this.conditionText} { ${super.toString()} }`;
  }
}

export class FakeCSSStyleRule extends FakeCSSObject {
  constructor(public selectorText: string, readonly style: FakeCSSStyle) {
    super();
  }
  toString() {
    return `${this.selectorText.trim()} { ${this.style.toString()} }`;
  }
}

export class FakeCSSStyle extends FakeCSSObject {
  [identifier: string]: any;
  constructor() {
    super();
  }
  toString() {
    let buffer = [];
    for (const key in this) {
      const value = this[key];
      if ((this as Object).hasOwnProperty(key)) {
        buffer.push(`${key}: ${value}`);
      }
    }
    return buffer.join(";");
  }
}

export class FakeCSSStyleSheet extends FakeCSSGroupingRule {
}

export class FakeDocument {
  createElement(tagName: string) {
    switch(tagName) {
      case "style": return new FakeStyleElement(tagName, this);
      default: return new FakeElement(tagName, this);
    }
  }
  createTextNode(nodeValue: string) {
    return new FakeTextNode(nodeValue, this);
  }
  createDocumentFragment() {
    return new FakeDocumentFragment(this);
  }
};