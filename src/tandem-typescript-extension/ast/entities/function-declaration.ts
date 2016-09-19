import {
  BaseEntity,
  EntityFactoryDependency,
} from "tandem-common";

import {
  TSFunctionDeclarationExpression
} from "../expressions";

export class TSFunctionDeclarationEntity extends BaseEntity<TSFunctionDeclarationExpression> {
  constructor(source: TSFunctionDeclarationExpression) {
    super(source);
    console.log(source);
  }
  cloneLeaf() {
    return new TSFunctionDeclarationEntity(this.source);
  }
}

export const tsFunctionDeclarationEntityFactoryDependency = new EntityFactoryDependency(TSFunctionDeclarationExpression, TSFunctionDeclarationEntity);