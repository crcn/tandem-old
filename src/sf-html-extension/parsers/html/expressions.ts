import { INamed } from "sf-core/object";
import { IRange } from "sf-core/geom";
import { IExpression } from "sf-core/expressions";
import { register as registerSerializer } from "sf-core/serialize";

export interface IHTMLExpression extends IExpression, INamed {
  name: string;

  // name alias. Here for html compatibility
  nodeName: string;
}

export interface IHTMLValueNodeExpression extends IHTMLExpression {
  nodeValue: any;
}


export abstract class HTMLExpression implements IHTMLExpression {
  readonly nodeName: string;
  constructor(readonly name: string, readonly position: IRange) {
    this.nodeName = name;
  }
}

export interface IHTMLContainerExpression extends IHTMLExpression {
  childNodes: Array<HTMLExpression>;
  appendChildNodes(...childNodes: Array<HTMLExpression>);
  removeChild(node: HTMLExpression);
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

  appendChildNodes(...childNodes: Array<HTMLExpression>) {
    this.childNodes.push(...childNodes);
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

  removeChild(child: HTMLExpression) {
    const i = this.childNodes.indexOf(child);
    if (i !== -1) {
      this.childNodes.splice(i, 1);
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

  appendChildNodes(...childNodes: Array<HTMLExpression>) {
    this.childNodes.push(...childNodes);
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

  toString() {
    return ["<!--", this.nodeValue, "-->"].join("");
  }
}


