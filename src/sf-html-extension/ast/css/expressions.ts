import { IRange } from "sf-core/geom";
import { BaseExpression } from "sf-core/ast";

import { diffArray, patchArray } from "sf-core/utils/array";

export abstract class CSSExpression extends BaseExpression<CSSExpression> {

  constructor(position: IRange) {
    super(null, position);
    this.type = this.constructor.name;
  }

  // TODO - make this abstract
  patch(source: CSSExpression) { }
}

export class CSSStyleExpression extends CSSExpression {
  private _declarationsByKey: any;
  private _values: any;

  constructor(public declarations: Array<CSSStyleDeclarationExpression>, public position: IRange) {
    super(position);
    this._reset();
  }

  private _reset() {
    this._declarationsByKey = {};
    this._values = {};

    for (const declaration of this.declarations) {
      this._declarationsByKey[declaration.key] = declaration;
      this._values[declaration.key] = declaration.value.toString();
    }
  }

  patch(b: CSSStyleExpression) {
    this.position = b.position;
    patchArray(this.declarations, diffArray(this.declarations, b.declarations, (a, b) => a .key === b.key), (a, b) => {
      a.patch(b);
      return a;
    });
    this._reset();
  }

  public updateDeclarations(style: Object) {
    for (let key in style) {
      const value = style[key];

      let declaration: CSSStyleDeclarationExpression;
      if ((declaration = this._declarationsByKey[key])) {
        declaration.value = value;
      } else {
        this.declarations.push(this._declarationsByKey[key] = new CSSStyleDeclarationExpression(key, value, null));
      }
      this._values[key] = value;
    }
  }

  get values() {
    return this._values;
  }

  public removeDeclaration(key: string) {
    for (let i = this.declarations.length; i--; ) {
      if (this.declarations[i].key === key) {
        this.declarations.splice(i, 1);
        break;
      }
    }
  }

  toString() {
    return this.declarations.join(" ");
  };
}

export class CSSStyleDeclarationExpression extends CSSExpression {
  constructor(public key: string, public value: CSSExpression, public position: IRange) {
    super(position);
  }

  patch(b: CSSStyleDeclarationExpression) {
    this.position = b.position;
    this.key = b.key;
    if (this.value.constructor === b.value.constructor) {
      this.value.patch(b);
    } else {
      this.value = b.value;
    }
  }

  /**
   * Converts the value unit to another format (px -> %. This, however, assumes that
   * the value actually contains a measurement. This method may not apply
   * for certain declarations such as text-align, display, position, and other styles.
   * In other workds, this is somewhat leaky.
   * @param {unit} string The  unit to convert to: %, em, px
   * @param {target} the target node that this unit applies to - needed for conversions such
   * as %
   */

  public convertValueMeasurement(unit: string, target: Node) {

  }

  toString() {
    if (this.key === "") return "";
    return [this.key, ": ", this.value.toString(), ";"].join("");
  }
}

export class CSSLiteralExpression extends CSSExpression {
  constructor(public value: string, public position: IRange) {
    super(position);
  }
  toString() {
    return this.value;
  }
}

export class CSSFunctionCallExpression extends CSSExpression {
  constructor(public name: string, public parameters: Array<CSSExpression>, public position: IRange) {
    super(position);
  }

  toString() {
    return [this.name, "(", this.parameters.join(","), ")"].join("");
  }
}

export class CSSListValueExpression extends CSSExpression {
  constructor(public values: Array<CSSExpression>, public position: IRange) {
    super(position);
  }

  toString() {
    return this.values.join(" ");
  }
}

export class CSSRuleExpression extends CSSExpression {
  readonly name: string;
  constructor(public selector: CSSSelectorExpression, public style: CSSStyleExpression, position: IRange) {
    super(position);
    this.name = selector ? selector.toString() : "";
  }

