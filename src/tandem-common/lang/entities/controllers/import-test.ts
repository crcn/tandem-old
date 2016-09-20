import { expect } from "chai";

import {
  MockEntity,
  MockExpression,
} from "./test-helpers";

import {
  Dependencies,
  DependenciesDependency,
  EntityImportController,
} from "tandem-common";

describe(__filename + "#", () => {

  let deps: Dependencies;

  beforeEach(() => {
    deps = new Dependencies(
      new DependenciesDependency()
    );
  });

  it("can be created", () => {
    new EntityImportController(new MockEntity(new MockExpression()), "text/css");
  });

  it("can load content into the current context", () => {

  });
});

