import { IRange } from "sf-core/geom";
import { BaseExpression } from "sf-core/expressions";
import { INode, IElement } from "sf-core/markup";
import { diffArray, patchArray } from "sf-core/utils/array";

export class CSSExpression extends BaseExpression { }

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

  static merge(a: CSSStyleExpression, b: CSSStyleExpression): CSSStyleExpression {
    a.position = b.position;
    patchArray(a.declarations, diffArray(a.declarations, b.declarations, (a, b) => a .key === b.key), CSSStyleDeclarationExpression.merge);
    a._reset();
    return a;
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

  static merge(a: CSSStyleDeclarationExpression, b: CSSStyleDeclarationExpression): CSSStyleDeclarationExpression {
    a.position = b.position;
    a.key = b.key;
    if (a.value.constructor === b.value.constructor && (<any>a.value.constructor).merge) {
      (<any>a.value.constructor).merge(a.value, b.value);
    } else {
      a.value = b.value;
    }

    return a;
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
  constructor(public selector: CSSSelectorExpression, public style: CSSStyleExpression, position: IRange) {
    super(position);
  }
  test(node: IElement): boolean {
    return this.selector.test(node);
  }
  static merge(a: CSSRuleExpression, b: CSSRuleExpression) {
    a.position  = b.position;
    a.selector = b.selector;
    CSSStyleExpression.merge(a.style, b.style);
  }

  toString() {
    return `${this.selector} { ${this.style} }`;
  }
}

export class CSSStyleSheetExpression extends CSSExpression {

  constructor(public rules: Array<CSSRuleExpression>, position: IRange) {
    super(position);
  }

  static merge(a: CSSStyleSheetExpression, b: CSSStyleSheetExpression) {
    a.position = b.position;
    patchArray(a.rules, diffArray<CSSRuleExpression>(a.rules, b.rules, (a, b) => a.selector.toString() === b.selector.toString()), (a, b) => {
      CSSRuleExpression.merge(a, b);
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

  test(node: IElement): boolean {
    return false;
  }
}

// a, b { }

export class CSSSelectorListExpression extends CSSSelectorExpression {
  constructor(public selectors: Array<CSSSelectorExpression>, position: IRange) {
    super(position);
  }

  test(node: IElement): boolean {
    return isElement(node) && !!this.selectors.find((selector) => selector.test(node));
  }

  toString() {
    return this.selectors.join(" ");
  }
}

// .class-name { }

export class CSSClassNameSelectorExpression extends CSSSelectorExpression {
  constructor(public value: string, position: IRange) {
    super(position);
  }
  test(node: IElement): boolean {
    return node.hasAttribute("class") && node.getAttribute("class").indexOf(this.value) !== -1;
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
  test(node: IElement): boolean {
    return node.hasAttribute("id") && node.getAttribute("id").indexOf(this.value) !== -1;
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
  test(node: IElement): boolean {
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
  test(node: IElement): boolean {
    return String(node.nodeName).toUpperCase() === this.value.toUpperCase();
  }
  toString() {
    return this.value;
  }
}



export class CSSChildSelectorExpression extends CSSSelectorExpression {
  constructor(public parent: CSSSelectorExpression, public target: CSSSelectorExpression, position: IRange) {
    super(position);
  }
  test(node: IElement): boolean {
    return this.target.test(node) && node.parentNode && this.parent.test(<IElement>node.parentNode);
  }
  toString() {
    return `${this.parent} > ${this.target}`;
  }
}


export class CSSDescendentSelectorExpression extends CSSSelectorExpression {
  constructor(public parent: CSSSelectorExpression, public target: CSSSelectorExpression, position: IRange) {
    super(position);
  }
  test(node: IElement): boolean {
    const matchesTarget = this.target.test(node);
    let currentParent = node.parentNode;
    while (matchesTarget && currentParent) {
      if (this.parent.test(<IElement>currentParent)) return true;
      currentParent = currentParent.parentNode;
    }
    return false;
  }
  toString() {
    return `${this.parent} ${this.target}`;
  }
}


export class CSSSiblingSelectorExpression extends CSSSelectorExpression {
  constructor(public prev: CSSSelectorExpression, public target: CSSSelectorExpression, position) {
    super(position);
  }
  test(node: IElement) {
    return node.previousSibling && this.prev.test(<IElement>node.previousSibling) && this.target.test(node);
  }
  toString() {
    return `${this.prev} + ${this.target}`;
  }
}

function isElement(node: INode) {
  return node.nodeName && node.nodeName.substr(0, 1) !== "#";
}


export class CSSAndSelectorExpression extends CSSSelectorExpression {
  constructor(public left: CSSSelectorExpression, public right: CSSSelectorExpression, position: IRange) {
    super(position);
  }
  test(node: IElement) {
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
  test(node: IElement) {
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
  test(node: IElement) {
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
  test(node: IElement) {
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
  test(node: IElement) {
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
  test(node: IElement) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).lastIndexOf(this.value) === node.getAttribute(this.name).length - this.value.length;
  }
  toString() {
    return `[${this.name}$="${this.value}"]`;
  }
}
