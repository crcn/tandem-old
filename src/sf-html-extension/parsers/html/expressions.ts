import { BaseExpression, ICursorPosition, flattenEach } from "../core/expression";
import { IExpression } from "sf-core/entities";
import { register as registerSerializer  } from "sf-core/serialize";

export interface IHTMLValueNodeExpression extends IExpression {
  nodeValue: any;
  nodeName: string;
}

export abstract class HTMLExpression extends BaseExpression {
  constructor(type: string, readonly nodeName: string, position: ICursorPosition) {
    super(type, position);
  }
}


export const HTML_FRAGMENT = "htmlFragment";
export class HTMLFragmentExpression extends HTMLExpression {
  constructor(public childNodes: Array<HTMLExpression>, position: ICursorPosition) {
    super(HTML_FRAGMENT, "#document-fragment", position);
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
    public position: ICursorPosition) {
    super(HTML_ELEMENT, nodeName, position);
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

registerSerializer(HTMLElementExpression);

export const HTML_ATTRIBUTE = "htmlAttribute";
export class HTMLAttributeExpression extends BaseExpression {
  constructor(public name: string, public value: string, position: ICursorPosition) {
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
  constructor(public nodeValue: string, public position: ICursorPosition) {
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
  constructor(public nodeValue: string, public position: ICursorPosition) {
    super(HTML_COMMENT, "#comment", position);
  }

  toString() {
    return ["<!--", this.nodeValue, "-->"].join("");
  }
}

// export const HTML_BLOCK = "htmlBlock";
// export class HTMLBlockExpression extends HTMLExpression {
//   constructor(public script: BaseExpression, public position: ICursorPosition) {
//     super(HTML_BLOCK, position);
//   }
//   public _flattenDeep(items) {
//     super._flattenDeep(items);
//     this.script._flattenDeep(items);
//   }
// }


