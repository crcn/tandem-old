import { SlimBaseNode, SlimCSSAtRule, SlimVMObjectType, SlimElement, SlimTextNode, SlimParentNode, SlimStyleElement, SlimCSSGroupingRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElementAttribute, SlimFragment } from "slim-dom";
import { sample, sampleSize, random } from "lodash";

export const stringifyNode = (node: SlimBaseNode) => {
  switch(node.type) {
    case SlimVMObjectType.TEXT: {
      const text = node as SlimTextNode;
      return text.value;
    }
    case SlimVMObjectType.ELEMENT: {
      const element = node as SlimElement;
      let buffer = `<${element.tagName}`;
      const attrBuffer = [];
      for (const attribute of element.attributes) {
        if (typeof attribute.value === "object") {
          continue;
        }
        attrBuffer.push(` ${attribute.name}="${attribute.value}"`);
      }
      buffer += attrBuffer.sort().join("") + `>`;
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
  public parentNode: FakeParentNode;
  readonly childNodes: FakeBaseNode[] = [];
  constructor(readonly ownerDocument: FakeDocument) {

  }
  get nextSibling() {
    return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1];
  }
  get previousSibling() {
    return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1];
  }
  abstract toString(); 
}

class FakeParentNode extends FakeBaseNode {
  constructor(ownerDocument: FakeDocument) {
    super(ownerDocument);
  }
  appendChild(child: FakeBaseNode) {
    if (child instanceof FakeDocumentFragment) {
      const childen = [...child.childNodes];
      for (const subChild of childen)  {
        this.appendChild(subChild);
      }
    } else {
      if (child.parentNode) {
        child.parentNode.removeChild(child);
      }
      child.parentNode = this;
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
    if (newChild.parentNode) {
      newChild.parentNode.removeChild(newChild);
    }
    const index = this.childNodes.indexOf(refChild);
    newChild.parentNode = this;
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
    let attrBuffer = [];
    for (const { name, value } of this.attributes) {
      attrBuffer.push(` ${name}="${value}"`);
    }
    buffer += attrBuffer.sort().join("") + `>`;
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
    return this.nodeValue.trim();
  }
}

export class FakeComment extends FakeBaseNode {
  readonly nodeType = 8;
  constructor(public text: string, ownerDocument: FakeDocument) {
    super(ownerDocument);
  }
  toString() {
    return `<!--${this.text.trim()}-->`;
  }
}

class FakeCSSObject {
  public parentRule: FakeCSSObject;
  public parentStyleSheet: FakeCSSStyleSheet;
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
    this._linkRule(rule);
    this.cssRules.splice(index, 0, rule);
  }
  deleteRule(index: number) {
    this.cssRules.splice(index, 1);
  }
  protected _linkRule(rule: FakeCSSObject) {
    rule.parentRule = this;
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
    } else if (name === "keyframes") {
      return new FakeCSSKeyframesRule(params, parseDeclarationBlock(source));
    } else {
      throw new Error(`Cannot create ${name} at rule for now.`);
    }
  } else {
    const [match, selectorText] = source.match(/(.*?){/);
    return new FakeCSSStyleRule(selectorText, parseStyleDeclaration(source));
  }
}

const parseDeclarationBlock = (source: string, factory = parseCSSRule): FakeCSSObject[] => (getInnerBlock(source).match(/.*?{[\s\S]*?}/g) || []).map(factory);
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
  readonly type = 4;
  constructor(public conditionText: string, cssRules: FakeCSSObject[] = []) {
    super(cssRules);
  }
  toString() {
    return `@media ${this.conditionText.trim()} { ${super.toString()} }`;
  }
}

