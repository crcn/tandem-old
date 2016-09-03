import { IRange } from "sf-common/geom";
import { BaseExpression } from "sf-common/ast";

export abstract class MarkdownExpression extends BaseExpression<MarkdownExpression> {

  constructor(position: IRange) {
    super(position);
  }

  // TODO - change to toHTMLExpression instead
  abstract toHTML(): string;
}

export class MarkdownDocumentExpression extends MarkdownExpression {
  constructor(public childNodes: Array<MarkdownExpression>, position: IRange) {
    super(position);
  }
  toHTML() {
    return this.childNodes.map((child) => child.toHTML()).join("");
  }
}

export class MarkdownHeaderExpression extends MarkdownExpression {
  constructor(readonly size: number, public value: string, position: IRange) {
    super(position);
  }
  toHTML() {
    return `<h${this.size}>${this.value}</h${this.size}>`;
  }
}

export class MarkdownParagraphExpression extends MarkdownExpression {
  constructor(public value: string, position: IRange) {
    super(position);
  }
  toHTML() {
    return `<p>${this.value}</p>`;
  }
}

export class MarkdownBlockExpression extends MarkdownExpression {
  constructor(public value: string, position: IRange) {
    super(position);
  }
  toHTML() {
    return `<block>${this.value}</block>`;
  }
}

export class MarkdownUrlExpression extends MarkdownExpression {
  constructor(public label: string, public url: string, position: IRange) {
    super(position);
  }
  toHTML() {
    return `<a href="${this.url}">${this.label}</a>`;
  }
}

export class MarkdownTextExpression extends MarkdownExpression {
  constructor(public value: string, position: IRange) {
    super(position);
  }
  toHTML() {
    return this.value;
  }
}