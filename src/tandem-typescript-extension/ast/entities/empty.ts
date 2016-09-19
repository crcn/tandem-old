import {
  BaseEntity,
  EntityFactoryDependency,
} from "tandem-common";

import {
  TSEmptyExpression
} from "../expressions";

export class TSEmptyEntity extends BaseEntity<TSEmptyExpression> {
  constructor(source: TSEmptyExpression) {
    super(source);
  }
  cloneLeaf() {
    return new TSEmptyEntity(this.source);
  }
}

export const tsEmptyEntityFactoryDependency = new EntityFactoryDependency(TSEmptyExpression, TSEmptyEntity);