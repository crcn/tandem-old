import {
  BaseEntity,
  EntityFactoryDependency,
} from "tandem-common";

import {
  TSFunctionDeclarationExpression
} from "../ast";

export class TSFunctionDeclarationEntity extends BaseEntity<TSFunctionDeclarationExpression> {
  constructor(source: TSFunctionDeclarationExpression) {
    super(source);
  }

  async evaluate(context: any) {
    await super.evaluate(context);
    console.log("evaluate");
  }

  cloneLeaf() {
    return new TSFunctionDeclarationEntity(this.source);
  }
}

export const tsFunctionDeclarationEntityFactoryDependency = new EntityFactoryDependency(TSFunctionDeclarationExpression, TSFunctionDeclarationEntity);