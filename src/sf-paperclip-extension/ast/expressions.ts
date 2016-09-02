import { IRange } from "sf-core/geom";
import { BaseExpression } from "sf-core/ast";
import { HTMLNodeExpression } from "sf-html-extension/ast";

export class PCBlockAttributeExpression extends BaseExpression<any> {

  constructor(public name: string, public value: string, position: IRange) {
    super(position);
  }
  toString() {
    return `\${ ${this.value} }`;
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
  constructor(public value: any, position: IRange) {
    super("#block", position);
  }
  patch(entity: PCBlockNodeExpression) {
    this.value = entity.value;
  }
  clone(): PCBlockNodeExpression {
    return new PCBlockNodeExpression(
      this.value,
      this.position
    );
  }
  toString() {
    return `\${ ${this.value} }`;
  }
}

