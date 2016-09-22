import { IModule } from "./module";
import { ClassFactoryDependency, Dependencies } from "tandem-common";

type moduleType = { new(content: any): IModule };

export class ModuleFactoryDependency extends ClassFactoryDependency {
  static readonly MODULE_FACTORIES_NS = "moduleFactories";
  constructor(envKind: number, mimeType: string, clazz: moduleType) {
    super(ModuleFactoryDependency.getNamespace(envKind, mimeType), clazz);;
  }

  static getNamespace(envKind: number, mimeType: string) {
    return [this.MODULE_FACTORIES_NS, envKind, mimeType].join("/");
  }

  create(content: string) {
    return super.create(content);
  }

  static find(envKind: number, mimeType: string, dependencies: Dependencies) {
    return dependencies.query<ModuleFactoryDependency>(this.getNamespace(envKind, mimeType));
  }
}