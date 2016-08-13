
import { register as registerSerializer } from "sf-core/serialize";
import { BaseExpression, ICursor, flattenEach } from "../core/expression";

export interface IHTMLValueNodeExpression {
  nodeValue: any;
  nodeName: string;
  readonly position: ICursor;
}

export abstract class HTMLExpression extends BaseExpression {
  constructor(type: string, readonly nodeName: string, position: ICursor) {
    super(type, position);
  }
}


export const HTML_FRAGMENT = "htmlFragment";
export class HTMLFragmentExpression extends HTMLExpression {
  constructor(public childNodes: Array<HTMLExpression>, position: ICursor) {
    super(HTML_FRAGMENT, "#document-fragment", position);
  }

  appendChildNodes(...childNodes: Array<HTMLExpression>) {
    this.childNodes.push(...childNodes);
  }

  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.childNodes, items);
  }

  public toString() {
    return this.childNodes.join("");
  }
}
/**
 * HTML
 */

export const HTML_ELEMENT = "htmlElement";
export class HTMLElementExpression extends HTMLExpression {
  constructor(
    nodeName: string,
    public attributes: Array<HTMLAttributeExpression>,
    public childNodes: Array<HTMLExpression>,
    public position: ICursor) {
    super(HTML_ELEMENT, nodeName, position);
  }

  setAttribute(name: any, value: string) {
    let found = false;
    for (const attribute of this.attributes) {
      if (attribute.name === value) {
        attribute.value = value;
        found = true;
      }
    }
    if (!found) {
      this.attributes.push(new HTMLAttributeExpression(name, value, null));
    }
  }

  appendChildNodes(...childNodes: Array<HTMLExpression>) {
    this.childNodes.push(...childNodes);
  }

  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.attributes, items);
    flattenEach(this.childNodes, items);
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

export const HTML_ATTRIBUTE = "htmlAttribute";
export class HTMLAttributeExpression extends BaseExpression {
  constructor(public name: string, public value: string, position: ICursor) {
    super(HTML_ATTRIBUTE, position);
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

export const HTML_TEXT = "htmlText";
export class HTMLTextExpression extends HTMLExpression implements IHTMLValueNodeExpression {
  constructor(public nodeValue: string, public position: ICursor) {
    super(HTML_TEXT, "#text", position);
  }
  toString() {

    // only WS - trim
    if (/^[\s\n\t\r]+$/.test(this.nodeValue)) return "";
    return this.nodeValue.trim();
  }
}

export const HTML_COMMENT = "htmlComment";
export class HTMLCommentExpression extends HTMLExpression implements IHTMLValueNodeExpression {
  constructor(public nodeValue: string, public position: ICursor) {
    super(HTML_COMMENT, "#comment", position);
  }

  toString() {
    return ["<!--", this.nodeValue, "-->"].join("");
  }
}


