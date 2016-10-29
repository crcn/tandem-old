import { FileCache } from "./file-cache";
import { ENV_IS_NODE, Injector, IDependency } from "@tandem/common";
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
  Dependency,
  Dependencies,
  FactoryDependency,
  MimeTypeDependency,
  ClassFactoryDependency,
  createSingletonDependencyClass,
} from "@tandem/common";

export class BundlerLoaderFactoryDependency extends ClassFactoryDependency {
  static readonly NS = "bundleLoader";
  constructor(readonly mimeType: string, value: bundleLoaderType) {
    super(BundlerLoaderFactoryDependency.getNamespace(mimeType), value);
  }
  static getNamespace(mimeType: string) {
    return [BundlerLoaderFactoryDependency.NS, mimeType].join("/");
  }
  create(strategy: IBundleStragegy): IBundleLoader {
    return super.create(strategy);
  }
  static find(mimeType: string, dependencies: Dependencies): BundlerLoaderFactoryDependency {
    return dependencies.query<BundlerLoaderFactoryDependency>(this.getNamespace(mimeType));
  }
  clone() {
    return new BundlerLoaderFactoryDependency(this.mimeType, this.value);
  }
}

export class SandboxModuleEvaluatorFactoryDependency extends ClassFactoryDependency {
  static readonly NS = "sandboxModuleEvaluator";
  constructor(readonly envMimeType: string, readonly mimeType: string, clazz: sandboxBundleEvaluatorType) {
    super(SandboxModuleEvaluatorFactoryDependency.getNamespace(envMimeType, mimeType), clazz);
  }

  clone() {
    return new SandboxModuleEvaluatorFactoryDependency(this.envMimeType, this.mimeType, this.value);
  }

  static getNamespace(envMimeType: string, mimeType: string) {
    return [this.NS, envMimeType, mimeType].join("/");
  }

  create(): ISandboxBundleEvaluator {
    return super.create();
  }

  static find(envMimeType: string, mimeType: string, dependencies: Dependencies) {
    return dependencies.query<SandboxModuleEvaluatorFactoryDependency>(this.getNamespace(envMimeType, mimeType));
  }
}

export class ContentEditorFactoryDependency extends ClassFactoryDependency {
  static readonly NS = "contentEditors";
  constructor(readonly mimeType: string, clazz: contentEditorType) {
    super(ContentEditorFactoryDependency.getNamespace(mimeType), clazz);
  }

  static getNamespace(mimeType: string) {
    return [ContentEditorFactoryDependency.NS, mimeType].join("/");
  }

  create(filePath: string, content: string): IEditor {
    return super.create(filePath, content);
  }

  static find(mimeType: string, dependencies: Dependencies) {
    return dependencies.query<ContentEditorFactoryDependency>(this.getNamespace(mimeType));
  }
}

export class BundleStrategyDependency extends ClassFactoryDependency {
  static ID = "bundleStrategy";
  constructor(readonly name: string, clazz: { new(config:any): IBundleStragegy }) {
    super(BundleStrategyDependency.getNamespace(name), clazz);
  }
  static getNamespace(name: string) {
    return [BundleStrategyDependency.ID, this.name].join("/");
  }

  static create(strategyName: string, config: any, dependencies: Dependencies): IBundleStragegy {
    const dependency = dependencies.query<BundleStrategyDependency>(this.getNamespace(strategyName));
    return dependency && dependency.create(config);
  }
}

export class BundlerDependency extends Dependency<any> {
  static ID = "bundlers";
  private _instances: { [Identifier:string]: Bundler };
  constructor(readonly clazz: { new(strategy: IBundleStragegy, dependencies: Dependencies): Bundler }) {
    super(BundlerDependency.ID, clazz);
    this._instances = {};
  }
  clone() {
    return new BundlerDependency(this.clazz);
  }
  getInstance(options: IBundleStrategyOptions): Bundler {
    const strategyName = options && options.name || "default";
    if (this._instances[strategyName]) return this._instances[strategyName];
    return this._instances[strategyName] = Injector.inject(new this.clazz(options && BundleStrategyDependency.create(options.name, options.config, this.owner), this.owner), this.owner);
  }
  static getInstance(options: IBundleStrategyOptions, dependencies: Dependencies): Bundler {
    return dependencies.query<BundlerDependency>(this.ID).getInstance(options);
  }
}

export const FileSystemDependency  = createSingletonDependencyClass<IFileSystem>("fileSystem");
export const FileResolverDependency  = createSingletonDependencyClass<IFileResolver>("fileResolver");
export const FileCacheDependency  = createSingletonDependencyClass<FileCache>("fileCache");
export const FileEditorDependency = createSingletonDependencyClass<FileEditor>("fileEdit");

// TODO - this needs to be a singleton based on a given strategy (webpack, systemjs, rollup)
// export const BundlerDependency    = createSingletonDependencyClass<Bundler>("bundler");