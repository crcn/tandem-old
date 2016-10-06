import * as sift from "sift";
import {
  INamed,
  IRange,
  bindable,
  TreeNode,
  patchable,
  IASTNode,
  BaseASTNode,
  register as registerSerializer,
} from "@tandem/common";

export interface IMarkupExpression extends IASTNode {
}

export interface IMarkupValueNodeExpression extends IMarkupExpression {
  value: any;
}

export abstract class MarkupExpression extends BaseASTNode<MarkupExpression> implements IMarkupExpression {
  constructor(position: IRange) {
    super(position);
  }
}

export abstract class MarkupNodeExpression extends MarkupExpression {
  readonly name: string;
  constructor(name: string, position: IRange) {
    super(position);
    this.name = name;
  }

  compare(expression: MarkupNodeExpression): number {
    return Number(super.compare(expression) && expression.name === this.name);
  }
}

export class MarkupContainerExpression extends MarkupNodeExpression {
  constructor(name: string, childNodes: Array<MarkupExpression>, position: IRange) {
    super(name, position);
    childNodes.forEach((child) => this.appendChild(child));
  }

  get firstChildNode(): MarkupNodeExpression {
    return this.childNodes[0];
  }

  get lastChildNode(): MarkupNodeExpression {
    return this.childNodes[this.childNodes.length - 1];
  }

  get childNodes(): Array<MarkupNodeExpression> {
    return <any>this.children.filter(<any>sift({ $type: MarkupNodeExpression }));
  }

  removeAllChildNodes(): void {
    for (const childNode of this.childNodes) {
      this.removeChild(childNode);
    }
  }
}

export class HTMLFragmentExpression extends MarkupContainerExpression implements IMarkupExpression {
  constructor(children: Array<MarkupExpression>, position: IRange) {
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
export class MarkupElementExpression extends MarkupContainerExpression {

  constructor(
    name: string,
    attributes: Array<MarkupAttributeExpression>,
    childNodes: Array<MarkupExpression>,
    position: IRange) {
    super(name, childNodes, position);
    attributes.forEach((attribute) => this.appendChild(attribute));
  }

  get attributes(): Array<MarkupAttributeExpression> {
    return <any>this.children.filter(<any>sift({ $type: MarkupAttributeExpression }));
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
      this.appendChild(new MarkupAttributeExpression(name, value, null));
    }
  }

  getAttribute(name: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        return attribute.value;
      }
    }
  }

  clone(): MarkupElementExpression {
    return new MarkupElementExpression(
      this.name,
      this.attributes.map(attribute => attribute.clone()),
      this.childNodes.map(node => node.clone()),
      this.position
    );
  }

  public toString() {

    const buffer = [];

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

    // necessary to add a newline character at the end of a source in case new
    // expressions are added at the end
    // if (isEOF(this.position, this.source) && /^\n/.test(endWhitespace)) {
    //   buffer.push("\n");
    // }

    return buffer.join("");
  }
}

export class MarkupAttributeExpression extends MarkupExpression implements IASTNode {

  @bindable()
  @patchable()
  public value: any;

  @bindable()
  @patchable()
  public name: string;

  constructor(name: string, value: any, position: IRange) {
    super(position);
    this.name = name;
    this.value = value;
  }

  compare(expression: MarkupAttributeExpression) {
    return Number(super.compare(expression) && this.name === expression.name);
  }

  clone(): MarkupAttributeExpression {
    return new MarkupAttributeExpression(
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

export class MarkupTextExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {

  @bindable()
  @patchable()
  public value: string;

  constructor(value: string, position: IRange) {
    super("#text", position);
    this.value = value;
  }

  clone(): MarkupTextExpression {
    return new MarkupTextExpression(
      this.value,
      this.position
    );
  }

  toString() {
    return this.value.trim();
  }
}

export class MarkupCommentExpression extends MarkupNodeExpression implements IMarkupValueNodeExpression {

  @bindable()
  @patchable()
  public value: string;

  constructor(value: string, position: IRange) {
    super("#comment", position);
    this.value = value;
  }

  clone(): MarkupCommentExpression {
    return new MarkupCommentExpression(
      this.value,
      this.position
    );
  }

  toString() {
    return [
      "<!--", this.value, "-->"
    ].join("");
  }
}

