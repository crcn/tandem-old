import {
  BaseEntity,
  EntityFactoryDependency,
} from "tandem-common";

import {
  TSCallExpression
} from "../expressions";

export class TSCallEntity extends BaseEntity<TSCallExpression> {
  constructor(source: TSCallExpression) {
    super(source);
  }
  // async load(context: any) {
  //   await super.load(context);
  // }

  cloneLeaf() {
    return new TSCallEntity(this.source);
  }
}

export const tsCallEntityFactoryDependency = new EntityFactoryDependency(TSCallExpression, TSCallEntity);