import * as sift from "sift";
import {
  INamed,
  IRange,
  TreeNode,
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
  constructor(source: string, position: IRange) {
    super(source, position);
  }
}

export abstract class HTMLNodeExpression extends HTMLExpression {
  constructor(readonly name: string, source: string, position: IRange) {
    super(source, position);
  }
}

export class HTMLContainerExpression extends HTMLNodeExpression {
  constructor(name: string, childNodes: Array<HTMLExpression>, source: string, position: IRange) {
    super(name, source, position);
    childNodes.forEach((child) => this.appendChild(child));
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
  constructor(children: Array<HTMLExpression>, source: string, position: IRange) {
    super("#document-fragment", children, source, position);
  }

  clone(): HTMLFragmentExpression {
    return new HTMLFragmentExpression(
      this.childNodes.map(node => node.clone()),
      this.source,
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
    source: string,
    position: IRange) {
    super(name, childNodes, source, position);
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
      this.attributes.push(new HTMLAttributeExpression(name, value, null, null));
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
      this.source,
      this.position
    );
  }

  public toString() {

    const buffer = [];

    let preWhitespace = this.getWhitespaceBeforeStart();

    buffer.push(preWhitespace);

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

    let endWhitespace = this.getWhitespaceAfterEnd();

    if (this.parent.lastChild === this) {
      buffer.push(endWhitespace);
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
  constructor(public name: string, public value: any, source: string, position: IRange) {
    super(source, position);
  }

  clone(): HTMLAttributeExpression {
    return new HTMLAttributeExpression(
      this.name,
      this.value,
      this.source,
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
  constructor(public value: string, source: string, position: IRange) {
    super("#text", source, position);
  }

  clone(): HTMLTextExpression {
    return new HTMLTextExpression(
      this.value,
      this.source,
      this.position
    );
  }

  toString() {

    // only WS - trim
    if (/^[\s\n\t\r]+$/.test(this.value)) return "";

    return [
      this.getWhitespaceBeforeStart(),
      this.value.trim(),
      this.getWhitespaceAfterEnd()
    ].join("");
  }
}

export class HTMLCommentExpression extends HTMLNodeExpression implements IHTMLValueNodeExpression {
  constructor(public value: string, source: string, position: IRange) {
    super("#comment", source, position);
  }

  clone(): HTMLCommentExpression {
    return new HTMLCommentExpression(
      this.value,
      this.source,
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

