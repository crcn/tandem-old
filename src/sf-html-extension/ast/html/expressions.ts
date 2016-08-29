import { INamed } from "sf-core/object";
import { IRange } from "sf-core/geom";
import { IExpression } from "sf-core/ast";
import { diffArray, patchArray } from "sf-core/utils/array";
import { register as registerSerializer } from "sf-core/serialize";

export interface IHTMLExpression extends IExpression, INamed {
  patch(expression: IHTMLExpression);
}

export interface IHTMLValueNodeExpression extends IHTMLExpression {
  value: any;
}

export abstract class HTMLExpression implements IHTMLExpression {
  constructor(readonly name: string, public position: IRange) {
  }
  abstract patch(expression: HTMLExpression);
}

export interface IHTMLContainerExpression extends IHTMLExpression {
  children: Array<HTMLExpression>;
  appendChild(child: HTMLExpression);
  removeChild(node: HTMLExpression);
}

export class HTMLContainerExpression extends HTMLExpression {
  constructor(name: string, public children: Array<HTMLExpression>, position: IRange) {
    super(name, position);
  }
  patch(expression: IHTMLContainerExpression) {
    this.position = expression.position;
    const changes = diffArray(this.children, expression.children, (a, b) => a.name === b.name);
    patchArray(
      this.children,
      changes,
      (a, b) => { a.patch(b); return a; }
    );
  }
}

export class HTMLFragmentExpression extends HTMLContainerExpression implements IHTMLContainerExpression {
  constructor(children: Array<HTMLExpression>, position: IRange) {
    super("#document-fragment", children, position);
  }

  removeChild(child: HTMLExpression) {
    const i = this.children.indexOf(child);
    if (i !== -1) {
      this.children.splice(i, 1);
    }
  }

  appendChild(childNode: HTMLExpression) {
    this.children.push(childNode);
  }

  public toString() {
    return this.children.join("");
  }
}
/**
 * HTML
 */

export const HTML_ELEMENT = "htmlElement";
export class HTMLElementExpression extends HTMLContainerExpression implements IHTMLContainerExpression {
  constructor(
    name: string,
    public attributes: Array<HTMLAttributeExpression>,
    children: Array<HTMLExpression>,
    public position: IRange) {
    super(name, children, position);
  }

  patch(expression: HTMLElementExpression) {
    this.attributes = expression.attributes;
    super.patch(expression);
  }

  removeChild(child: HTMLExpression) {
    const i = this.children.indexOf(child);
    if (i !== -1) {
      this.children.splice(i, 1);
    }
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

  appendChild(childNode: HTMLExpression) {
    this.children.push(childNode);
  }

  public toString() {
    const buffer = ["<", this.name];
    for (const attribute of this.attributes) {
      buffer.push(" ", attribute.toString());
    }
    if (this.children.length) {
      buffer.push(">");
      for (const child of this.children) {
        buffer.push(child.toString());
      }
      buffer.push("</", this.name, ">");
    } else {
      buffer.push("/>");
    }
    return buffer.join("");
  }
}

export class HTMLAttributeExpression implements IExpression {
  constructor(public name: string, public value: string, readonly position: IRange) {

  }
  toString() {
    const buffer = [this.name];
    const value = this.value;
    if (value !== "\"\"") {
      buffer.push("=", "\"", value, "\"");
    }
    return buffer.join("");
  }
}

export class HTMLTextExpression extends HTMLExpression implements IHTMLValueNodeExpression {
  constructor(public value: string, public position: IRange) {
    super("#text", position);
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

export class HTMLCommentExpression extends HTMLExpression implements IHTMLValueNodeExpression {
  constructor(public value: string, public position: IRange) {
    super("#comment", position);
  }
  patch(expression: HTMLCommentExpression) {
    console.log("PATCH", expression);
    this.value = expression.value;
    this.position = expression.position;
  }
  toString() {
    return ["<!--", this.value, "-->"].join("");
  }
}


