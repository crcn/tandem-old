import { TSRootExpression } from "../expressions";
import { BaseEntity, EntityFactoryDependency } from "tandem-common";

export class TSRootEntity extends BaseEntity<TSRootExpression> {
  constructor(source: TSRootExpression) {
    super(source);
    console.log(source);
  }
  cloneLeaf() {
    return new TSRootEntity(this.source);
  }
}

export const tsRootEntityFactoryDependency = new EntityFactoryDependency(TSRootExpression, TSRootEntity);