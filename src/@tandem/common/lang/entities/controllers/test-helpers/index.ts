import {
  BaseEntity,
  BaseASTNode,
} from "@tandem/common";

export class MockExpression extends BaseASTNode<MockExpression> {
  constructor(...children: Array<MockExpression>) {
    super({ start: -1, end: -1 });
    children.forEach((child) => this.appendChild(child));
  }
}

export class MockEntity extends BaseEntity<MockExpression> {
  constructor(source: MockExpression) {
    super(source);
  }

  cloneLeaf() {
    return new MockEntity(this.source);
  }
}