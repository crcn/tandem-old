import { IRange } from "sf-core/geom";
import { INode, IElement } from "sf-core/markup";
import { diffArray, patchArray } from "sf-core/utils/array";
import { BaseExpression, flattenEach } from "../core/expression";
// import { convert} from "./convertMeasurement";

export class CSSExpression extends BaseExpression { }

export const CSS_STYLE = "cssStyle";
export class CSSStyleExpression extends CSSExpression {
  private _declarationsByKey: any;
  private _values: any;

  constructor(public declarations: Array<CSSStyleDeclarationExpression>, public position: IRange) {
    super(CSS_STYLE, position);
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

  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.declarations, items);
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

export const CSS_STYLE_DECLARATION = "cssStyleDeclaration";
export class CSSStyleDeclarationExpression extends CSSExpression {
  constructor(public key: string, public value: CSSExpression, public position: IRange) {
    super(CSS_STYLE_DECLARATION, position);
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

  public _flattenDeep(items) {
    super._flattenDeep(items);
    this.value._flattenDeep(items);
  }

  toString() {
    if (this.key === "") return "";
    return [this.key, ": ", this.value.toString(), ";"].join("");
  }
}

export const CSS_LITERAL_VALUE = "cssLiteralValue";
export class CSSLiteralExpression extends CSSExpression {
  constructor(public value: string, public position: IRange) {
    super(CSS_LITERAL_VALUE, position);
  }
  toString() {
    return this.value;
  }
}

export const CSS_FUNCTION_CALL = "cssFunctionCall";
export class CSSFunctionCallExpression extends CSSExpression {
  constructor(public name: string, public parameters: Array<CSSExpression>, public position: IRange) {
    super(CSS_FUNCTION_CALL, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.parameters, items);
  }
  toString() {
    return [this.name, "(", this.parameters.join(","), ")"].join("");
  }
}

export const CSS_LIST_VALUE = "cssListValue";
export class CSSListValueExpression extends CSSExpression {
  constructor(public values: Array<CSSExpression>, public position: IRange) {
    super(CSS_LIST_VALUE, position);
  }
  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.values, items);
  }
  toString() {
    return this.values.join(" ");
  }
}

export const CSS_RULE = "cssRule";

