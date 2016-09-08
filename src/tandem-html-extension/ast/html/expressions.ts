import * as sift from "sift";
import {
  INamed,
  IRange,
  bindable,
  TreeNode,
  patchable,
  IExpression,
  BaseExpression,
  register as registerSerializer,
} from "tandem-common";


export interface IHTMLExpression extends IExpression {
}

export interface IHTMLValueNodeExpression extends IHTMLExpression {
  value: any;
}

export abstract class HTMLExpression extends BaseExpression<HTMLExpression> implements IHTMLExpression {
  constructor(position: IRange) {
    super(position);
  }
}

export abstract class HTMLNodeExpression extends HTMLExpression {
  @patchable
  readonly name: string;
  constructor(name: string, position: IRange) {
    super(position);
    this.name = name;
  }
}

export class HTMLContainerExpression extends HTMLNodeExpression {
  constructor(name: string, childNodes: Array<HTMLExpression>, position: IRange) {
    super(name, position);
    childNodes.forEach((child) => this.appendChild(child));
  }

  get firstChildNode(): HTMLNodeExpression {
    return this.childNodes[0];
  }

  get lastChildNode(): HTMLNodeExpression {
    return this.childNodes[this.childNodes.length - 1];
  }

  get childNodes(): Array<HTMLNodeExpression> {
    return <any>this.children.filter(<any>sift({ $type: HTMLNodeExpression }));
  }

  removeAllChildNodes(): void {
    for (const childNode of this.childNodes) {
      this.removeChild(childNode);
    }
  }
}

export class HTMLFragmentExpression extends HTMLContainerExpression implements IHTMLExpression {
  constructor(children: Array<HTMLExpression>, position: IRange) {
    super("#document-fragment", children, position);
  }

  clone(): HTMLFragmentExpression {
    return new HTMLFragmentExpression(
      this.childNodes.map(node => node.clone()),
      this.position
    );
  }

  public toString() {
    return this.children.join("");
  }
}
/**
 * HTML
 */

export const HTML_ELEMENT = "htmlElement";
export class HTMLElementExpression extends HTMLContainerExpression {

  constructor(
    name: string,
    attributes: Array<HTMLAttributeExpression>,
    childNodes: Array<HTMLExpression>,
    position: IRange) {
    super(name, childNodes, position);
    attributes.forEach((attribute) => this.appendChild(attribute));
  }

  get attributes(): Array<HTMLAttributeExpression> {
    return <any>this.children.filter(<any>sift({ $type: HTMLAttributeExpression }));
  }

  removeAttribute(name: string) {
    const attribute = this.attributes.find((attr) => attr.name === name);
    if (attribute) {
      this.attributes.splice(this.attributes.indexOf(attribute), 1);
    }
  }

  setAttribute(name: string, value: string) {
    let found = false;
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        attribute.value = value;
        found = true;
      }
    }
    if (!found) {
      this.appendChild(new HTMLAttributeExpression(name, value, null));
    }
  }

  getAttribute(name: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        return attribute.value;
      }
    }
  }

  clone(): HTMLElementExpression {
    return new HTMLElementExpression(
      this.name,
      this.attributes.map(attribute => attribute.clone()),
      this.childNodes.map(node => node.clone()),
      this.position
    );
  }

  public toString() {

    const buffer = [];

    buffer.push(this.getWhitespaceBeforeStart());

    buffer.push("<", this.name);

    for (const attribute of this.attributes) {
      buffer.push(" ", attribute.toString());
    }

    if (this.children.length) {
      buffer.push(">");
      for (const child of this.childNodes) {
        buffer.push(child.toString());
      }
      buffer.push("</", this.name, ">");
    } else {
      buffer.push(" />");
    }

    if ((<HTMLContainerExpression>this.parent).lastChildNode === this) {
      buffer.push(this.getWhitespaceAfterEnd());
    }

    // necessary to add a newline character at the end of a source in case new
    // expressions are added at the end
    // if (isEOF(this.position, this.source) && /^\n/.test(endWhitespace)) {
    //   buffer.push("\n");
    // }

    return buffer.join("");
  }
}

export class HTMLAttributeExpression extends HTMLExpression implements IExpression {

  @bindable()
  @patchable
  public value: any;

  @bindable()
  @patchable
  public name: string;

  constructor(name: string, value: any, position: IRange) {
    super(position);
    this.name = name;
    this.value = value;
  }

  clone(): HTMLAttributeExpression {
    return new HTMLAttributeExpression(
      this.name,
      this.value,
      this.position
    );
  }

  toString() {
    const buffer = [this.name];
    const value = this.value;
    if (value !== "\"\"") {
      buffer.push("=", typeof value === "object" ? value : "\"" + value + "\"");
    }
    return buffer.join("");
  }
}

export class HTMLTextExpression extends HTMLNodeExpression implements IHTMLValueNodeExpression {

  @bindable()
  @patchable
  public value: string;

  constructor(value: string, position: IRange) {
    super("#text", position);
    this.value = value;
  }

  clone(): HTMLTextExpression {
    return new HTMLTextExpression(
      this.value,
      this.position
    );
  }

  toString() {
    return [
      this.getWhitespaceBeforeStart(),
      this.value.trim(),
      this.getWhitespaceAfterEnd()
    ].join("");
  }
}

export class HTMLCommentExpression extends HTMLNodeExpression implements IHTMLValueNodeExpression {

  @bindable()
  @patchable
  public value: string;

  constructor(value: string, position: IRange) {
    super("#comment", position);
    this.value = value;
  }

  clone(): HTMLCommentExpression {
    return new HTMLCommentExpression(
      this.value,
      this.position
    );
  }

  toString() {
    return [
      this.getWhitespaceBeforeStart(),
      "<!--", this.value, "-->"
    ].join("");
  }
}

