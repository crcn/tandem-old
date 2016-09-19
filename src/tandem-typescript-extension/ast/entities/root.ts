import { TSRootExpression } from "../expressions";
import { BaseEntity, EntityFactoryDependency, EntityBodyController } from "tandem-common";

export class TSRootEntity extends BaseEntity<TSRootExpression> {
  private _bodyController: EntityBodyController;
  constructor(source: TSRootExpression) {
    super(source);
    this._bodyController = new EntityBodyController(this);
  }
  async evaluate(context) {
    return this._bodyController.evaluate(context);
  }
  cloneLeaf() {
    return new TSRootEntity(this.source);
  }
}

export const tsRootEntityFactoryDependency = new EntityFactoryDependency(TSRootExpression, TSRootEntity);