import { expect } from "chai";
import { Sandbox, DependencyGraphProvider } from "@tandem/sandbox";
import { createSandboxTestInjector, timeout } from "@tandem/sandbox/test/helpers";

describe(__filename + "#", () => {
  it("can evaluate an entry", async () => {
    const injector = createSandboxTestInjector({
      mockFiles: {
        "a.js": "module.exports = require('./b.js')",
        "b.js": "module.exports = 'bb';"
      }
    })

    const sandbox = new Sandbox(injector);
    const graph = DependencyGraphProvider.getInstance({ name: "webpack" }, injector);
    const dep = await graph.getDependency(await graph.resolve("a.js",""));
    await sandbox.open(dep);
    expect(sandbox.exports).to.equal("bb");
  });


  it("re-evaluates a dependency if it changes", async () => {
    const injector = createSandboxTestInjector({
      mockFiles: {
        "a.js": "module.exports = require('./b.js')",
        "b.js": "module.exports = 'bb';"
      }
    })

    const sandbox = new Sandbox(injector);
    const graph = DependencyGraphProvider.getInstance({ name: "webpack" }, injector);
    const dep = await graph.getDependency(await graph.resolve("a.js",""));
    await sandbox.open(dep);
    expect(sandbox.exports).to.equal("bb");
    await (await dep.getSourceFileCacheItem()).setDataUrlContent("module.exports = 'aa'").save();
    await timeout(10);
    expect(sandbox.exports).to.equal("aa");
  });
});