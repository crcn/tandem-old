import * as sift from "sift";
import { INamed } from "tandem-common/object";
import { IRange } from "tandem-common/geom";
import { TreeNode } from "tandem-common/tree";
import { IExpression, BaseExpression } from "tandem-common/ast";
import { register as registerSerializer } from "tandem-common/serialize";

export interface IHTMLExpression extends IExpression {
  patch(expression: IHTMLExpression);
}

export interface IHTMLValueNodeExpression extends IHTMLExpression {
  value: any;
}

export abstract class HTMLExpression extends BaseExpression<HTMLExpression> implements IHTMLExpression {
  constructor(readonly name: string, position: IRange) {
    super(position);
  }
  abstract patch(expression: IHTMLExpression);
}

export abstract class HTMLNodeExpression extends HTMLExpression { }

export class HTMLContainerExpression extends HTMLNodeExpression {
  constructor(name: string, childNodes: Array<HTMLExpression>, position: IRange) {
    super(name, position);
    childNodes.forEach((child) => this.appendChild(child));
  }

  get childNodes(): Array<HTMLAttributeExpression> {
    return <any>this.children.filter(<any>sift({ $type: HTMLNodeExpression }));
  }

  removeAllChildNodes(): void {
    for (const childNode of this.childNodes) {
      this.removeChild(childNode);
    }
  }

  patch(expression: HTMLExpression) { }
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
    public position: IRange) {
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
      this.attributes.push(new HTMLAttributeExpression(name, value, null));
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
    const buffer = ["<", this.name];
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
      buffer.push("/>");
    }
    return buffer.join("");
  }
}

export class HTMLAttributeExpression extends BaseExpression<HTMLAttributeExpression> implements IExpression {
  constructor(public name: string, public value: any, position: IRange) {
    super(position);
  }
  patch(attribute: HTMLAttributeExpression) {

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
  constructor(public value: string, public position: IRange) {
    super("#text", position);
  }

  clone(): HTMLTextExpression {
    return new HTMLTextExpression(
      this.value,
      this.position
    );
  }

  patch(expression: HTMLTextExpression) {
    this.value = expression.value;
    this.position = expression.position;
  }
  toString() {

    // only WS - trim
    if (/^[\s\n\t\r]+$/.test(this.value)) return "";
    return this.value.trim();
  }
}

export class HTMLCommentExpression extends HTMLNodeExpression implements IHTMLValueNodeExpression {
  constructor(public value: string, public position: IRange) {
    super("#comment", position);
  }

  clone(): HTMLCommentExpression {
    return new HTMLCommentExpression(
      this.value,
      this.position
    );
  }

  patch(expression: HTMLCommentExpression) {
    this.value = expression.value;
    this.position = expression.position;
  }
  toString() {
    return ["<!--", this.value, "-->"].join("");
  }
}


