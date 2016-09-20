import { IRange } from "tandem-common/geom";
import { HTMLNodeExpression, HTMLExpression } from "tandem-html-extension/lang";
import { BaseASTNode, bindable, patchable } from "tandem-common";

export class PCBlockAttributeExpression extends HTMLExpression {

  @bindable()
  @patchable
  public value: string;

  constructor(public name: string, value: string, position: IRange) {
    super(position);
    this.value = value;
  }
  toString() {
    return `\${${this.value}}`;
  }

  clone(): PCBlockAttributeExpression {
    return new PCBlockAttributeExpression(
      this.name,
      this.value,
      this.position
    );
  }
}

export class PCBlockNodeExpression extends HTMLNodeExpression {

  @bindable()
  @patchable
  public value: string;

  constructor(value: any, position: IRange) {
    super("#block", position);
    this.value = value;
  }

  clone(): PCBlockNodeExpression {
    return new PCBlockNodeExpression(
      this.value,
      this.position
    );
  }

  toString() {
    return `\${${this.value}}`;
  }
}

