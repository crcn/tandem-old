import { INamed } from "sf-core/object";
import { IRange } from "sf-core/geom";
import { IExpression } from "sf-core/ast";
import { diffArray, patchArray } from "sf-core/utils/array";
import { register as registerSerializer } from "sf-core/serialize";

export interface IHTMLExpression extends IExpression, INamed {
  name: string;

  // name alias. Here for html compatibility
  nodeName: string;

  patch(expression: IHTMLExpression);
}

export interface IHTMLValueNodeExpression extends IHTMLExpression {
  nodeValue: any;
}

export abstract class HTMLExpression implements IHTMLExpression {
  readonly nodeName: string;
  constructor(readonly name: string, public position: IRange) {
    this.nodeName = name;
  }
  abstract patch(expression: HTMLExpression);
}

export interface IHTMLContainerExpression extends IHTMLExpression {
  childNodes: Array<HTMLExpression>;
  appendChild(child: HTMLExpression);
  removeChild(node: HTMLExpression);
}

function patchContainer(container: IHTMLContainerExpression, expression: IHTMLContainerExpression) {
  const changes = diffArray(container.childNodes, expression.childNodes, (a, b) => a.nodeName === b.nodeName);
  patchArray(
    container.childNodes,
    changes,
    (a, b) => { a.patch(b); return a; }
  );
}

export class HTMLFragmentExpression extends HTMLExpression implements IHTMLContainerExpression {
  constructor(public childNodes: Array<HTMLExpression>, position: IRange) {
    super("#document-fragment", position);
  }

  removeChild(child: HTMLExpression) {
    const i = this.childNodes.indexOf(child);
    if (i !== -1) {
      this.childNodes.splice(i, 1);
    }
  }

  patch(expression: HTMLFragmentExpression) {
    this.position = expression.position;
    patchContainer(this, expression);
  }

  appendChild(childNode: HTMLExpression) {
    this.childNodes.push(childNode);
  }

  public toString() {
    return this.childNodes.join("");
  }
}
/**
 * HTML
 */

export const HTML_ELEMENT = "htmlElement";
export class HTMLElementExpression extends HTMLExpression implements IHTMLContainerExpression {
  constructor(
    nodeName: string,
    public attributes: Array<HTMLAttributeExpression>,
    public childNodes: Array<HTMLExpression>,
    public position: IRange) {
    super(nodeName, position);
  }

  patch(expression: HTMLElementExpression) {
    this.attributes = expression.attributes;
    this.position = expression.position;
    patchContainer(this, expression);
  }

  removeChild(child: HTMLExpression) {
    const i = this.childNodes.indexOf(child);
    if (i !== -1) {
      this.childNodes.splice(i, 1);
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
    this.childNodes.push(childNode);
  }

  public toString() {
    const buffer = ["<", this.nodeName];
    for (const attribute of this.attributes) {
      buffer.push(" ", attribute.toString());
    }
    if (this.childNodes.length) {
      buffer.push(">");
      for (const child of this.childNodes) {
        buffer.push(child.toString());
      }
      buffer.push("</", this.nodeName, ">");
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
  constructor(public nodeValue: string, public position: IRange) {
    super("#text", position);
  }
  patch(expression: HTMLTextExpression) {
    this.nodeValue = expression.nodeValue;
    this.position = expression.position;
  }
  toString() {

    // only WS - trim
    if (/^[\s\n\t\r]+$/.test(this.nodeValue)) return "";
    return this.nodeValue.trim();
  }
}

export class HTMLCommentExpression extends HTMLExpression implements IHTMLValueNodeExpression {
  constructor(public nodeValue: string, public position: IRange) {
    super("#comment", position);
  }
  patch(expression: HTMLExpression) {
    this.nodeValue = expression.nodeName;
    this.position = expression.position;
  }
  toString() {
    return ["<!--", this.nodeValue, "-->"].join("");
  }
}


