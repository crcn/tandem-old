import { expect } from "chai";
import { Kernel } from "@tandem/common";
import {
  Sandbox,
  DependencyGraph,
  DependencyGraphProvider,
  createSandboxProviders
} from "@tandem/sandbox";

import {
  IMockFiles,
  evaluateDependency,
  createTestDependencyGraph,
  createSandboxTestKernel,
  ISandboxTestProviderOptions,
} from "@tandem/sandbox/test";

describe(__filename + "#", () => {

  const createWebpackDependencyGraph = (mockFiles: IMockFiles) => {
    return createTestDependencyGraph({ name: "webpack" }, { mockFiles });
  }

  xit("can graph and evaluate a simple JavaScript file", async () => {
    const graph = createWebpackDependencyGraph({
      "entry.js": `module.exports = "hello"`
    });

    const entry = await graph.loadDependency(await graph.resolve("entry.js", ""));

    expect(await evaluateDependency(entry)).to.equal("hello");
  });

  xit("can graph with another dependency", async () => {
    const graph = createWebpackDependencyGraph({
      "entry.js": `module.exports = require("b.js")`,
      "b.js": `module.exports = 2;`
    });

    const entry = await graph.loadDependency(await graph.resolve("entry.js", ""));

    expect(await evaluateDependency(entry)).to.equal(2);
  });

  xit("can graph cyclical dependencies", async () => {

    const graph = createWebpackDependencyGraph({
      "entry.js": `module.exports = require("a.js")`,
      "a.js": `module.exports = [require("b.js"), "a"];`,
      "b.js": `module.exports = [require("c.js"), "b"];`,
      "c.js": `module.exports = [require("a.js"), "c"];`
    });

    const entry = await graph.loadDependency(await graph.resolve("entry.js", ""));

    expect(await evaluateDependency(entry)).to.eql([ [ [ {}, 'c' ], 'b' ], 'a' ]);
  });
});