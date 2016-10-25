import { FileCache } from "./file-cache";
import { IFileSystem } from "./file-system";
import { IFileResolver } from "./resolver";
import { FileEditor, contentEditorType, IEditor } from "./editor";

import {
  Bundle,
  Bundler,
  IBundleLoader,
  bundleLoaderType,
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

export class FileSystemDependency extends Dependency<IFileSystem> {
  static readonly NS = "fileSystem";
  constructor(value: IFileSystem) {
    super(FileSystemDependency.NS, value);
  }

  static getInstance(dependencies: Dependencies): IFileSystem {
    const dependency = dependencies.query<FileSystemDependency>(this.NS);
    return dependency && dependency.value;
  }
  clone() {
    return new FileSystemDependency(this.value);
  }
}

export class FileResolverDependency extends Dependency<IFileResolver> {
  static readonly NS = "fileResover";
  constructor(value: IFileResolver) {
    super(FileResolverDependency.NS, value);
  }

  static getInstance(dependencies: Dependencies): IFileResolver {
    const dependency = dependencies.query<FileResolverDependency>(this.NS);
    return dependency && dependency.value;
  }

  clone() {
    return new FileResolverDependency(this.value);
  }
}

export class BundlerLoaderFactoryDependency extends ClassFactoryDependency {
  static readonly NS = "bundleLoader";
  constructor(readonly mimeType: string, value: bundleLoaderType) {
    super(BundlerLoaderFactoryDependency.getNamespace(mimeType), value);
  }
  static getNamespace(mimeType: string) {
    return [BundlerLoaderFactoryDependency.NS, mimeType].join("/");
  }
  create(dependencies: Dependencies): IBundleLoader {
    return super.create(dependencies);
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

export const FileCacheDependency  = createSingletonDependencyClass("fileCache", FileCache);
export const FileEditorDependency = createSingletonDependencyClass("fileEdit", FileEditor);
export const BundlerDependency    = createSingletonDependencyClass("bundler", Bundler);

export function createSandboxDependencies(fileSystem: IFileSystem, fileResover: IFileResolver) {
  return [
    new FileSystemDependency(fileSystem),
    new FileResolverDependency(fileResover),
    new FileCacheDependency(),
    new FileEditorDependency(),
    new BundlerDependency()
  ];
}