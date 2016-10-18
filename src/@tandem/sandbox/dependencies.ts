import { IModule } from "./module";
import { Sandbox } from "./sandbox";
import { IFileSystem } from "./file-system";
import { IFileResolver } from "./resolver";
import { FileCache } from "./file-cache";
import { IBundleLoader, bundleLoaderType, bundleTransformerType, IBundleTransformer } from "./bundle";
import {
  Dependency,
  Dependencies,
  FactoryDependency,
  MimeTypeDependency,
  ClassFactoryDependency,
  createSingletonDependencyClass,
} from "@tandem/common";

export type moduleType = { new(filePath: string, content: string, sandbox: Sandbox): IModule };

// ModuleTranspilerDependency

export class SandboxModuleFactoryDependency extends ClassFactoryDependency {
  static readonly MODULE_FACTORIES_NS = "moduleFactories";
  constructor(readonly envMimeType: string, readonly mimeType: string, clazz: moduleType) {
    super(SandboxModuleFactoryDependency.getNamespace(envMimeType, mimeType), clazz);
  }

  clone() {
    return new SandboxModuleFactoryDependency(this.envMimeType, this.mimeType, this.value);
  }

  static getNamespace(envMimeType: string, mimeType: string) {
    return [this.MODULE_FACTORIES_NS, envMimeType, mimeType].join("/");
  }

  create(filePath: string, content: string, sandbox: Sandbox): IModule {
    return super.create(filePath, content, sandbox);
  }

  static find(envMimeType: string, mimeType: string, dependencies: Dependencies) {
    return dependencies.query<SandboxModuleFactoryDependency>(this.getNamespace(envMimeType, mimeType));
  }
}

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
  static create(mimeType: string, dependencies: Dependencies): IBundleLoader {
    const dependency = dependencies.query<BundlerLoaderFactoryDependency>(this.getNamespace(mimeType));
    if (!dependency) {
      throw new Error(`Cannot create bundle loader from mime type ${mimeType}.`);
    }
    return dependency.create(dependencies);
  }

  static createFromFilePath(filePath: string, dependencies: Dependencies): IBundleLoader {
    return this.create(MimeTypeDependency.lookup(filePath, dependencies), dependencies);
  }
  clone() {
    return new BundlerLoaderFactoryDependency(this.mimeType, this.value);
  }
}

export class BundleTransformerFactoryDependency extends ClassFactoryDependency {
  static readonly NS = "bundleTransformer";
  constructor(readonly mimeType: string, value: bundleTransformerType) {
    super(BundleTransformerFactoryDependency.getNamespace(mimeType), value);
  }
  static getNamespace(mimeType: string) {
    return [BundleTransformerFactoryDependency.NS, mimeType].join("/");
  }
  create(dependencies: Dependencies): IBundleTransformer {
    return super.create(dependencies);
  }
  static find(mimeType: string, dependencies: Dependencies) {
    return dependencies.query<BundleTransformerFactoryDependency>(this.getNamespace(mimeType));
  }
  clone() {
    return new BundleTransformerFactoryDependency(this.mimeType, this.value);
  }
}

export const FileCacheDependency = createSingletonDependencyClass("fileCache", FileCache);