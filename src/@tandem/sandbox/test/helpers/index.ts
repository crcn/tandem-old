import * as path from "path";
import { 
  inject,
  Injector,
  Provider,
  IProvider,
  UpsertBus,
  BrokerBus,
  IDisposable,
  InjectorProvider,
  PrivateBusProvider,
} from "@tandem/common";
import * as MemoryDSBus from "mesh-memory-ds-bus";
import { createJavaScriptSandboxProviders } from "@tandem/javascript-extension/sandbox";


import {
  Sandbox,
  Bundler,
  IFileSystem,
  IFileResolver,
  BaseFileSystem,
  BundlerProvider,
  BundleDependency,
  FileSystemProvider,
  IFileResolverOptions,
  IBundleStrategyOptions,
  createSandboxProviders,
} from "@tandem/sandbox";

export interface IMockFiles {
  [Identifier: string]: string;
}

export class MockFilesProvider extends Provider<IMockFiles> {
  static readonly ID = "mockFiles";
  constructor(files: IMockFiles) {
    super(MockFilesProvider.ID, files);
  }
}

export interface ISandboxTestProviderOptions {
  mockFiles: IMockFiles;
  providers?: IProvider[];
}

export class MockFileSystem extends BaseFileSystem {

  @inject(MockFilesProvider.ID)
  private _mockFiles: IMockFiles;

  private _watchers: any;

  constructor() {
    super();
    this._watchers = {};
  }

  readFile(filePath: string): Promise<any> {
    const content = this._mockFiles[filePath];
    return content && Promise.resolve(content) || Promise.reject(new Error(`File ${filePath} not found.`));
  }
  writeFile(filePath: string, content: string): Promise<void> {

    this._mockFiles[filePath] = filePath;

    if (this._watchers[filePath]) {
      this._watchers[filePath]();
    }

    return Promise.resolve();
  }
  watchFile2(filePath: string, onChange: Function): IDisposable {
    this._watchers[filePath] = onChange;
    return {
      dispose: () => {
        this._watchers[filePath] = undefined;
      }
    }
  }
}

export class MockFileResolver implements IFileResolver {
  resolve(relativePath: string, cwd: string, options?: IFileResolverOptions) {
    return Promise.resolve(path.join(cwd || "", relativePath));
  }
}

export const createSandboxTestInjector = (options: ISandboxTestProviderOptions) => {
  const injector = new Injector();
  const bus = new BrokerBus();
  bus.register(UpsertBus.create(new MemoryDSBus()));

  injector.register(
    options.providers || [],
    new InjectorProvider(),
    new PrivateBusProvider(bus),
    new MockFilesProvider(options.mockFiles || {}),
    createJavaScriptSandboxProviders(),
    createSandboxProviders(MockFileSystem, MockFileResolver)
  );

  return injector;
}

export const createTestBundler = (bundlerOptions: IBundleStrategyOptions, injectorOptions: ISandboxTestProviderOptions) => {
  const injector = createSandboxTestInjector(injectorOptions);
  return BundlerProvider.getInstance(bundlerOptions, injector);
}

export const evaluateDependency = async (bundle: BundleDependency) => {
  const sandbox = new Sandbox(bundle["_injector"]);
  await sandbox.open(bundle);
  return sandbox.exports;
}