export class CSSRuleExpression extends CSSExpression {
  constructor(public selector: CSSSelectorExpression, public style: CSSStyleExpression, position: IRange) {
    super(CSS_RULE, position);
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

export const CSS_STYLE_SHEET = "cssStyleSheet";
export class CSSStyleSheetExpression extends CSSExpression {

  constructor(public rules: Array<CSSRuleExpression>, position: IRange) {
    super(CSS_STYLE_SHEET, position);
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
  constructor(type: string, position: IRange) {
    super(type, position);
  }

  test(node: IElement): boolean {
    return false;
  }
}

// a, b { }
export const CSS_SELECTOR_LIST = "cssSelectorList";
export class CSSSelectorListExpression extends CSSSelectorExpression {
  constructor(public selectors: Array<CSSSelectorExpression>, position: IRange) {
    super(CSS_SELECTOR_LIST, position);
  }

  test(node: IElement): boolean {
    return isElement(node) && !!this.selectors.find((selector) => selector.test(node));
  }

  toString() {
    return this.selectors.join(" ");
  }
}

// .class-name { }
export const CSS_CLASS_NAME_SELECTOR = "cssClassNameSelector";
export class CSSClassNameSelectorExpression extends CSSSelectorExpression {
  constructor(public value: string, position: IRange) {
    super(CSS_CLASS_NAME_SELECTOR, position);
  }
  test(node: IElement): boolean {
    return node.hasAttribute("class") && node.getAttribute("class").indexOf(this.value) !== -1;
  }
  toString() {
    return "." + this.value;
  }
}

// # { }
export const CSS_ID_SELECTOR = "cssIdSelector";
export class CSSIDSelectorExpression extends CSSSelectorExpression {
  constructor(public value: string, position: IRange) {
    super(CSS_ID_SELECTOR, position);
  }
  test(node: IElement): boolean {
    return node.hasAttribute("id") && node.getAttribute("id").indexOf(this.value) !== -1;
  }
  toString() {
    return "#" + this.value;
  }
}

// * { }
export const CSS_ANY_SELECTOR = "cssAnySelector";
export class CSSAnySelectorExpression extends CSSSelectorExpression {
  constructor(public value: string, position: IRange) {
    super(CSS_ANY_SELECTOR, position);
  }
  test(node: IElement): boolean {
    return true;
  }
  toString() {
    return "*";
  }
}

// div { }
export const CSS_TAG_NAME_SELECTOR = "cssTagNameSelector";
export class CSSTagNameSelectorExpression extends CSSSelectorExpression {
  constructor(public value: string, position: IRange) {
    super(CSS_TAG_NAME_SELECTOR, position);
  }
  test(node: IElement): boolean {
    return String(node.nodeName).toUpperCase() === this.value.toUpperCase();
  }
  toString() {
    return this.value;
  }
}


export const CSS_CHILD_SELECTOR = "cssChildSelector";
export class CSSChildSelectorExpression extends CSSSelectorExpression {
  constructor(public parent: CSSSelectorExpression, public target: CSSSelectorExpression, position: IRange) {
    super(CSS_CHILD_SELECTOR, position);
  }
  test(node: IElement): boolean {
    return this.target.test(node) && node.parentNode && this.parent.test(<IElement>node.parentNode);
  }
  toString() {
    return `${this.parent} > ${this.target}`;
  }
}

export const CSS_DESCENDENT_SELECTOR = "cssDescendentSelector";
export class CSSDescendentSelectorExpression extends CSSSelectorExpression {
  constructor(public parent: CSSSelectorExpression, public target: CSSSelectorExpression, position: IRange) {
    super(CSS_DESCENDENT_SELECTOR, position);
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

export const CSS_SIBLING_SELECTOR = "cssSiblingSelector";
export class CSSSiblingSelectorExpression extends CSSSelectorExpression {
  constructor(public prev: CSSSelectorExpression, public target: CSSSelectorExpression, position) {
    super(CSS_SIBLING_SELECTOR, position);
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

export const CSS_AND_SELECTOR = "cssAndSelector";
export class CSSAndSelectorExpression extends CSSSelectorExpression {
  constructor(public left: CSSSelectorExpression, public right: CSSSelectorExpression, position: IRange) {
    super(CSS_AND_SELECTOR, position);
  }
  test(node: IElement) {
    return this.left.test(node) && this.right.test(node);
  }
  toString() {
    return `${this.left}${this.right}`;
  }
}

export const CSS_ATTRIBUTE_EXISTS_SELECTOR = "cssAttributeExistsSelector";
export class CSSAttributeExistsSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public position: IRange) {
    super(CSS_ATTRIBUTE_EXISTS_SELECTOR, position);
  }
  test(node: IElement) {
    return node.hasAttribute(this.name);
  }
  toString() {
    return `[${this.name}]`;
  }
}

export const CSS_ATTRIBUTE_EQUALS_SELECTOR = "cssAttributeEqualsSelector";
export class CSSAttributeEqualsSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, public position: IRange) {
    super(CSS_ATTRIBUTE_EQUALS_SELECTOR, position);
  }
  test(node: IElement) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name) === this.value;
  }
  toString() {
    return `[${this.name}="${this.value}"]`;
  }
}

export const CSS_ATTRIBUTE_CONTAINS_SELECTOR = "cssAttributeContainsSelector";
export class CSSAttributeContainsSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, public position: IRange) {
    super(CSS_ATTRIBUTE_CONTAINS_SELECTOR, position);
  }
  test(node: IElement) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).indexOf(this.value) !== -1;
  }
  toString() {
    return `[${this.name}*="${this.value}"]`;
  }
}

export const CSS_ATTRIBUTE_STARTS_WITH_SELECTOR = "cssAttributeStartsWithSelector";
export class CSSAttributeStartsWithSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, public position: IRange) {
    super(CSS_ATTRIBUTE_STARTS_WITH_SELECTOR, position);
  }
  test(node: IElement) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).indexOf(this.value) === 0;
  }
  toString() {
    return `[${this.name}^="${this.value}"]`;
  }
}

export const CSS_ATTRIBUTE_ENDS_WITH_SELECTOR = "cssAttributeEndsWithSelector";
export class CSSAttributeEndsWithSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, public position: IRange) {
    super(CSS_ATTRIBUTE_ENDS_WITH_SELECTOR, position);

  }
  test(node: IElement) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).lastIndexOf(this.value) === node.getAttribute(this.name).length - this.value.length;
  }
  toString() {
    return `[${this.name}$="${this.value}"]`;
  }
}
