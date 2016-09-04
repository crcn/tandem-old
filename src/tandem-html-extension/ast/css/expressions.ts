import {
  IRange,
  diffArray,
  patchArray,
  TreeNodeAction,
  BaseExpression,
} from "tandem-common";

export abstract class CSSExpression extends BaseExpression<CSSExpression> {

  constructor(source: string, position: IRange) {
    super(source, position);
  }

  // TODO - make this abstract
  patch(source: CSSExpression) { }

}

export class CSSStyleExpression extends CSSExpression {
  private _declarationsByKey: any = {};
  private _values: any = {};

  constructor(declarations: Array<CSSStyleDeclarationExpression>, source: string, position: IRange) {
    super(source, position);
    declarations.forEach((declaration) => this.appendChild(declaration));
  }

  get declarations(): Array<CSSStyleDeclarationExpression> {
    return <any>this.children;
  }

  public updateDeclarations(style: Object) {
    for (let key in style) {
      const value = style[key];

      let declaration: CSSStyleDeclarationExpression;
      if ((declaration = this._declarationsByKey[key])) {
        declaration.value = new CSSLiteralExpression(value, null, null);
      } else {
        this.appendChild(new CSSStyleDeclarationExpression(key, new CSSLiteralExpression(value, this.source, null), null, null));
      }
      this._values[key] = value;
    }
  }

  protected onChildAdded(declaration: CSSStyleDeclarationExpression) {
    super.onChildAdded(declaration);
    this._declarationsByKey[declaration.key] = declaration;
    this._values[declaration.key] = String(declaration.value);
  }

  protected onRemovingChild(declaration: CSSStyleDeclarationExpression) {
    super.onRemovingChild(declaration);
    this._declarationsByKey[declaration.key] =  undefined;
    this._values[declaration.key] = undefined;
  }

  get values() {
    return this._values;
  }

  public removeDeclaration(key: string) {
    if (this._declarationsByKey[key]) {
      this.removeChild(this._declarationsByKey[key]);
    }
  }

  toString() {
    return this.declarations.join("");
  };
}

export class CSSStyleDeclarationExpression extends CSSExpression {
  constructor(public key: string, value: CSSExpression, source: string, position: IRange) {
    super(source, position);
    this.appendChild(value);
  }

  set value(value: CSSExpression) {
    this.removeChild(this.value);
    this.appendChild(value);
  }

  get value(): CSSExpression {
    return <any>this.children[0];
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
    return [this.getWhitespaceBeforeStart(), this.key, ": ", this.value.toString(), ";", this.parent.lastChild === this ? this.getWhitespaceAfterEnd() : ""].join("");
  }
}

export class CSSLiteralExpression extends CSSExpression {
  constructor(public value: string, source: string, position: IRange) {
    super(source, position);
  }
  toString() {
    return this.value;
  }
}

export class CSSFunctionCallExpression extends CSSExpression {
  constructor(public name: string, parameters: Array<CSSExpression>, source, position: IRange) {
    super(source, position);
    parameters.forEach((param) => this.appendChild(param));
  }

  get parameters(): Array<CSSExpression> {
    return <any>this.children;
  }

  toString() {
    return [this.name, "(", this.parameters.join(","), ")"].join("");
  }
}

export class CSSListValueExpression extends CSSExpression {
  constructor(public values: Array<CSSExpression>, source, position: IRange) {
    super(source, position);
  }

  toString() {
    return this.values.join(" ");
  }
}

export class CSSRuleExpression extends CSSExpression {
  readonly name: string;
  constructor(selector: CSSSelectorExpression, style: CSSStyleExpression, source: string, position: IRange) {
    super(source, position);
    this.name = selector ? selector.toString() : "";
    this.appendChild(selector);
    this.appendChild(style);
  }

  get selector(): CSSSelectorExpression {
    return <any>this.children[0];
  }

  get style(): CSSStyleExpression {
    return <any>this.children[1];
  }

