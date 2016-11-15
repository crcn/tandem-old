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
  FileCache,
  Dependency,
  IFileSystem,
  IFileResolver,
  BaseFileSystem,
  IDependencyGraph,
  DependencyGraph,
  IResolvedDependencyInfo,
  IDependencyLoaderResult,
  IDependencyLoader,
  WebpackDependencyGraphStrategy,
  ProtocolURLResolverProvider,
  WebpackProtocolResolver,
  FileCacheProvider,
  DependencyGraphStrategyProvider,
  FileSystemProvider,
  IFileResolverOptions,
  createSandboxProviders,
  DependencyGraphProvider,
  IDependencyGraphStrategyOptions,
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
  mockFiles?: IMockFiles;
  providers?: IProvider[];
  fileCacheSync?: boolean;
}

export class MockFileSystem extends BaseFileSystem {

  @inject(MockFilesProvider.ID)
  private _mockFiles: IMockFiles;

  private _watchers: any;

  constructor() {
    super();
    this._watchers = {};
  }

  readDirectory(directoryPath: string): Promise<string[]> {
    return Promise.resolve([]);
  }

  fileExists(filePath: string): Promise<boolean> {
    return Promise.resolve(!!this._mockFiles[filePath]);
  }

  readFile(filePath: string): Promise<any> {
    const content = this._mockFiles[filePath];
    return new Promise((resolve, reject) => {

      // simulated latency
      setTimeout(() => {
        if (content) {
          resolve(content);
        } else {
          reject(new Error(`File ${filePath} not found.`));
        }
      }, 5);
    });
  }
  writeFile(filePath: string, content: string): Promise<void> {

    this._mockFiles[filePath] = content;

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
  @inject(MockFilesProvider.ID)
  private _mockFiles: IMockFiles;

  resolve(relativePath: string, cwd: string, options?: IFileResolverOptions) {
    return Promise.resolve([
      path.resolve(cwd || "", relativePath),
      path.join("", relativePath)
    ].find(filePath => !!this._mockFiles[filePath]));
  }
}

export const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const createTestSandboxProviders = (options: ISandboxTestProviderOptions = {}) => {
  return [
    new MockFilesProvider(options.mockFiles || {}),
    createSandboxProviders(MockFileSystem, MockFileResolver)
  ];
}

export const createSandboxTestInjector = (options: ISandboxTestProviderOptions = {}) => {
  const injector = new Injector();
  const bus = new BrokerBus();
  bus.register(new UpsertBus(new MemoryDSBus()));

  injector.register(
    options.providers || [],
    new InjectorProvider(),
    new PrivateBusProvider(bus),
    createJavaScriptSandboxProviders(),
    createTestSandboxProviders(options),
    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
  );

  if (options.fileCacheSync !== false) {
    FileCacheProvider.getInstance(injector).syncWithLocalFiles();
  }

  return injector;
}

export const createTestDependencyGraph = (graphOptions: IDependencyGraphStrategyOptions, injectorOptions: ISandboxTestProviderOptions) => {
  const injector = createSandboxTestInjector(injectorOptions);
  return DependencyGraphProvider.getInstance(graphOptions, injector);
}

export const evaluateDependency = async (dependency: Dependency) => {
  const sandbox = new Sandbox(dependency["_injector"]);
  await sandbox.open(dependency);
  return sandbox.exports;
}