  patch(b: CSSRuleExpression) {
    this.position  = b.position;
    this.selector = b.selector;
    this.style.patch(b.style);
  }
  test(node: Element): boolean {
    return this.selector.test(node);
  }

  toString() {
    return `${this.selector} { ${this.style} }`;
  }
}


export class CSSStyleSheetExpression extends CSSExpression {

  constructor(public rules: Array<CSSRuleExpression>, position: IRange) {
    super(position);
  }

  patch(b: CSSStyleSheetExpression) {
    this.position = b.position;
    patchArray(this.rules, diffArray<CSSRuleExpression>(this.rules, b.rules, (a, b) => a.name === b.name), (a, b) => {
      a.patch(b);
      return a;
    });
  }

  toString() {
    return this.rules.join(" ");
  }
}

/**
 * SELECTORS
 */

export class CSSSelectorExpression extends CSSExpression {
  constructor(position: IRange) {
    super(position);
  }

  test(node: Element): boolean {
    return false;
  }
}

// a, b { }

export class CSSSelectorListExpression extends CSSSelectorExpression {
  constructor(public selectors: Array<CSSSelectorExpression>, position: IRange) {
    super(position);
  }


  test(node: Element): boolean {
    return isElement(node) && !!this.selectors.find((selector) => selector.test(node));
  }

  toString() {
    return this.selectors.join(",");
  }
}

// .class-name { }

export class CSSClassNameSelectorExpression extends CSSSelectorExpression {
  constructor(public value: string, position: IRange) {
    super(position);
  }
  test(node: Element): boolean {
    return isElement(node) && node.hasAttribute("class") && node.getAttribute("class").split(" ").indexOf(this.value) !== -1;
  }
  toString() {
    return "." + this.value;
  }
}

// # { }

export class CSSIDSelectorExpression extends CSSSelectorExpression {
  constructor(public value: string, position: IRange) {
    super(position);
  }
  test(node: Element): boolean {
    return node.hasAttribute("id") && node.getAttribute("id") === this.value;
  }
  toString() {
    return "#" + this.value;
  }
}

// * { }

export class CSSAnySelectorExpression extends CSSSelectorExpression {
  constructor(public value: string, position: IRange) {
    super(position);
  }
  test(node: Element): boolean {
    return true;
  }
  toString() {
    return "*";
  }
}

// div { }

export class CSSTagNameSelectorExpression extends CSSSelectorExpression {
  constructor(public value: string, position: IRange) {
    super(position);
  }
  test(node: Element): boolean {
    return String(node.nodeName).toUpperCase() === this.value.toUpperCase();
  }
  toString() {
    return this.value;
  }
}

export class CSSChildSelectorExpression extends CSSSelectorExpression {
  constructor(public parentSelector: CSSSelectorExpression, public target: CSSSelectorExpression, position: IRange) {
    super(position);
  }

  test(node: Element): boolean {
    return this.target.test(node) && node.parentNode && this.parentSelector.test(<Element>node.parentNode);
  }
  toString() {
    return `${this.parent} > ${this.target}`;
  }
}


export class CSSDescendentSelectorExpression extends CSSSelectorExpression {
  constructor(public parentSelector: CSSSelectorExpression, public target: CSSSelectorExpression, position: IRange) {
    super(position);
  }

  test(node: Element): boolean {
    const matchesTarget = this.target.test(node);
    let currentParent = node.parentNode;
    while (matchesTarget && currentParent) {
      if (this.parentSelector.test(<Element>currentParent)) return true;
      currentParent = currentParent.parentNode;
    }
    return false;
  }
  toString() {
    return `${this.parent} ${this.target}`;
  }
}


export class CSSSiblingSelectorExpression extends CSSSelectorExpression {
  constructor(public prev: CSSSelectorExpression, public target: CSSSelectorExpression, position: IRange) {
    super(position);
  }