  test(node: Element): boolean {
    return this.selector.test(node);
  }

  toString() {
    return [
      this.getWhitespaceBeforeStart() || " ",
      this.selector.toString(),
      " {",
      this.style.toString(),
      "}",
      this.parent.lastChild === this ? this.getWhitespaceAfterEnd() : ""
    ].join("");
  }
}


export class CSSStyleSheetExpression extends CSSExpression {

  constructor(rules: Array<CSSRuleExpression>, source: string, position: IRange) {
    super(source, position);
    rules.forEach((child) => this.appendChild(child));
  }

  get rules(): Array<CSSRuleExpression> {
    return <any>this.children;
  }

  toString() {
    return this.children.join("");
  }
}

/**
 * SELECTORS
 */

export abstract class CSSSelectorExpression extends CSSExpression {
  constructor(source: string, position: IRange) {
    super(source, position);
  }

  test(node: Element): boolean {
    return false;
  }
}

// a, b { }

export class CSSSelectorListExpression extends CSSSelectorExpression {
  constructor(selectors: Array<CSSSelectorExpression>, source: string, position: IRange) {
    super(source, position);
    selectors.forEach((selector) => this.appendChild(selector));
  }

  get selectors(): Array<CSSSelectorExpression> {
    return <any>this.children;
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
  constructor(public value: string, source: string, position: IRange) {
    super(source, position);
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
  constructor(public value: string, source: string, position: IRange) {
    super(source, position);
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
  constructor(source: string, position: IRange) {
    super(source, position);
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
  constructor(public value: string, source: string, position: IRange) {
    super(source, position);
  }
  test(node: Element): boolean {
    return String(node.nodeName).toUpperCase() === this.value.toUpperCase();
  }
  toString() {
    return this.value;
  }
}

export class CSSChildSelectorExpression extends CSSSelectorExpression {
  constructor(parentSelector: CSSSelectorExpression, target: CSSSelectorExpression, source: string, position: IRange) {
    super(source, position);
    this.appendChild(parentSelector);
    this.appendChild(target);
  }

  get parentSelector(): CSSSelectorExpression {
    return <any>this.children[0];
  }

  get target(): CSSSelectorExpression {
    return <any>this.children[1];
  }

  test(node: Element): boolean {
    return this.target.test(node) && node.parentNode && this.parentSelector.test(<Element>node.parentNode);
  }
  toString() {
    return `${this.parentSelector} > ${this.target}`;
  }
}


export class CSSDescendentSelectorExpression extends CSSSelectorExpression {
  constructor(parentSelector: CSSSelectorExpression, target: CSSSelectorExpression, source: string, position: IRange) {
    super(source, position);
    this.appendChild(parentSelector);
    this.appendChild(target);
  }

  get parentSelector(): CSSSelectorExpression {
    return <any>this.children[0];
  }

  get target(): CSSSelectorExpression {
    return <any>this.children[1];
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
    return `${this.parentSelector} ${this.target}`;
  }
}


export class CSSSiblingSelectorExpression extends CSSSelectorExpression {
  constructor(prev: CSSSelectorExpression, target: CSSSelectorExpression, source: string, position: IRange) {
    super(source, position);
    this.appendChild(prev);
    this.appendChild(target);
  }

  get prev(): CSSSelectorExpression {
    return <any>this.children[0];
  }

  get target(): CSSSelectorExpression {
    return <any>this.children[1];
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
  constructor(prev: CSSSelectorExpression, target: CSSSelectorExpression, source: string, position: IRange) {
    super(source, position);
    this.appendChild(prev);
    this.appendChild(target);
  }

  get prev(): CSSSelectorExpression {
    return <any>this.children[0];
  }

  get target(): CSSSelectorExpression {
    return <any>this.children[1];
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
  constructor(selector: CSSSelectorExpression, public name: string, rules: Array<CSSSelectorExpression>, source: string, position: IRange) {
    super(source, position);
    this.appendChild(selector);
    rules.forEach((rule) => rule && this.appendChild(rule));
  }

  get selector(): CSSSelectorExpression {
    return <CSSSelectorExpression>this.children[0];
  }

  get rules(): Array<CSSSelectorExpression> {
    return <Array<CSSSelectorExpression>>this.children.slice(1);
  }

  get target(): CSSSelectorExpression {
    return <any>this.children[1];
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
  constructor(public query: string, stylesheet: CSSStyleSheetExpression, source: string, position: IRange) {
    super(source, position);
    this.name = query;
    this.appendChild(stylesheet);
  }

  get stylesheet(): CSSStyleSheetExpression {
    return <CSSStyleSheetExpression>this.children[0];
  }

  test(node: Element) {
    return false;
  }

  toString() {
    return ["@media", this.query, "{", this.stylesheet, "}"].join(" ");
  }
}

export class CSSKeyFramesExpression extends CSSSelectorExpression {
  constructor(public name: string, keyframes: Array<CSSKeyFrameExpression>, source: string, position: IRange) {
    super(source, position);
    keyframes.forEach((keyframe) => this.appendChild(keyframe));
  }

  get keyframes(): Array<CSSKeyFrameExpression> {
    return <Array<CSSKeyFrameExpression>>this.children;

  }
  test(node: Element) {
    return false;
  }

  toString() {
    return ["@keyframes", this.name, "{", this.keyframes.join(""), "}"].join(" ");
  }
}

export class CSSKeyFrameExpression extends CSSSelectorExpression {
  constructor(public start: number, style: CSSStyleDeclarationExpression, source: string, position: IRange) {
    super(source, position);
    this.appendChild(style);
  }

  get style(): CSSStyleDeclarationExpression {
    return <CSSStyleDeclarationExpression>this.children[0];
  }

  test(node: Element) {
    return false;
  }

  toString() {
    return [this.start + "%", "{", this.style, "}"].join(" ");
  }
}

export class CSSAndSelectorExpression extends CSSSelectorExpression {
  constructor(left: CSSSelectorExpression, right: CSSSelectorExpression, source: string, position: IRange) {
    super(source, position);
    this.appendChild(left);
    this.appendChild(right);
  }

  get left(): CSSSelectorExpression {
    return <CSSSelectorExpression>this.children[0];
  }

  get right(): CSSSelectorExpression {
    return <CSSSelectorExpression>this.children[0];
  }

  test(node: Element) {
    return this.left.test(node) && this.right.test(node);
  }
  toString() {
    return `${this.left}${this.right}`;
  }
}


export class CSSAttributeExistsSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, source: string, position: IRange) {
    super(source, position);
  }
  test(node: Element) {
    return node.hasAttribute(this.name);
  }
  toString() {
    return `[${this.name}]`;
  }
}


export class CSSAttributeEqualsSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, source: string, position: IRange) {
    super(source, position);
  }
  test(node: Element) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name) === this.value;
  }
  toString() {
    return `[${this.name}="${this.value}"]`;
  }
}


export class CSSAttributeContainsSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, source: string, position: IRange) {
    super(source, position);
  }
  test(node: Element) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).indexOf(this.value) !== -1;
  }
  toString() {
    return `[${this.name}*="${this.value}"]`;
  }
}


export class CSSAttributeStartsWithSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, source: string, position: IRange) {
    super(source, position);
  }
  test(node: Element) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).indexOf(this.value) === 0;
  }
  toString() {
    return `[${this.name}^="${this.value}"]`;
  }
}


export class CSSAttributeEndsWithSelectorExpression extends CSSSelectorExpression {
  constructor(public name: string, public value: string, source: string, position: IRange) {
    super(source, position);

  }
  test(node: Element) {
    return node.hasAttribute(this.name) && node.getAttribute(this.name).lastIndexOf(this.value) === node.getAttribute(this.name).length - this.value.length;
  }
  toString() {
    return `[${this.name}$="${this.value}"]`;
  }
}
