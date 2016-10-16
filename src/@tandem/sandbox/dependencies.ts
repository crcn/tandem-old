import { IModule } from "./module";
import { Sandbox } from "./sandbox";
import { IFileSystem } from "./file-system";
import {
  Dependency,
  Dependencies,
  FactoryDependency,
  ClassFactoryDependency,
} from "@tandem/common";

export type moduleType = { new(fileName: string, content: string, sandbox: Sandbox): IModule };

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

  create(fileName: string, content: string, sandbox: Sandbox): IModule {
    return super.create(fileName, content, sandbox);
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
}