  test(node: Element) {
    const parent = node.parentNode;

    if (!this.target.test(node)) return false;

    for (let i = Array.prototype.indexOf.call(parent.childNodes, node) - 1; i--; ) {
      if (this.prev.test(<Element>parent.childNodes[i])) return true;
    }

    return false;
  }
  toString() {
    return `${this.prev} ~ ${this.target}`;
  }
}

export class CSSAdjacentSiblingSelectorExpression extends CSSSelectorExpression {
  constructor(public prev: CSSSelectorExpression, public target: CSSSelectorExpression, position: IRange) {
    super(position);
  }

  test(node: Element) {
    return node.previousSibling && this.prev.test(<Element>node.previousSibling) && this.target.test(node);
  }
  toString() {
    return `${this.prev} + ${this.target}`;
  }
}

function isElement(node: Node) {
  return !!(<any>node).hasAttribute;
}

export class CSSPsuedoSelectorExpression extends CSSSelectorExpression {
  constructor(public selector: CSSSelectorExpression, public name: string, public rules: Array<CSSSelectorExpression>, position: IRange) {
    super(position);
  }

  test(node: Element) {
    return false;
  }

  toString() {
    return [this.selector, ":", this.name, this.rules.length ? `${this.rules.join(",")}` : ""].join("");
  }

  // TODO
  toDebuggableString() {
    return [this.selector, `[data-state-${this.name}]`].join("");
  }
}

export class CSSMediaExpression extends CSSSelectorExpression {
  readonly name: string;
  constructor(public query: string, public stylesheet: CSSStyleSheetExpression, position: IRange) {
    super(position);
    this.name = query;
  }

  patch() {

  }
  test(node: Element) {
    return false;
  }

  toString() {
    return ["@media", this.query, "{", this.stylesheet, "}"].join(" ");
  }
}

export class CSSKeyFramesExpression extends CSSSelectorExpression {
  constructor(public name: string, public keyframes: Array<CSSKeyFrameExpression>, position: IRange) {
    super(position);
  }
  patch() {

  }

  test(node: Element) {
    return false;
  }

  toString() {
    return ["@keyframes", this.name, "{", this.keyframes.join(""), "}"].join(" ");
  }
}

export class CSSKeyFrameExpression extends CSSSelectorExpression {
  constructor(public start: number, public style: CSSStyleDeclarationExpression, position: IRange) {
    super(position);
  }

  test(node: Element) {
    return false;
  }

  toString() {
    return [this.start + "%", "{", this.style, "}"].join(" ");
  }
}

export class CSSAndSelectorExpression extends CSSSelectorExpression {
  constructor(public left: CSSSelectorExpression, public right: CSSSelectorExpression, position: IRange) {
    super(position);
  }

  test(node: Element) {
    return this.left.test(node) && this.right.test(node);
  }
  toString() {
    return `${this.left}${this.right}`;
  }
}


export class CSSAttributeExistsSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public position: IRange) {
    super(position);
  }
  test(node: Element) {
    return node.hasAttribute(this.name);
  }
  toString() {
    return `[${this.name}]`;
  }
}


export class CSSAttributeEqualsSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, public position: IRange) {
    super(position);
  }
  test(node: Element) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name) === this.value;
  }
  toString() {
    return `[${this.name}="${this.value}"]`;
  }
}


export class CSSAttributeContainsSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, public position: IRange) {
    super(position);
  }
  test(node: Element) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).indexOf(this.value) !== -1;
  }
  toString() {
    return `[${this.name}*="${this.value}"]`;
  }
}


export class CSSAttributeStartsWithSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, public position: IRange) {
    super(position);
  }
  test(node: Element) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).indexOf(this.value) === 0;
  }
  toString() {
    return `[${this.name}^="${this.value}"]`;
  }
}


export class CSSAttributeEndsWithSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, public position: IRange) {
    super(position);

  }
  test(node: Element) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).lastIndexOf(this.value) === node.getAttribute(this.name).length - this.value.length;
  }
  toString() {
    return `[${this.name}$="${this.value}"]`;
  }
}
