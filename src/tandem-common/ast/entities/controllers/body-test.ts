import { expect } from "chai";
import {
  BaseEntity,
  Dependencies,
  BaseExpression,
  EntityBodyController,
  DependenciesDependency,
  EntityFactoryDependency,
} from "tandem-common";

describe(__filename + "#", () => {

  class MockExpression extends BaseExpression<MockExpression> {
    constructor(...children: Array<MockExpression>) {
      super({ start: -1, end: -1 });
      children.forEach((child) => this.appendChild(child));
    }
  }

  class MockEntity extends BaseEntity<MockExpression> {
    constructor(source: MockExpression) {
      super(source);
    }

    cloneLeaf() {
      return new MockEntity(this.source);
    }
  }

  let deps: Dependencies;

  beforeEach(() => {
    deps = new Dependencies(
      new DependenciesDependency(),
      new EntityFactoryDependency(MockExpression, MockEntity)
      );
  });

  it("can be created", () => {
    new EntityBodyController(new MockEntity(new MockExpression()));
  });

  it("appends child entities according to the source entity chidren", async () => {
    const entity = new MockEntity(new MockExpression(new MockExpression(), new MockExpression()));
    const controller = new EntityBodyController(entity);
    expect(entity.children.length).to.equal(0);
    await controller.evaluate({ dependencies: deps });
    expect(entity.children.length).to.equal(2);
  });
});

