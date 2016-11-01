import { FileCache } from "./file-cache";
import { ENV_IS_NODE, IProvider } from "@tandem/common";
import { FileEditor, contentEditorType, IEditor } from "./editor";
import { IFileSystem, LocalFileSystem, RemoteFileSystem } from "./file-system";
import { IFileResolver, LocalFileResolver, RemoteFileResolver } from "./resolver";

import {
  Dependency,
  DependencyGraph,
  IDependencyLoader,
  IDependencyGraphStrategy,
  dependencyLoaderType,
  IDependencyGraphStrategyOptions,
 } from "./dependency-graph";

 import {
  ISandboxBundleEvaluator,
  sandboxBundleEvaluatorType,
 } from "./sandbox";

import {
  Provider,
  Injector,
  FactoryProvider,
  MimeTypeProvider,
  ClassFactoryProvider,
  createSingletonProviderClass,
} from "@tandem/common";

export class DependencyLoaderFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "bundleLoader";
  constructor(readonly mimeType: string, value: dependencyLoaderType) {
    super(DependencyLoaderFactoryProvider.getNamespace(mimeType), value);
  }
  static getNamespace(mimeType: string) {
    return [DependencyLoaderFactoryProvider.NS, mimeType].join("/");
  }
  create(strategy: IDependencyGraphStrategy): IDependencyLoader {
    return super.create(strategy);
  }
  static find(mimeType: string, injector: Injector): DependencyLoaderFactoryProvider {
    return injector.query<DependencyLoaderFactoryProvider>(this.getNamespace(mimeType));
  }
  clone() {
    return new DependencyLoaderFactoryProvider(this.mimeType, this.value);
  }
}

export class SandboxModuleEvaluatorFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "sandboxModuleEvaluator";
  constructor(readonly mimeType: string, clazz: sandboxBundleEvaluatorType) {
    super(SandboxModuleEvaluatorFactoryProvider.getNamespace(mimeType), clazz);
  }

  clone() {
    return new SandboxModuleEvaluatorFactoryProvider(this.mimeType, this.value);
  }

  static getNamespace(mimeType: string) {
    return [this.NS, mimeType].join("/");
  }

  create(): ISandboxBundleEvaluator {
    return super.create();
  }

  static find(mimeType: string, injector: Injector) {
    return injector.query<SandboxModuleEvaluatorFactoryProvider>(this.getNamespace(mimeType));
  }
}

export class ContentEditorFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "contentEditors";
  constructor(readonly mimeType: string, clazz: contentEditorType) {
    super(ContentEditorFactoryProvider.getNamespace(mimeType), clazz);
  }

  static getNamespace(mimeType: string) {
    return [ContentEditorFactoryProvider.NS, mimeType].join("/");
  }

  create(filePath: string, content: string): IEditor {
    return super.create(filePath, content);
  }

  static find(mimeType: string, injector: Injector) {
    return injector.query<ContentEditorFactoryProvider>(this.getNamespace(mimeType));
  }
}

export class DependencyGraphStratrgyProvider extends ClassFactoryProvider {
  static ID = "dependencyGraphStrategies";
  constructor(readonly name: string, clazz: { new(config:any): IDependencyGraphStrategy }) {
    super(DependencyGraphStratrgyProvider.getNamespace(name), clazz);
  }
  static getNamespace(name: string) {
    return [DependencyGraphStratrgyProvider.ID, name].join("/");
  }

  static create(strategyName: string, config: any, injector: Injector): IDependencyGraphStrategy {
    const dependency = injector.query<DependencyGraphStratrgyProvider>(this.getNamespace(strategyName));
    return dependency && dependency.create(config);
  }
}

export class DependencyGraphProvider extends Provider<any> {
  static ID = "dependencyGraphs";
  private _instances: { [Identifier:string]: DependencyGraph };
  constructor(readonly clazz: { new(strategy: IDependencyGraphStrategy, injector: Injector): DependencyGraph }) {
    super(DependencyGraphProvider.ID, clazz);
    this._instances = {};
  }
  clone() {
    return new DependencyGraphProvider(this.clazz);
  }
  getInstance(options: IDependencyGraphStrategyOptions): DependencyGraph {
    const strategyName = options && options.name || "default";
    if (this._instances[strategyName]) return this._instances[strategyName];
    return this._instances[strategyName] = this.owner.inject(new this.clazz(options && DependencyGraphStratrgyProvider.create(options.name, options.config, this.owner), this.owner));
  }
  static getInstance(options: IDependencyGraphStrategyOptions, injector: Injector): DependencyGraph {
    return injector.query<DependencyGraphProvider>(this.ID).getInstance(options);
  }
}

export const FileSystemProvider  = createSingletonProviderClass<IFileSystem>("fileSystem");
export const FileResolverProvider  = createSingletonProviderClass<IFileResolver>("fileResolver");
export const FileCacheProvider  = createSingletonProviderClass<FileCache>("fileCache");
export const FileEditorProvider = createSingletonProviderClass<FileEditor>("fileEdit");

// TODO - this needs to be a singleton based on a given strategy (webpack, systemjs, rollup)
// export const DependencyGraphProvider    = createSingletonProviderClass<DependencyGraph>("bundler");