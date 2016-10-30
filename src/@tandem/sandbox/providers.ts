import { FileCache } from "./file-cache";
import { ENV_IS_NODE, IProvider } from "@tandem/common";
import { FileEditor, contentEditorType, IEditor } from "./editor";
import { IFileSystem, LocalFileSystem, RemoteFileSystem } from "./file-system";
import { IFileResolver, LocalFileResolver, RemoteFileResolver } from "./resolver";

import {
  Bundle,
  Bundler,
  IBundleLoader,
  IBundleStragegy,
  bundleLoaderType,
  IBundleStrategyOptions,
 } from "./bundle";

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

export class BundlerLoaderFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "bundleLoader";
  constructor(readonly mimeType: string, value: bundleLoaderType) {
    super(BundlerLoaderFactoryProvider.getNamespace(mimeType), value);
  }
  static getNamespace(mimeType: string) {
    return [BundlerLoaderFactoryProvider.NS, mimeType].join("/");
  }
  create(strategy: IBundleStragegy): IBundleLoader {
    return super.create(strategy);
  }
  static find(mimeType: string, injector: Injector): BundlerLoaderFactoryProvider {
    return injector.query<BundlerLoaderFactoryProvider>(this.getNamespace(mimeType));
  }
  clone() {
    return new BundlerLoaderFactoryProvider(this.mimeType, this.value);
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

export class BundleStrategyProvider extends ClassFactoryProvider {
  static ID = "bundleStrategy";
  constructor(readonly name: string, clazz: { new(config:any): IBundleStragegy }) {
    super(BundleStrategyProvider.getNamespace(name), clazz);
  }
  static getNamespace(name: string) {
    return [BundleStrategyProvider.ID, this.name].join("/");
  }

  static create(strategyName: string, config: any, injector: Injector): IBundleStragegy {
    const dependency = injector.query<BundleStrategyProvider>(this.getNamespace(strategyName));
    return dependency && dependency.create(config);
  }
}

export class BundlerProvider extends Provider<any> {
  static ID = "bundlers";
  private _instances: { [Identifier:string]: Bundler };
  constructor(readonly clazz: { new(strategy: IBundleStragegy, injector: Injector): Bundler }) {
    super(BundlerProvider.ID, clazz);
    this._instances = {};
  }
  clone() {
    return new BundlerProvider(this.clazz);
  }
  getInstance(options: IBundleStrategyOptions): Bundler {
    const strategyName = options && options.name || "default";
    if (this._instances[strategyName]) return this._instances[strategyName];
    return this._instances[strategyName] = this.owner.inject(new this.clazz(options && BundleStrategyProvider.create(options.name, options.config, this.owner), this.owner));
  }
  static getInstance(options: IBundleStrategyOptions, injector: Injector): Bundler {
    return injector.query<BundlerProvider>(this.ID).getInstance(options);
  }
}

export const FileSystemProvider  = createSingletonProviderClass<IFileSystem>("fileSystem");
export const FileResolverProvider  = createSingletonProviderClass<IFileResolver>("fileResolver");
export const FileCacheProvider  = createSingletonProviderClass<FileCache>("fileCache");
export const FileEditorProvider = createSingletonProviderClass<FileEditor>("fileEdit");

// TODO - this needs to be a singleton based on a given strategy (webpack, systemjs, rollup)
// export const BundlerProvider    = createSingletonProviderClass<Bundler>("bundler");