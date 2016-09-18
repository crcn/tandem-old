import { expect } from "chai";
import {
  BaseEntity,
  Dependencies,
  BaseExpression,
  EntityBodyController,
  DependenciesDependency,
  EntityFactoryDependency,
} from "tandem-common";

import {
  MockEntity,
  MockExpression,
} from "./test-helpers";

describe(__filename + "#", () => {


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

