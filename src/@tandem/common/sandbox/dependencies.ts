import { IModule } from "./module";
import { Sandbox } from "./sandbox";
import { ClassFactoryDependency, FactoryDependency, Dependencies } from "@tandem/common";

type moduleType = { new(fileName: string, content: string, sandbox: Sandbox): IModule };

// ModuleTranspilerDependency

export class ModuleFactoryDependency extends ClassFactoryDependency {
  static readonly MODULE_FACTORIES_NS = "moduleFactories";
  constructor(envKind: string, mimeType: string, clazz: moduleType) {
    super(ModuleFactoryDependency.getNamespace(envKind, mimeType), clazz);
  }

  static getNamespace(envKind: string, mimeType: string) {
    return [this.MODULE_FACTORIES_NS, envKind, mimeType].join("/");
  }

  create(fileName: string, content: string, sandbox: Sandbox): IModule {
    return super.create(fileName, content, sandbox);
  }

  static find(envKind: string, mimeType: string, dependencies: Dependencies) {
    return dependencies.query<ModuleFactoryDependency>(this.getNamespace(envKind, mimeType));
  }
}
