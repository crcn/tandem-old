import { IModule } from "./module";
import { EnvironmentKind } from "./environment";
import { ClassFactoryDependency, Dependencies } from "tandem-common";

type moduleType = { new(fileName: string, content: any): IModule };

export class ModuleFactoryDependency extends ClassFactoryDependency {
  static readonly MODULE_FACTORIES_NS = "moduleFactories";
  constructor(envKind: EnvironmentKind, mimeType: string, clazz: moduleType) {
    super(ModuleFactoryDependency.getNamespace(envKind, mimeType), clazz);
  }

  static getNamespace(envKind: EnvironmentKind, mimeType: string) {
    return [this.MODULE_FACTORIES_NS, envKind, mimeType].join("/");
  }

  create(fileName: string, content: string): IModule {
    return super.create(fileName, content);
  }

  static find(envKind: EnvironmentKind, mimeType: string, dependencies: Dependencies) {
    return dependencies.query<ModuleFactoryDependency>(this.getNamespace(envKind, mimeType));
  }
}