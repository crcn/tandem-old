import { expect } from "chai";
import { Injector } from "@tandem/common";
import {
  Sandbox,
  Bundler,
  BundlerProvider,
  createSandboxProviders
} from "@tandem/sandbox";

import {
  IMockFiles,
  createTestBundler,
  evaluateDependency,
  createSandboxTestInjector,
  ISandboxTestProviderOptions,
} from "@tandem/sandbox/test";

describe(__filename + "#", () => {

  const createWebpackBundler = (mockFiles: IMockFiles) => {
    return createTestBundler({ name: "webpack" }, { mockFiles });
  }

  it("can bundle and evaluate a simple JavaScript file", async () => {
    const bundler = createWebpackBundler({
      "entry.js": `module.exports = "hello"`
    });

    const entry = await bundler.loadDependency({
      filePath: "entry.js"
    });

    expect(await evaluateDependency(entry)).to.equal("hello");
  });

  it("can bundle with another dependency", async () => {
    const bundler = createWebpackBundler({
      "entry.js": `module.exports = require("b.js")`,
      "b.js": `module.exports = 2;`
    });

    const entry = await bundler.loadDependency({
      filePath: "entry.js"
    });

    expect(await evaluateDependency(entry)).to.equal(2);
  });

  it("can bundle cyclical dependencies", async () => {

    const bundler = createWebpackBundler({
      "entry.js": `module.exports = require("a.js")`,
      "a.js": `module.exports = [require("b.js"), "a"];`,
      "b.js": `module.exports = [require("c.js"), "b"];`,
      "c.js": `module.exports = [require("a.js"), "c"];`
    });

    const entry = await bundler.loadDependency({
      filePath: "entry.js"
    });

    expect(await evaluateDependency(entry)).to.eql([ [ [ {}, 'c' ], 'b' ], 'a' ]);
  });
});