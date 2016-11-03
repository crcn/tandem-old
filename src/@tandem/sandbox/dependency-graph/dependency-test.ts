import * as sinon from "sinon";
import { expect } from "chai";
import { MockFileSystem, MockFileResolver, createSandboxTestInjector } from "@tandem/sandbox/test/helpers";
import {
  Dependency,
  IDependencyGraph,
  IDependencyData,
  IDependencyLoader,
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
} from "@tandem/sandbox";


class MockDependencyGraph implements IDependencyGraph {
  public shouldThowLoaderError: boolean;

  createGlobalContext() { }
  createModuleContext() { }
  eagerFindByHash(hash) {
    return null;
  }
  resolve(filePath: string, cwd: string) {
    return null;
  }
  getDependency() {
    return Promise.resolve(null);
  }
  loadDependency() {
    return Promise.resolve(null);
  }
  getLoader(options): IDependencyLoader {
    return {
      load: (info: IResolvedDependencyInfo, options: IDependencyLoaderResult): Promise<IDependencyLoaderResult> => {
        if (this.shouldThowLoaderError) return Promise.reject(new Error(`Mock error`));
        return Promise.resolve({
          type: "plain/text",
          content: "something"
        });
      }
    }
  }
}


describe(__filename + "#", () => {
  const createMockDependency = (data, mockFiles) => {
    const dependency = new Dependency(data, "collection", new MockDependencyGraph());
    createSandboxTestInjector({ mockFiles }).inject(dependency);
    return dependency;
  }
  it("Can load a dependency", async () => {
    const dep = createMockDependency({
      filePath: "a"
    }, { "a": "hello" });
    await dep.load();
    expect(dep.content).to.equal("something");
  });

  it("Can can reload a dependency if an error is thrown during load", async () => {
    const dep = createMockDependency({
      filePath: "a"
    }, { "a": "hello" });
    (<MockDependencyGraph>dep.graph).shouldThowLoaderError = true;
    let err;
    try {
      await dep.load();
    } catch(e) {
      err = e;
    }

    // sanity
    expect(err.message).to.contain("Mock error");

    (<MockDependencyGraph>dep.graph).shouldThowLoaderError = false;

    // need to give memoizee a sec for its cache to bust.
    await new Promise(resolve => setTimeout(resolve, 1));

    await dep.load();
    expect(dep.content).to.equal("something");
  });
});

