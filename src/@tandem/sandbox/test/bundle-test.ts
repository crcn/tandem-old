import * as sinon from "sinon";
import { expect } from "chai";
import { Injector, IProvider, MimeTypeProvider } from "@tandem/common";
import {
  Sandbox,
  Bundler,
  SandboxModule,
  IBundleLoader,
  BundlerProvider,
  createSandboxProviders,
  ISandboxBundleEvaluator,
  BundlerLoaderFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "@tandem/sandbox";

import {
  IMockFiles,
  evaluateDependency,
  createTestBundler,
  createSandboxTestInjector,
  ISandboxTestProviderOptions,
} from "@tandem/sandbox/test";

describe(__filename + "#", () => {

  const createDefaultBundler = (mockFiles, providers?: IProvider[]) => {
    return createTestBundler({}, { mockFiles, providers });
  }

  it("loads files as plain text if there's no loader associated with them", async () => {
    const bundler = createDefaultBundler({
      'entry.js': 'hello world'
    });
    const entry = await bundler.getDependency({ filePath: 'entry.js' })
    await entry.load();
    expect(entry.type).to.equal("text/plain");
    expect(entry.content).to.equal("hello world");
  });

  it("doesn't reload a bundle during a middle of a load", async () => {
    const bundler = createDefaultBundler({
      'entry.js': 'hello world'
    });

    const entry = await bundler.getDependency({ filePath: 'entry.js' });
    const loadInitialSourceContentSpy = sinon.spy(entry, "getInitialSourceContent");
    entry.load();
    await entry.load();
    expect(loadInitialSourceContentSpy.callCount).to.eql(1);
  });

  xit("reloads the dependency when the source file has changed");
  // xit("")

  it("can use a custom loader & evaluator registered in the global injector", async () => {
    const bundler = createDefaultBundler({
      'entry.mu': `import(a.mu); import(b.mu);`,
      'a.mu': 'import(c.mu);',
      'b.mu': 'hello',
      'c.mu': 'world'
    }, [
      new MimeTypeProvider('mu', 'text/mu'),
      new BundlerLoaderFactoryProvider('text/mu', class implements IBundleLoader {
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
      new SandboxModuleEvaluatorFactoryProvider('text/plain', class implements ISandboxBundleEvaluator {
        evaluate(module: SandboxModule) {
          module.exports = module.bundle.content.replace(/import\((.*?)\);?/g, (match: any, dependencyPath: any) => {
            return module.sandbox.require(module.bundle.getDependencyHash(dependencyPath)) as string;
          }).toUpperCase();
        }
      })
    ]);

    const entry = await bundler.getDependency({ filePath: 'entry.mu' });
    await entry.load();
    expect(await evaluateDependency(entry)).to.eql("WORLD HELLO");
  });
});