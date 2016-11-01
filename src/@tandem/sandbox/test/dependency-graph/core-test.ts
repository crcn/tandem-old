import * as sinon from "sinon";
import { expect } from "chai";
import { Injector, IProvider, MimeTypeProvider } from "@tandem/common";
import {
  Sandbox,
  DependencyGraph,
  SandboxModule,
  IDependencyLoader,
  DependencyGraphProvider,
  createSandboxProviders,
  ISandboxDependencyEvaluator,
  DependencyLoaderFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "@tandem/sandbox";

import {
  IMockFiles,
  evaluateDependency,
  createTestDependencyGraph,
  createSandboxTestInjector,
  ISandboxTestProviderOptions,
} from "@tandem/sandbox/test";

describe(__filename + "#", () => {

  const createDefaultDependencyGraph = (mockFiles, providers?: IProvider[]) => {
    return createTestDependencyGraph({}, { mockFiles, providers });
  }

  it("loads files as plain text if there's no loader associated with them", async () => {
    const graph = createDefaultDependencyGraph({
      'entry.js': 'hello world'
    });
    const entry = await graph.getDependency({ filePath: 'entry.js' })
    await entry.load();
    expect(entry.type).to.equal("text/plain");
    expect(entry.content).to.equal("hello world");
  });

  it("doesn't reload a dependency during a middle of a load", async () => {
    const graph = createDefaultDependencyGraph({
      'entry.js': 'hello world'
    });

    const entry = await graph.getDependency({ filePath: 'entry.js' });
    const loadInitialSourceContentSpy = sinon.spy(entry, "getInitialSourceContent");
    entry.load();
    await entry.load();
    expect(loadInitialSourceContentSpy.callCount).to.eql(1);
  });

  it("reloads the dependency when the source file has changed", async () => {
    const graph = createDefaultDependencyGraph({
      'entry.js': 'a'
    });

    const dependency = await graph.loadDependency({ filePath: 'entry.js' });

    const fileCacheItem = await dependency.getSourceFileCacheItem();
    await fileCacheItem.setDataUrlContent("b").save();
    await dependency.load();
    expect(dependency.content).to.equal("b");
  });

  it("reloads a dependency if the source file cache changes during a load", async () => {
    const graph = createDefaultDependencyGraph({
      'entry.js': 'a'
    });

    const dependency = await graph.loadDependency({ filePath: 'entry.js' });

    const fileCacheItem = await dependency.getSourceFileCacheItem();
    await fileCacheItem.setDataUrlContent("b").save();
    dependency.load();
    fileCacheItem.setDataUrlContent("c").save();
    expect(dependency.loading).to.equal(true);

    // wait on the current load request
    await dependency.load();

    expect(dependency.content).to.equal("c");
  });

  xit("can return the dependency info of a dependency based on the relative path");
  xit("can return the dependency info of a dependency based on the absolute path");

  it("can use a custom loader & evaluator registered in the global injector", async () => {
    const graph = createDefaultDependencyGraph({
      'entry.mu': `import(a.mu); import(b.mu);`,
      'a.mu': 'import(c.mu);',
      'b.mu': 'hello',
      'c.mu': 'world'
    }, [
      new MimeTypeProvider('mu', 'text/mu'),
      new DependencyLoaderFactoryProvider('text/mu', class implements IDependencyLoader {
        async load(filePath: string, { type, content }) {
          return {
            type: "text/plain",
            content: content,
            dependencyPaths: (content.match(/import\((.*?)\)/g) || []).map((expression) => {
              return expression.match(/\((.*?)\)/)[1];
            })
          }
        }
      }),
      new SandboxModuleEvaluatorFactoryProvider('text/plain', class implements ISandboxDependencyEvaluator {
        evaluate(module: SandboxModule) {
          module.exports = module.source.content.replace(/import\((.*?)\);?/g, (match: any, dependencyPath: any) => {
            return module.sandbox.evaluate(module.source.eagerGetDependency(dependencyPath)) as string;
          }).toUpperCase();
        }
      })
    ]);

    const entry = await graph.getDependency({ filePath: 'entry.mu' });
    await entry.load();
    expect(await evaluateDependency(entry)).to.eql("WORLD HELLO");
  });
});