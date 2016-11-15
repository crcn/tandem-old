import * as sinon from "sinon";
import { expect } from "chai";
import { Injector, Status } from "@tandem/common";
import { MockFileSystem, MockFileResolver, createSandboxTestInjector } from "@tandem/sandbox/test/helpers";
import {
  Dependency,
  IDependencyGraph,
  IDependencyData,
  IFileResolver,
  FileCacheItem,
  DependencyAction,
  IDependencyLoader,
  FileResolverProvider,
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
} from "@tandem/sandbox";


class MockDependencyGraph implements IDependencyGraph {

  private _deps = {};

  constructor(readonly injector: Injector) {

  }

  createGlobalContext() { }
  createModuleContext() { }
  eagerFindByHash(hash) {
    return this._deps[hash];
  }
  async resolve(filePath: string, cwd: string) {
    return Promise.resolve({
      hash: filePath,
      filePath: await FileResolverProvider.getInstance(this.injector).resolve(filePath, cwd)
    });
  }
  getDependency(info: IResolvedDependencyInfo) {
    return this._deps[info.hash] || (this._deps[info.hash] = this.injector.inject(new Dependency(info, "collection", this)));
  }
  loadDependency() {
    return Promise.resolve(null);
  }
  getLoader(options): IDependencyLoader {
    return {
      load: (info: IResolvedDependencyInfo, options: IDependencyLoaderResult): Promise<IDependencyLoaderResult> => {

        if (options.content.throwError) return Promise.reject(new Error(`Mock error`));
        return Promise.resolve({
          type: "plain/text",
          content: options.content.content,
          importedDependencyPaths: options.content.importedDependencyPaths
        });
      }
    }
  }
}


describe(__filename + "#", () => {
  const createMockDependency = (data, mockFiles) => {
    const injector = createSandboxTestInjector({ mockFiles });
    const dependency = new Dependency(data, "collection", new MockDependencyGraph(injector));
    injector.inject(dependency);
    return dependency;
  }
  it("Can load a dependency", async () => {
    const dep = createMockDependency({
      filePath: "a"
    }, { "a": { content: "blarg" } });
    await dep.load();
    expect(dep.content).to.equal("blarg");
  });

  it("Can reload a dependency if an error is thrown during load", async () => {
    let depa = { throwError: false, content: "something" };
    const dep = createMockDependency({
      filePath: "a"
    }, { "a": depa });
    depa.throwError = true;

    let err;
    try {
      await dep.load();
    } catch(e) {
      err = e;
    }

    // sanity
    expect(err.message).to.contain("Mock error");

    depa.throwError = false;

    // need to give memoizee a sec for its cache to bust.
    await new Promise(resolve => setTimeout(resolve, 1));

    expect(dep.status.type).to.equal(Status.ERROR);

    // dep assumes that if there's an error on the initial load, then there will be another
    // error again unless the source file has changed. For that, we'll need to touch the source file.
    (await dep.getSourceFileCacheItem()).updatedAt = Date.now();
    await dep.load();
    expect(dep.status.type).to.equal(Status.COMPLETED);
    expect(dep.content).to.equal("something");
  });

  it("Can reload a dependency if a nested dependency errors", async () => {

    let depc;

    const dep = createMockDependency({
      filePath: "a"
    }, {
      a: {
        content: "aa",
        importedDependencyPaths: ["b", "c"]
      },
      b: {
        content: "bb"
      },
      c: depc = {
        content: "cc",
        throwError: true
      }
    });

    let err;
    try {
      await dep.load();
    } catch(e) {
      err = e;
    }

    // sanity
    expect(err.message).to.contain("Mock error");

    depc.throwError = false;

    // need to give memoizee a sec for its cache to bust.
    await new Promise(resolve => setTimeout(resolve, 1));

    expect(dep.status.type).to.equal(Status.ERROR);
    expect(dep.eagerGetDependency("c").status.type).to.equal(Status.ERROR);
    await dep.load();
    expect(dep.eagerGetDependency("c").status.type).to.equal(Status.COMPLETED);
    expect(dep.content).to.equal("aa");
  });

  it("emits a DEPENDENCY_LOADED action even when load() is called multiple times", async () => {
    let i = 0;
    const dep = createMockDependency({
      filePath: "a"
    }, { a: { content: "aa" }});
    dep.observe({
      dispatch: (action) => action.type === DependencyAction.DEPENDENCY_LOADED ? i++ : 0
    });
    await dep.load();
    await dep.load();
    await dep.load();
    expect(i).to.equal(1);
  });
});

