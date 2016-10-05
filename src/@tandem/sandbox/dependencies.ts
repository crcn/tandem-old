import { IModule } from "./module";
import { Sandbox } from "./sandbox";
import { ClassFactoryDependency, FactoryDependency, Dependencies } from "@tandem/common";

export type moduleType = { new(fileName: string, content: string, sandbox: Sandbox): IModule };

// ModuleTranspilerDependency

export class ModuleFactoryDependency extends ClassFactoryDependency {
  static readonly MODULE_FACTORIES_NS = "moduleFactories";
  constructor(envMimeType: string, mimeType: string, clazz: moduleType) {
    super(ModuleFactoryDependency.getNamespace(envMimeType, mimeType), clazz);
  }

  static getNamespace(envMimeType: string, mimeType: string) {
    return [this.MODULE_FACTORIES_NS, envMimeType, mimeType].join("/");
  }

  create(fileName: string, content: string, sandbox: Sandbox): IModule {
    return super.create(fileName, content, sandbox);
  }

  static find(envMimeType: string, mimeType: string, dependencies: Dependencies) {
    return dependencies.query<ModuleFactoryDependency>(this.getNamespace(envMimeType, mimeType));
  }
}
