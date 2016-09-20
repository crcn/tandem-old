import {
  BaseEntity,
  EntityFactoryDependency,
} from "tandem-common";

import {
  TSStatementExpression
} from "../ast";

export class TSStatementEntity extends BaseEntity<TSStatementExpression> {
  constructor(source: TSStatementExpression) {
    super(source);
  }
  async load() {
    await super.load();
    const child = EntityFactoryDependency.createEntityFromSource(this.source.targetExpression, this.dependencies);
    this.appendChild(child);
    await child.evaluate(context);
  }
  cloneLeaf() {
    return new TSStatementEntity(this.source);
  }
}

export const tsStatementEntityFactoryDependency = new EntityFactoryDependency(TSStatementExpression, TSStatementEntity);