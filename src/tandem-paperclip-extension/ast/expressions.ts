import { IRange } from "tandem-common/geom";
import { BaseExpression } from "tandem-common/ast";
import { HTMLNodeExpression, HTMLExpression } from "tandem-html-extension/ast";

export class PCBlockAttributeExpression extends HTMLExpression {

  constructor(public name: string, public value: string, source: string, position: IRange) {
    super(source, position);
  }
  toString() {
    return `\${ ${this.value} }`;
  }

  clone(): PCBlockAttributeExpression {
    return new PCBlockAttributeExpression(
      this.name,
      this.value,
      this.source,
      this.position
    );
  }
}

export class PCBlockNodeExpression extends HTMLNodeExpression {
  constructor(public value: any, source: string, position: IRange) {
    super("#block", source, position);
  }
  clone(): PCBlockNodeExpression {
    return new PCBlockNodeExpression(
      this.value,
      this.source,
      this.position
    );
  }
  toString() {
    return `\${ ${this.value} }`;
  }
}

