import { expect } from "chai";
import {
  Range,
  BaseEntity,
  IExpression,
  Dependencies,
  EntityRuntime,
  BaseExpression,
  EntityBodyController,
  EntityFactoryDependency,
} from "tandem-common";

import {
  timeout
} from "tandem-common/test";


class MockExpression extends BaseExpression<MockExpression> {
  constructor() {
    super(new Range(0, 0));
  }
}

class MockEntity extends BaseEntity<MockExpression> {
  private _childController: EntityBodyController;
  constructor(source: MockExpression) {
    super(source);
    this._childController = new EntityBodyController(this);
  }
  protected async load() {
    await this._childController.evaluate(this.context);
  }
  protected async update() {
    await this._childController.evaluate(this.context);
  }
  cloneLeaf() {
    return new MockEntity(this.source);
  }
}

describe(__filename + "#", () => {
  it("can be created", () => {
    new EntityRuntime((ast: IExpression) => {
      return null;
    });
  });


  it("can create a new entity based on an AST", async () => {

    const expr = new MockExpression();
    const runtime = new EntityRuntime((ast:  MockExpression) => {
      return new MockEntity(ast);
    });

    await runtime.load(expr);

    expect(runtime.entity).to.be.an.instanceOf(MockEntity);
  });

  it("updates entities when the loaded AST is updated", async () => {
    const expr = new MockExpression();
    const runtime = new EntityRuntime((ast:  MockExpression) => {
      return new MockEntity(ast);
    }, {
      dependencies: new Dependencies(
        new EntityFactoryDependency(MockExpression, MockEntity)
      )
    });

    await runtime.load(expr);
    const entity = runtime.entity;
    expect(entity.children.length).to.equal(0);

    expr.appendChild(new MockExpression());
    await timeout(10);
    expect(entity.children.length).to.equal(1);
  });
});