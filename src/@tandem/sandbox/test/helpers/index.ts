import path =  require("path");
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
import { MemoryDataStore, ReadableStream } from "@tandem/mesh";
import { createJavaScriptSandboxProviders } from "@tandem/javascript-extension/sandbox";

import {
  Sandbox,
  FileCache,
  Dependency,
  IFileResolver,
  URIProtocol,
  IDependencyGraph,
  DependencyGraph,
  IDependencyLoader,
  URIProtocolProvider,
  FileCacheProvider,
  IFileResolverOptions,
  createSandboxProviders,
  IResolvedDependencyInfo,
  IDependencyLoaderResult,
  WebpackProtocolResolver,
  DependencyGraphProvider,
  ProtocolURLResolverProvider,
  WebpackDependencyGraphStrategy,
  DependencyGraphStrategyProvider,
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

export class MockFileURIProtocol extends URIProtocol {

  @inject(MockFilesProvider.ID)
  private _mockFiles: IMockFiles;

  private _watchers2: any;

  constructor() {
    super();
    this._watchers2 = {};
  }

  readDirectory(directoryPath: string): ReadableStream<any> {
    return new ReadableStream({
      start(controller) {
        controller.close();
      }
    })
  }

  exists(filePath: string): Promise<boolean> {
    return Promise.resolve(!!this._mockFiles[filePath]);
  }

  read(filePath: string): Promise<any> {
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
  write(filePath: string, content: string): Promise<void> {

    this._mockFiles[filePath] = content;

    if (this._watchers2[filePath]) {
      this._watchers2[filePath]();
    }

    return Promise.resolve();
  }
  watch2(filePath: string, onChange: Function): IDisposable {
    this._watchers2[filePath] = onChange;
    return {
      dispose: () => {
        this._watchers2[filePath] = undefined;
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
    createSandboxProviders(MockFileResolver),
    new URIProtocolProvider("file", MockFileURIProtocol)
  ];
}

export const createSandboxTestInjector = (options: ISandboxTestProviderOptions = {}) => {
  const injector = new Injector();
  const bus = new BrokerBus();
  bus.register(new UpsertBus(new MemoryDataStore()));

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