export class FakeCSSKeyframesRule extends FakeCSSGroupingRule {
  readonly type = 7;
  constructor(public name: string, cssRules: FakeCSSObject[] = []) {
    super(cssRules);
  }
  toString() {
    return `@keyframes ${this.name.trim()} { ${super.toString()} }`;
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
  removeProperty(name: string) {
    delete this[name];
  }
  setProperty(name: string, value: string) {
    this[name] = value;
  }
  toString() {
    let buffer = [];
    
    for (const key in this) {
      const value: string = this[key];
      if ((this as Object).hasOwnProperty(key)) {
        buffer.push(`${key}: ${value.trim()}`);
      }
    }
    return buffer.sort().join(";");
  }
}

export class FakeCSSStyleSheet extends FakeCSSGroupingRule {
  protected _linkRule(child: FakeCSSObject) {
    super._linkRule(child);
    child.parentStyleSheet = this;
  }
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
  createComment(nodeValue: string) {
    return new FakeComment(nodeValue, this);
  }
  createDocumentFragment() {
    return new FakeDocumentFragment(this);
  }
};

const CHARS = "abcdefghijkl".split("");

function generateRandomText(maxLength: number = 5) {
  return sampleSize(CHARS, random(1, maxLength)).join("");
}

function generateRandomChar() {
  return sample(CHARS);
}

export const generateRandomStyleSheet = (maxRules: number = 10, maxDeclarations: number = 20) => {

  function createKeyFramesRule() {
    return ` @keyframes ${generateRandomChar()} {` +
      Array.from({ length: random(1, maxRules) }).map((v, i) => Math.round(Math.random() * 100)).sort().map((v) => {
        return createKeyframeRule(v);
      }).join(" ") +
    `}`;
  }
  function createKeyframeRule(perc: number) {
    return ` ${perc}% {` +
      Array.from({ length: random(1, maxDeclarations) }).map((v) => {
        return ` ${generateRandomChar()}: ${generateRandomText(2)};`;
      }).join("") +
    `}`
  }
  function createStyleRule() {
    return ` .${generateRandomChar()} {` +
      Array.from({ length: random(1, maxDeclarations) }).map((v) => {
        return ` ${generateRandomChar()}: ${generateRandomText(2)};`;
      }).join("") +
    `}`;
  }
  function createMediaRule() {
    return ` @media ${generateRandomChar()} {` +
      Array.from({ length: random(1, maxRules) }).map((v) => {
        return sample([createStyleRule, createKeyFramesRule])();
      }).join(" ") +
    `}`;
  }

  const randomStyleSheet = Array
  .from({ length: random(1, maxRules) })
  .map(v => sample([createStyleRule, createMediaRule, createKeyFramesRule])()).join(" ");


  return randomStyleSheet;
}

type RandomComponentInfo = {
  id: string;
  slotNames: string[];
};

export const generateRandomComponents = (maxComponents: number = 4, maxAttributes: number = 5, maxSlots: number = 3, maxNodeDepth: number = 2, maxChildNodes: number = 4, maxStyleRules: number = 4, maxStyleDeclarations: number = 4) => {

  const components: RandomComponentInfo[] = [];

  function createComponent(v, i) {
    const id = "component" + i;
    const slotNames = Array.from({ length: random(0, maxSlots) }).map((v, i) => `${generateRandomChar()}${i}`);
    const info: RandomComponentInfo = {
      id,
      slotNames
    };
    
    let buffer = `<component id="${id}">` +
      createStyle() +
      createTemplate(info) +
      createPreview(info) +
    `</component>`;

    components.push(info);
    return buffer;
  }

  function createStyle() {
    if (!maxStyleRules || Math.random() < 0.2) {
      return "";
    }
    return `<style>` +
      generateRandomStyleSheet(maxStyleRules, maxStyleDeclarations) +
    `</style>`;
  }
  
  function createTemplate({ id, slotNames }: RandomComponentInfo) {
    return `<template>` +
      Array.from({ length: random(1, 10) }).map((v, i) => {
        return generateRandomElement(0, slotNames[random(0, slotNames.length - 1)])
      }).join("") +
    `</template>`;
  }

  function createPreview({ id, slotNames }: RandomComponentInfo) {
    return `<preview name="main">` +
      createComponentElement({ id, slotNames }) +
    `</preview>`;
  }
  
  function createComponentElement({id, slotNames}: RandomComponentInfo, depth: number = 0, unclaimedSlotName: string = null) {
    return `<${id} ${generateRandomAttributes()}>` +
    slotNames.slice(0, random(0, depth > maxNodeDepth ? 0 : slotNames.length)).map(slotName => {
      const tagName = generateRandomChar();
      `<${tagName} slot="${slotName}">` +
        generateRandomElement(depth, unclaimedSlotName);
      `</${tagName}>`
    }).join("") +
  `</${id}>` ;
  }

  function generateRandomComponentElement(depth: number = 0, unclaimedSlotName: string = null) {
    return components.length ? createComponentElement(sample(components), depth, unclaimedSlotName) : generateRandomElement(depth, unclaimedSlotName);
  }
  
  function generateRandomElement(depth: number = 0, unclaimedSlotName: string = null) {
    const claimSlotName = unclaimedSlotName && Math.random() < 0.5;
    if (!claimSlotName && Math.random() < 0.5) {
      return generateRandomComponentElement(depth, unclaimedSlotName);
    }
    const tagName = claimSlotName ? "slot" : generateRandomChar();
    return `<${tagName} ${claimSlotName ? `name="${unclaimedSlotName}"` : generateRandomAttributes()}>` +
      Array.from({ length: random(0, depth < maxNodeDepth ? maxChildNodes : 0 )}).map(() => generateRandomNode(depth + 1, unclaimedSlotName)).join("") +
    `</${tagName}>`;
  }

  function generateRandomNode(depth: number = 0, unclaimedSlotName) {
    return sample([
      generateRandomElement,
      generateRandomTextNode
    ])(depth, unclaimedSlotName);
  }

  function generateRandomTextNode() {
    return `${generateRandomText(5)}`;
  }

  function generateRandomAttributes() {
    return Array.from({ length: random(1, maxAttributes) }).map(() => {
      return `${generateRandomChar()}="${generateRandomText(2)}"`
    }).join(" ");
  }

  const randomComponents = Array
  .from({ length: random(1, maxComponents) })
  .map(createComponent).join(" ");


  return randomComponents;
}
